import * as _ from "lodash";
import { RoomStatuses } from "Global/GlobalModels";
import { PopulationManager } from "Spawners/PopulationManager";


export class RoomMapper {

    static provision() {
        var pm = new PopulationManager();
        var rooms = Game.rooms
        for (var name in rooms) {

            let currentRoom: Room = rooms[name];
            if (!currentRoom.memory.statuses) {
                currentRoom.memory.statuses = new RoomStatuses();
            }
            this.mapRooms(currentRoom);
            this.createPaths(currentRoom);
            this.populateOpenSourceSpaces(currentRoom);
            pm.CreatePopulationQueue(currentRoom);
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
            console.log(JSON.stringify(currentRoom.memory.statuses));
            console.log("Got here");
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
}
