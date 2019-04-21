declare interface CreepMemory { [name: string]: any };
declare interface SpawnMemory { [name: string]: any };

declare interface RoomMemory {
    sources: Source[],
    sourcePaths: PathStep[][],
    sourceSpaces: {
        id: string,
        space: number
    }[],
    statuses: {
        sourcesMapped: boolean;
        roadsCreated: boolean;
        openSpacesCalced: boolean;
    }
};

declare interface FlagMemory { [name: string]: any };

