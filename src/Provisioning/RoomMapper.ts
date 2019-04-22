import * as _ from "lodash";
import { RoomStatuses } from "Global/GlobalModels";
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
            let sourcePaths: any[] = [];
            currentRoom.memory.sources = roomSources;
            roomSources.forEach(s => {
                var spawnPos = currentRoom.find(FIND_MY_SPAWNS)[0].pos;
                sourcePaths.push(currentRoom.findPath(spawnPos, s.pos));
            });
            currentRoom.memory.sourcePaths = sourcePaths;
            currentRoom.memory.statuses.sourcesMapped = true;
        }
    }

    private static createPaths(currentRoom: Room) {
        if (currentRoom.memory.statuses.sourcesMapped) {
            currentRoom.memory.sourcePaths.forEach(path => {
                path.forEach(s => {
                    currentRoom.createConstructionSite(s.x, s.y, STRUCTURE_ROAD);
                })
            });
            currentRoom.memory.statuses.roadsCreated = true;
        }
    }

    private static populateOpenSourceSpaces(currentRoom: Room) {
        if (currentRoom.memory.statuses.sourcesMapped && currentRoom.memory.statuses.openSpacesCalced == false) {
            var spaces: any[] = [];
            currentRoom.memory.sources.map(s => {
                spaces.push({
                    id: s.id,
                    space: RoomMapper.CalculateOpenSpace(currentRoom, s.pos)
                });
            });
            currentRoom.memory.sourceSpaces = spaces;
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

            room.memory.sourcePaths.map(path => {
                var step = path[path.length - 3];
                //Try top

                var res = room.createConstructionSite(step.x, step.y - 1, STRUCTURE_CONTAINER);
                if (res != OK) {
                    res = room.createConstructionSite(step.x, step.y + 1, STRUCTURE_CONTAINER);
                } else if (res != OK) { //try bot
                    res = room.createConstructionSite(step.x - 1, step.y, STRUCTURE_CONTAINER);
                } else if (res != OK) { //try left
                    res = room.createConstructionSite(step.x + 1, step.y, STRUCTURE_CONTAINER);
                }
                console.error("Could not place container for path");
            });
        }
    }
}
