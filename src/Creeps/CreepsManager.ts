

export class CreepManager {

    ManageCreeps(currentRoom: Room) {

    }

    DoMinerActions(creep: Creep) {
        const target: Source = creep.memory.assignment;

        if (!target) {
            this.AssignMinerSource(creep);
        }

        if (_.sum(creep.carry) < creep.carryCapacity) {
            if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }

        if (_.sum(creep.carry) == creep.carryCapacity) {
            var storage = (creep.memory.assignment as Source);
            if (creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
            }
        }

    }

    AssignMinerSource(miner: Creep) {

    }
}
