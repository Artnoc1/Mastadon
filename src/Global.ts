import { StructureMap } from "./RoomManager/RoomManagerModels";


export module Global{
    
}

export class RoomMem{
    StructMap:StructureMap;
    /**
     *
     */
    constructor(data: RoomMemory) {
        this.StructMap = data.StructMap;
        
    }
}
