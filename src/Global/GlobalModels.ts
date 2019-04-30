export class RoomStatuses {
    sourcesMapped: boolean = false;
    roadsCreated: boolean = false;
    openSpacesCalced: boolean = false;
    sourceContainersBuilt: boolean = false;
    sourceContainersMapped: boolean = false;
}

export class SourceData {
    /**
     *
     */
    constructor(harvesterSpace?: { max: number, creepNames: string[] }, paths?: PathStep[][], defaultContainerId?: string) {
        if (harvesterSpace) {
            this.harvesterSpace = harvesterSpace;
        } else {
            this.harvesterSpace = {
                max: 0,
                creepNames: []
            }
        }
        if (paths) {
            this.paths = paths;
        }
        if (defaultContainerId) {
            this.defaultContainerId = defaultContainerId;
        }
    }
    sourcePosition?: RoomPosition;
    harvesterSpace: {
        max: number,
        creepNames: string[]
    };
    paths: PathStep[][] = [];
    defaultContainerId?: string;
    defaultContainerCreated?: boolean = false;
    defaultContainerPos?: RoomPosition;
}
