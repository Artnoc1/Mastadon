declare interface CreepMemory { [name: string]: any };
declare interface SpawnMemory { [name: string]: any };

declare interface RoomMemory {
    sources: { [id: string]: any },
    statuses: {
        sourcesMapped: boolean;
        roadsCreated: boolean;
        openSpacesCalced: boolean;
        sourceContainersCreated: boolean;
    },
    spawnQueue: any[]
};

declare interface FlagMemory { [name: string]: any };

