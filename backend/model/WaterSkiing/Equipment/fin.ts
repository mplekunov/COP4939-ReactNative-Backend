import { Measurement, Unit } from "../../Units/unit"
import { UnitLength } from "../../Units/unitLength"

export interface Fin {
    brand: string
    style: string
    length: Measurement<UnitLength>
    bindingType: string
}

export class FinConverter {
    static convertToSchema(fin: Fin): any {
        return {
            brand: fin.brand,
            style: fin.style,
            length: fin.length.convertToSchema(),
            bindingType: fin.bindingType
        }
    }

    static convertFromSchema(schema: any): Fin {
        try {
            return {
                brand: String(schema.brand),
                style: String(schema.style),
                length: new Measurement(parseFloat(schema.length.value), UnitLength.parse(schema.length.unit)),
                bindingType: String(schema.bindingType)
            }
        } catch(error : any) {
            throw new Error(`Fin ~ ${error.message}`)
        }
    }
}
