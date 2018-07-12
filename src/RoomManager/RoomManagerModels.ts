
export class StructureMap{
    sourcemap:SourceInfo[] = [];

    /**
     * creates a map of the natureal structures in the room on startup
     */
    constructor(room: Room) {
        var sources = room.find(FIND_SOURCES);
        sources.forEach(source => {
            this.sourcemap.push(new SourceInfo(source))
        });
        
    }
}

class SourceInfo{
    pos:RoomPosition;
    spaces: number = 0;

    /**
     * quick access object for sources
     */
    constructor(source: Source) {
        this.pos = source.pos;
        var left = this.pos.x -1;
        var right = this.pos.x + 1;
        var top = this.pos.y - 1;
        var bot = this.pos.y + 1;
        // loop through positions around source and check for empty spaces
        for (let x = left; x <= right; x++) {
            for (let y = top; y <= bot; y++) {
                var spot = source.room.lookAt(x,y);
                if(spot[0].type == "terrain" && spot[0].terrain != "wall"){
                    this.spaces += 1;
                }
            }
        }

    }
}



