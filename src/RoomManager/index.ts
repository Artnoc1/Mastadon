import {Global} from  "../Global";

export function Setup(){
    for (var key in Game.rooms) {
        console.log(key, JSON.stringify(Game.rooms[key]));
        console.log(JSON.stringify(Memory.rooms[key]));
      }
    
}