
export abstract class BaseCreep {
    /**
     *
     */
    constructor(creep: Creep) {
        this.creep = creep;

    }
    creep: Creep;

    abstract run(): void

    survive() {

    }
}
