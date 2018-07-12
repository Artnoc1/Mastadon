
export class StructureMap{
    sourcemap:SourceInfo[] = [];

}

class SourceInfo{
    pos:RoomPosition;
    spaces: number = 0;

    /**
     *
     */
    constructor(pos: RoomPosition) {
        this.pos = pos;
    }
}



