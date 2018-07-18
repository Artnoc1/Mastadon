import { Global, RoomMem } from '../Global';
import { StructureMap } from './RoomManagerModels';
import * as _ from "lodash";


export function Setup(){
    for (var key in Game.rooms) {
        var room = Game.rooms[key];
        let roomMem = GetRoomMem(room);

        if(roomMem.pathsSet && !roomMem.containersSet){
            roomMem = GetRoomMem(room);
            CreatePathContainers(room);
            roomMem.containersSet = true;
            room.memory = roomMem;
        }

        if(!roomMem.pathsSet){
            CreateStructureMap(room);
            CreateStartingPaths(room);
            roomMem = GetRoomMem(room);
            roomMem.pathsSet = true;
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

function CreatePathContainers(room: Room){
    console.log("Creatting containers...")
    var spawn = room.find(FIND_MY_SPAWNS)[0];
    console.log("Got Paths")
    console.log(JSON.stringify((room.memory as RoomMem)))
    if((room.memory as RoomMem).StructMap){
        console.log("before the loop");
        (room.memory as RoomMem).StructMap.sourcemap.forEach(source => {
            console.log("Da fuq", JSON.stringify(source));
            console.log(JSON.stringify(spawn.pos));
            var pos = spawn.pos
            var path = room.findPath(source.pos ,pos);
            console.log("da fuq again")
            // var subPath = path.splice(2,path.length -2);
            
            // CheckSurroundings(subPath[0],room);
            // path.forEach(position => {
            //     var spot = CheckSurroundings(position,room);
            // });        
        });
    }
    
}

function CheckSurroundings(pos: PathStep, room: Room){
    var left = pos.x -1;
    var right = pos.x + 1;
    var top = pos.y - 1;
    var bot = pos.y + 1;
    
    var location = null;
    var area = room.lookAtArea(top,left,bot,right,false);
    console.log(JSON.stringify(area))
    return location;
}

function GetRoomMem(room: Room){
   return (room.memory as RoomMem);
}
