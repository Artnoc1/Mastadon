import { CreepType } from "Spawners";
import { HarvesterCreep } from "./HarvesterCreep";
import { BuilderCreep } from "./BuilderCreep";


export class CreepManager {

    static run() {
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.role == CreepType.MINER) {
                if (creep.room.memory.statuses.openSpacesCalced) {
                    var harvester = new HarvesterCreep(creep);
                    harvester.run();
                }
            }
            if (creep.memory.role == CreepType.BUILDER) {
                new BuilderCreep(creep).run();
            }
        }
    }


    static GetOpenSource() {

    }
}
