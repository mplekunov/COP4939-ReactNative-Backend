import { Fin } from "./fin";
import { Ski } from "./ski";

export class WaterSkiingEquipment {
    readonly fin: Fin
    readonly ski: Ski

    constructor(fin: Fin, ski: Ski) {
        this.fin = fin
        this.ski = ski
    }
}