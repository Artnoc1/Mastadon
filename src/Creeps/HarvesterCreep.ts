import { BaseCreep } from "./BaseCreep";
import { SourceData } from "Global/GlobalModels";
import { close } from "fs";


export class HarvesterCreep extends BaseCreep {

    run(): void {
        this.DoMinerActions();
    }

    DoMinerActions() {
        let target: any = null;
        if (!this.creep.memory.assignment) {
            var sourceId = this.FindOpenSource() as string;
            target = Game.getObjectById(sourceId);
            this.creep.memory.assignment = sourceId;
            console.log("Creep ass: ", sourceId);
            (this.creep.room.memory.sources[sourceId] as SourceData).harvesterSpace.creepNames.push(this.creep.name);
        } else {
            target = Game.getObjectById(this.creep.memory.assignment);
        }

        if (_.sum(this.creep.carry) < this.creep.carryCapacity) {
            if (this.creep.harvest(target) == ERR_NOT_IN_RANGE) {

                this.creep.moveTo(target);
            }
        }
        else if (_.sum(this.creep.carry) == this.creep.carryCapacity) {
            let storage = this.TryGetDefaultContainer();
            //TODO: thos whole thing is bad. Store location in GoingTo memory spot and reuse
            if (this.creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(storage);
            }
        }

    }

    TryGetDefaultContainer(): StructureContainer | StructureSpawn {
        var closest = null;
        if (this.creep.room.memory.statuses.sourceContainersCreated) {
            closest = this.creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: str => {
                    return str.structureType == STRUCTURE_CONTAINER;
                }
            });

        } else {
            closest = this.creep.room.find(FIND_MY_SPAWNS)[0];
        }


        return closest as StructureContainer | StructureSpawn;
    }

    FindOpenSource(): string | null {
        var creep = this.creep;
        var sourceId = _.findKey((this.creep.room.memory.sources as { [id: string]: SourceData }), function (sourceData) {
            var data = sourceData as SourceData;
            return data.harvesterSpace.max > data.harvesterSpace.creepNames.length
                && data.harvesterSpace.creepNames.indexOf(creep.name) == -1
        });
        if (sourceId) {
            return sourceId
        } else {
            return null
        }
    }

    GetSourceData(sourceId: string): SourceData {
        return this.creep.room.memory.sources[sourceId];
    }


}
