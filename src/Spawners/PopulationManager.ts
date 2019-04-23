export class SpawnManager {

    CreateSpawnQueue(room: Room): void {
        //TODO: At some point do this right
        room.memory.spawnQueue = [
            new SpawnQueueItem(CreepType.MINER, 6)
        ]
    }

    SpawnFromQueue(room: Room) {
        var queue = this.GetSpawnQueue(room);
        var spawner = room.find(FIND_MY_SPAWNS)[0];

        if (!spawner.spawning) {
            var queueItem = this.GetTopOfQueue(queue);

            if (queueItem) {
                var body = this.GetBodyForCreepType(queueItem.CreepType);
                var creepmemory: CreepMemory = {
                    role: queueItem.CreepType,
                    room: room.name,
                    working: false
                };
                var spawnOptions: SpawnOptions = {
                    memory: creepmemory
                };
                //TODO: figure out better naming convention because this will break
                var res = spawner.spawnCreep(body, queueItem.CreepType + new Date().getMilliseconds(), spawnOptions);

                if (res == OK) {
                    queueItem.QueueNumber -= 1;
                    if (queueItem.QueueNumber == 0) {
                        queue = queue.filter(item => {
                            item != queueItem;
                        });
                    }
                }
            }
        }
    }

    GetSpawnQueue(room: Room): SpawnQueueItem[] {
        return room.memory.spawnQueue;
    }

    GetBodyForCreepType(type: CreepType): BodyPartConstant[] {
        switch (type) {
            //Just miner for now until i figure out what the rest are gonna look like and how to progress as room levels up
            case CreepType.MINER:
                return [WORK, CARRY, MOVE];

            default:
                console.log("No preset body for creep type ", type);
                return [WORK, CARRY, MOVE]
        }
    }

    GetTopOfQueue(queue: SpawnQueueItem[]): SpawnQueueItem | null {
        var result = null;
        for (let x = 0; x < queue.length; x++) {
            var item = queue[x];
            if (item.QueueNumber > 0) {
                result = item;
                break;
            }
        }
        return result;
    }

    // AdjustSpawnQueue(room: Room, type: CreepType, amount?: number) {
    //     var pq = this.GetSpawnQueue(room);
    //     var existing = _.find(pq, i => {
    //         i.CreepType == type;
    //     });
    //     if (existing) {
    //         existing.QueueNumber += (amount == null) ? 1 : amount;
    //     }
    // }

    AddToSpawnQueue(room: Room, item: SpawnQueueItem) {
        room.memory.spawnQueue.push(item);
    }
}

export class SpawnQueueItem {
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
    MINER = "miner",
    CARRIER = "carrier",
    SCOUT = "scout",
    HEALER = "healer",
    SOLDIER = "soldier",
    BUILDER = "builder",
    SHOOTER = "shooter"
}
