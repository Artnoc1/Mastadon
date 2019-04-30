declare interface CreepMemory { [name: string]: any };
declare interface SpawnMemory { [name: string]: any };

declare interface RoomMemory {
    sources: { [id: string]: any },
    statuses: {
        sourcesMapped: boolean;
        roadsCreated: boolean;
        openSpacesCalced: boolean;
        sourceContainersBuilt: boolean;
        sourceContainersMapped: boolean;
    },
    spawnQueue: any[]
};

declare interface FlagMemory { [name: string]: any };

