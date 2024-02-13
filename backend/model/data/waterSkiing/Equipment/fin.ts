import { Measurement, Unit } from "../../units/unit"
import { UnitLength } from "../../units/unitLength"

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
}
