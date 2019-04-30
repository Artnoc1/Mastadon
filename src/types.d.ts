

// example declaration file - remove these and add your own custom typings

// memory extension samples
declare interface CreepMemory {
  role: string;
  room: string;
  status: "harvesting" | "moving" | "building" | "fighting" | "transferring" | "refreshing" | null;
  assignment: string;
}

interface Memory {
  uuid: number;
  log: any;
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
