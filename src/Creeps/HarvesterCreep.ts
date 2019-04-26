import { BaseCreep } from "./BaseCreep";
import { SourceData } from "Global/GlobalModels";
import { close } from "fs";


export class HarvesterCreep extends BaseCreep {

    run(): void {
        console.log("doing miner things...")
        this.DoMinerActions();
    }

    DoMinerActions() {
        let target = this.FindOpenSource();
        if (_.sum(this.creep.carry) < this.creep.carryCapacity) {
            if (this.creep.harvest(target) == ERR_NOT_IN_RANGE) {
                console.log("supposed to move")
                this.creep.moveTo(target);
            }
        }

        if (_.sum(this.creep.carry) == this.creep.carryCapacity) {
            let storage: any;
            var sourceData = (this.creep.memory.assignment as SourceData);
            if (sourceData.defaultContainer) {
                storage = sourceData.defaultContainer;
            } else {
                storage = this.TryGetDefaultContainer();
            }
            //TODO: thos whole thing is bad. Store location in GoingTo memory spot and reuse
            if (this.creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(storage);
            }
        }

    }

    AssignMinerSource(): SourceData {
        var sourceData = _.find(this.creep.room.memory.sources as SourceData[], s => {
            return s.harvesterSpace.creepNames.length < s.harvesterSpace.max;
        });

        this.creep.memory.assignment = sourceData;
        return sourceData as SourceData;
    }

    TryGetDefaultContainer(): StructureContainer {
        var closest = null;
        if (this.creep.room.memory.statuses.sourceContainersCreated) {
            var sourceData = this.creep.memory.assignment as SourceData;
            closest = this.creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: str => {
                    return str.structureType == STRUCTURE_CONTAINER;
                }
            });
            if ((closest as StructureContainer).pos == sourceData.defaultContainerPos) {
                sourceData.defaultContainer = (closest as StructureContainer);
            }
        } else {
            closest = this.creep.room.find(FIND_MY_SPAWNS)[0];
        }


        return closest as StructureContainer;
    }

    FindOpenSource(): Source {

    }


}
