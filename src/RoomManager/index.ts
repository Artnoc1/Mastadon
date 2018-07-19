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
    var rm = (room.memory as RoomMem);
    rm.StructMap.sourcemap.forEach(source => {
        var opts: FindPathOpts  = {};
        var path = room.findPath(source.pos ,spawn.pos)
        rm.pathSets.push(path);
        path.forEach(position => {
            room.createConstructionSite(position.x, position.y, STRUCTURE_ROAD);
        });        
    });

    if(room.controller){
        var ctr = (room.controller as StructureController);
        var path = room.findPath(ctr.pos, spawn.pos)
        rm.pathSets.push(path);
        path.forEach(position => {
            room.createConstructionSite(position.x, position.y, STRUCTURE_ROAD);
        });
    }
    room.memory = rm;
}

function CreatePathContainers(room: Room){
    console.log("Creatting containers...")
    var spawn = room.find(FIND_MY_SPAWNS)[0];
    console.log("Got Paths")
    console.log(JSON.stringify((room.memory as RoomMem)))
    if((room.memory as RoomMem).pathSets){
        
        (room.memory as RoomMem).pathSets.forEach(path => {
            
            console.log("path: ", path)
            var subPath = path.splice(1,path.length -2);
            for (let i = 0; i < subPath.length; i++) {
                const spot = subPath[i];
                var empty = CheckSurroundings(spot,room);
                if(empty){
                    room.createConstructionSite(empty.x,empty.y,STRUCTURE_CONTAINER);
                    break;
                }
            }
                    
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
    
    console.log("Area: ",JSON.stringify(area))
    for (var ykey in area){
        var yCol = area[ykey];
        for(var xkey in yCol){
        
            if(area[ykey][xkey].length==1&&(area[ykey][xkey] as any)[0].terrain != "wall" ){
                location = {x:parseInt(xkey),y:parseInt(ykey)}
                console.log("Selected spot: ", JSON.stringify(location))
                break;
            }
        }
        break;
    }
    

    return location;
}

function GetRoomMem(room: Room){
   return (room.memory as RoomMem);
}
