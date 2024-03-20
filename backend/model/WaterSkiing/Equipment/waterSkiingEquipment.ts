import { Fin, FinConverter } from "./fin";
import { Ski, SkiConverter } from "./ski";

export interface WaterSkiingEquipment {
    fin: Fin
    ski: Ski
}

export class WaterSkiingEquipmentConverter {
    static convertToSchema(waterSkiingEquipment: WaterSkiingEquipment): any {
        return {
            fin: FinConverter.convertToSchema(waterSkiingEquipment.fin),
            ski: SkiConverter.convertToSchema(waterSkiingEquipment.ski)
        }
    }

    static convertFromSchema(schema: any): WaterSkiingEquipment {
        try {
            return {
                fin: FinConverter.convertFromSchema(schema.fin),
                ski: SkiConverter.convertFromSchema(schema.ski)
            }
        } catch(error : any) {
            throw new Error(`WaterSkiingEquipment ~ ${error.message}`)
        }
    }
}