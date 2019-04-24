import { BaseCreep } from "./BaseCreep";
import { SourceData } from "Global/GlobalModels";


export class HarvesterCreep extends BaseCreep {

    run(): void {

    }

    DoMinerActions() {
        const target: Source = this.creep.memory.assignment;

        if (!target) {
            this.AssignMinerSource();
        }

        if (_.sum(this.creep.carry) < this.creep.carryCapacity) {
            if (this.creep.harvest(target) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(target);
            }
        }

        if (_.sum(this.creep.carry) == this.creep.carryCapacity) {
            let storage: any;
            var memory = (this.creep.memory.assignment as SourceData);
            if (memory.defaultContainer) {
                storage = memory.defaultContainer;
            } else {

            }


            if (this.creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(storage);
            }
        }

    }

    AssignMinerSource() {
        var sourceData = _.find(this.creep.room.memory.sources as SourceData[], s => {
            s.harvesterSpace.creepNames.length < s.harvesterSpace.max;
        });
        this.creep.memory.assignment = sourceData;
    }

}
