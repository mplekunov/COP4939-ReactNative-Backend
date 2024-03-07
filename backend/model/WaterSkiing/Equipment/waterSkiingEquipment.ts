import { Fin } from "./fin";
import { Ski } from "./ski";

export class WaterSkiingEquipment {
    readonly fin: Fin
    readonly ski: Ski

    constructor(fin: Fin, ski: Ski) {
        this.fin = fin
        this.ski = ski
    }

    convertToSchema(): any {
        return {
            fin: this.fin.convertToSchema(),
            ski: this.ski.convertToSchema()
        }
    }

    static convertFromSchema(schema: any): WaterSkiingEquipment {
        try {
            return new WaterSkiingEquipment(
                Fin.convertFromSchema(schema.fin),
                Ski.convertFromSchema(schema.ski)
            )
        } catch(error : any) {
            throw new Error(`WaterSkiingEquipment ~ ${error.message}`)
        }
    }
}