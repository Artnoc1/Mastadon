import { Global, RoomMem } from '../Global';
import { StructureMap } from './RoomManagerModels';


export function Setup(){
    for (var key in Game.rooms) {
        var room = Game.rooms[key];
        var roomMem =  new RoomMem(Memory.rooms[key]);
        if(!roomMem.StructMap){
           roomMem.StructMap = new StructureMap();
        }
        
        
      }
    
}