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
            target = Game.getObjectById(this.creep.memory.assignment);
            (this.creep.room.memory.sources[this.creep.memory.assignment] as SourceData).harvesterSpace.creepNames.push(this.creep.name);
        } else {
            target = Game.getObjectById(this.creep.memory.assignment);
        }

        if (_.sum(this.creep.carry) < this.creep.carryCapacity) {
            if (this.creep.harvest(target) == ERR_NOT_IN_RANGE) {
                this.creep.moveTo(target);
            }
        }
        else if (_.sum(this.creep.carry) == this.creep.carryCapacity) {
            if (!this.GetSourceData(this.creep.memory.assignment).defaultContainerCreated) {
                target = this.FindClosestCoontainerConstruction();
                if (target) {
                    var res = this.creep.build(target);
                    if (res == ERR_NOT_IN_RANGE) {
                        this.creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                    } else if (res == ERR_INVALID_TARGET) {
                        this.GetSourceData(this.creep.memory.assignment).defaultContainerCreated = true;
                    }
                }
            } else {
                let storage = this.TryGetDefaultContainer();
                //TODO: thos whole thing is bad. Store location in GoingTo memory spot and reuse
                if (this.creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    this.creep.moveTo(storage);
                }
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

    AssignSource() {
        var sourceId = this.FindOpenSource() as string;
        this.creep.memory.assignment = sourceId;
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

    FindClosestCoontainerConstruction() {
        var container = this.creep.room.find(FIND_CONSTRUCTION_SITES, {
            filter: function (site) {
                return site.structureType == STRUCTURE_CONTAINER;
            }
        });

        return container;
    }

}
