export class RoomStatuses {
    sourcesMapped: boolean = false;
    roadsCreated: boolean = false;
    openSpacesCalced: boolean = false;
}

export class SourceData {
    /**
     *
     */
    constructor(source: Source, harvesterSpace?: { max: number, creepNames: string[] }, paths?: PathStep[][], defaultContainer?: RoomPosition) {
        this.source = source;
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
        if (defaultContainer) {
            this.defaultContainer = defaultContainer;
        }
    }
    source: Source;
    harvesterSpace: {
        max: number,
        creepNames: string[]
    };
    paths: PathStep[][] = [];
    defaultContainer?: RoomPosition;
}
