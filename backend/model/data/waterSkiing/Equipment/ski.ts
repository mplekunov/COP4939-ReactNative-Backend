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
}