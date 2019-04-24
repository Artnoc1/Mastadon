declare interface CreepMemory { [name: string]: any };
declare interface SpawnMemory { [name: string]: any };

declare interface RoomMemory {
    sources: any[],
    statuses: {
        sourcesMapped: boolean;
        roadsCreated: boolean;
        openSpacesCalced: boolean;
    },
    spawnQueue: any[]
};

declare interface FlagMemory { [name: string]: any };

