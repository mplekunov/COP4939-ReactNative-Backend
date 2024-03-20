import { Measurement } from "../../Units/unit";
import { UnitLength } from "../../Units/unitLength";

export interface Ski {
    brand: string
    style: string
    length: Measurement<UnitLength>
}

export class SkiConverter {
    static convertToSchema(ski: Ski): any {
        return {
            brand: ski.brand,
            style: ski.style,
            length: ski.length.convertToSchema(),
        }
    }

    static convertFromSchema(schema: any): Ski {
        try {
            return {
                brand: String(schema.brand),
                style: String(schema.style),
                length: new Measurement(parseFloat(schema.length.value), UnitLength.parse(schema.length.unit)),
            }
        } catch(error : any) {
            throw new Error(`Ski ~ ${error.message}`)
        }
    }
}