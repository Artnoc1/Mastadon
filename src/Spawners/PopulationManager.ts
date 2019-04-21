export class PopulationManager {

    CreatePopulationQueue(room: Room): void {
        room.memory.populationQueue = [
            new PopulationQueueItem(CreepType.Miner, 6)
        ]
    }

}

export class PopulationQueueItem {
    /**
     *
     */
    constructor(creepType: CreepType, queueNumber?: number) {
        this.CreepType = creepType;
        if (queueNumber) {
            this.QueueNumber = queueNumber;
        }
    }
    CreepType: CreepType;
    QueueNumber: number = 0;
}

export enum CreepType {
    Miner,
    Worker,
    Fighter,
    Currier
}
