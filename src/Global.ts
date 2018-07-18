import { StructureMap } from "./RoomManager/RoomManagerModels";


export module Global{
    
}

export class RoomMem{
    pathsSet:boolean =false;
    containersSet:boolean = false;
    StructMap:StructureMap;
    /**
     *
     */
    constructor(data: RoomMemory) {
        this.StructMap = data.StructMap;
    }
}
