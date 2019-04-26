import * as _ from "lodash";
import { RoomStatuses, SourceData } from "Global/GlobalModels";
import { SpawnManager } from "Spawners";

export class RoomMapper {

    static provision() {
        var pm = new SpawnManager();
        var rooms = Game.rooms
        for (var name in rooms) {

            let currentRoom: Room = rooms[name];
            if (!currentRoom.memory.statuses) {
                currentRoom.memory.statuses = new RoomStatuses();
            }
            this.mapRooms(currentRoom);
            this.createPaths(currentRoom);
            this.populateOpenSourceSpaces(currentRoom);
            this.CreateSourceContainers(currentRoom);
            if (!currentRoom.memory.spawnQueue) {
                pm.CreateSpawnQueue(currentRoom);
            }
            pm.SpawnFromQueue(currentRoom);

        }
    }

    private static mapRooms(currentRoom: Room) {

        if (!currentRoom.memory.statuses.sourcesMapped) {
            let roomSources = currentRoom.find(FIND_SOURCES);
            let sourcesData: { [id: string]: SourceData } = {};
            roomSources.map(source => {
                sourcesData[source.id] = new SourceData();
            });

            _.forOwn(sourcesData, function (sourceData, key) {
                var source = Game.getObjectById(key);
                var spawnPos = currentRoom.find(FIND_MY_SPAWNS)[0].pos;
                sourceData.paths.push(currentRoom.findPath(spawnPos, (source as Source).pos));
            });

            currentRoom.memory.sources = sourcesData;
            currentRoom.memory.statuses.sourcesMapped = true;
        }
    }

    private static createPaths(currentRoom: Room) {
        if (currentRoom.memory.statuses.sourcesMapped) {

            _.forOwn(currentRoom.memory.sources, function (sourceData, key) {
                (sourceData as SourceData).paths.map(path => {
                    path.map(s => {
                        currentRoom.createConstructionSite(s.x, s.y, STRUCTURE_ROAD);
                        (sourceData as SourceData).defaultContainerPos = new RoomPosition(s.x, s.y, currentRoom.name);
                    });
                });
            });
            currentRoom.memory.statuses.roadsCreated = true;
        }
    }

    private static populateOpenSourceSpaces(currentRoom: Room) {
        if (currentRoom.memory.statuses.sourcesMapped && currentRoom.memory.statuses.openSpacesCalced == false) {
            _.forOwn((currentRoom.memory.sources as { [id: string]: SourceData }), function (sourceData, key) {
                sourceData.harvesterSpace = {
                    max: RoomMapper.CalculateOpenSpace(currentRoom, (sourceData.sourcePosition as RoomPosition)),
                    creepNames: []
                }
            });

            currentRoom.memory.statuses.openSpacesCalced = true;
        }
    }

    private static CalculateOpenSpace(room: Room, position: RoomPosition): number {
        let top = position.y - 1;
        let bot = position.y + 1;
        let left = position.x - 1;
        let right = position.x + 1;
        console.log("Looking at area...");
        let area = room.lookAtArea(top, left, bot, right);
        console.log(JSON.stringify(area));
        var sum = 0;
        for (var y in area) {
            var col = area[y];
            for (var x in col) {
                var row = col[x];
                var result = row.filter(s => {
                    return s.terrain && s.terrain == "wall";
                });
                if (!result.length) {
                    sum += 1;
                }
            }
        }

        return sum;
    }

    private static GetOpenSpaces() {

    }

    private static CreateSourceContainers(room: Room) {
        if (room.memory.statuses.sourcesMapped) {

            _.forOwn((room.memory.sources as { [id: string]: SourceData }), function (sourceData, key) {
                sourceData.paths.map(path => {
                    var step = path[path.length - 3];
                    var rootX = step.x;
                    var rootY = step.y;
                    var x = 0, y = 0;

                    x = rootX, y = rootY - 1;
                    var res = room.createConstructionSite(x, y, STRUCTURE_CONTAINER);
                    if (res != OK) {
                        x = rootX, y = rootY + 1;
                        res = room.createConstructionSite(x, y, STRUCTURE_CONTAINER);
                    } else if (res != OK) {
                        x = rootX - 1, y = rootY;
                        res = room.createConstructionSite(x, y, STRUCTURE_CONTAINER);
                    } else if (res != OK) {
                        x = rootX + 1, y = rootY;
                        res = room.createConstructionSite(x, y, STRUCTURE_CONTAINER);
                    }
                    if (res == OK) {
                        sourceData.defaultContainerPos = new RoomPosition(x, y, room.name);
                    }
                    //console.error("Could not place container for path");
                });
            });
        }
    }
}
