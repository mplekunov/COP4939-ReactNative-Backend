import { Measurement } from "../../Units/unit";
import { UnitLength } from "../../Units/unitLength";

export class Ski {
    readonly brand: string
    readonly style: string
    readonly length: Measurement<UnitLength>
    
    constructor(brand: string, style: string, length: Measurement<UnitLength>) {
        this.brand = brand
        this.style = style
        this.length = length
    }

    convertToSchema(): any {
        return {
            brand: this.brand,
            style: this.style,
            length: this.length.convertToSchema(),
        }
    }

    static convertFromSchema(schema: any): Ski {
        try {
            return new Ski(
                String(schema.brand),
                String(schema.style),
                new Measurement(parseFloat(schema.length.value), UnitLength.parse(schema.length.unit)),
            )
        } catch(error : any) {
            throw new Error(`Ski ~ ${error.message}`)
        }
    }
}