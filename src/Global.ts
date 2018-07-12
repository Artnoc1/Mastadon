import { StructureMap } from "./RoomManager/RoomManagerModels";


export module Global{
    
}

export class RoomMem{
    isSetup:boolean =false;
    StructMap:StructureMap;
    /**
     *
     */
    constructor(data: RoomMemory) {
        this.StructMap = data.StructMap;
        
    }
}
