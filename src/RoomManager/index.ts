import { Global, RoomMem } from '../Global';
import { StructureMap } from './RoomManagerModels';
import * as _ from "lodash";


export function Setup(){
    for (var key in Game.rooms) {
        var room = Game.rooms[key];
        var roomMem = (room.memory as RoomMem);
        if(!roomMem.isSetup){
            CreateStructureMap(room);
            CreateStartingPaths(room);
            roomMem.isSetup = true;
            room.memory = roomMem;
        }
    }
    
}

function CreateStructureMap(room: Room){
    var roomMem =  new RoomMem(room.memory);
    if(!roomMem.StructMap){
        console.log("Setting up structure map for room: ", room.name);
        roomMem.StructMap = new StructureMap(room);
        room.memory = roomMem;
    }
}

function CreateStartingPaths(room: Room){
    var spawn = room.find(FIND_MY_SPAWNS)[0];
    (room.memory as RoomMem).StructMap.sourcemap.forEach(source => {
        var opts: FindPathOpts  = {};
        var path = room.findPath(source.pos ,spawn.pos)
        path.forEach(position => {
            room.createConstructionSite(position.x, position.y, STRUCTURE_ROAD);
        });

        

    });
    if(room.controller){
        var ctr = (room.controller as StructureController);
        var path = room.findPath(spawn.pos, ctr.pos )
        path.forEach(position => {
            room.createConstructionSite(position.x, position.y, STRUCTURE_ROAD);
        });
    }
}

function CheckSurroundings(pos: PathStep, room: Room){
    var left = pos.x -1;
        var right = pos.x + 1;
        var top = pos.y - 1;
        var bot = pos.y + 1;
        var found = false;
        var location = null;
        // loop through positions around source and check for empty spaces
        for (let x = left; x <= right; x++) {
            for (let y = top; y <= bot; y++) {
                var spot = room.lookAt(x,y);
                if(spot[0].type == "terrain" && spot[0].terrain != "wall"){
                    found = true;
                    location = {x,y};
                    break;
                }
            }
        }
        return location;
}