import {Global, RoomMemory} from  "../Global";
import { StructureMap } from "./RoomManagerModels";

export function Setup(){
    for (var key in Game.rooms) {
        var room = Game.rooms[key];
        var roomMem: RoomMemory = Memory.rooms[key];
        if(!roomMem.StructureMap){
            Memory.rooms[key].StructureMap = new StructureMap();
        }
        
        
      }
    
}