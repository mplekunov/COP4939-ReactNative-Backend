import { Measurement, Unit } from "../../Units/unit"
import { UnitLength } from "../../Units/unitLength"

export class Fin {
    readonly brand: string
    readonly style: string
    readonly length: Measurement<UnitLength>
    readonly bindingType: string
    
    constructor(brand: string, style: string, length: Measurement<UnitLength>, bindingType: string) {
        this.brand = brand
        this.style = style
        this.length = length
        this.bindingType = bindingType
    }

    convertToSchema(): any {
        return {
            brand: this.brand,
            style: this.style,
            length: this.length.convertToSchema(),
            bindingType: this.bindingType
        }
    }

    static convertFromSchema(schema: any): Fin {
        try {
            return new Fin(
                String(schema.brand),
                String(schema.style),
                new Measurement(parseFloat(schema.length.value), UnitLength.parse(schema.length.unit)),
                String(schema.bindingType)
            )
        } catch(error : any) {
            throw new Error(`Fin ~ ${error.message}`)
        }
    }
}
