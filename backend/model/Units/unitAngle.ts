import { Dimension, UnitConverter, UnitConverterLinear } from "./unit"

export enum AngleUnits {
    degrees = "°",
    arcMinutes = "\'",
    arcSeconds = "\"",
    radians = "rad",
    gradians = "grad",
    revolutions = "rev"
}

export class UnitAngle implements Dimension {
    static degrees: UnitAngle = new UnitAngle(AngleUnits.degrees, new UnitConverterLinear(1.0, 0))
    static arcMinutes: UnitAngle = new UnitAngle(AngleUnits.arcMinutes, new UnitConverterLinear(0.016667, 0))
    static arcSeconds: UnitAngle = new UnitAngle(AngleUnits.arcSeconds, new UnitConverterLinear(0.00027778, 0))
    static radians: UnitAngle = new UnitAngle(AngleUnits.radians, new UnitConverterLinear(57.2958, 0))
    static gradians: UnitAngle = new UnitAngle(AngleUnits.gradians, new UnitConverterLinear(0.9, 0))
    static revolutions: UnitAngle = new UnitAngle(AngleUnits.revolutions, new UnitConverterLinear(360, 0))

    converter: UnitConverter
    symbol: string

    constructor(symbol: string, converter: UnitConverter) {
        this.symbol = symbol
        this.converter = converter
    }

    static parse(symbol: string): UnitAngle {
        try {
            if (!symbol) {
                throw new Error("Symbol is undefined.")
            }

            switch (symbol as string) {
                case AngleUnits.arcMinutes:
                    return UnitAngle.arcMinutes
                case AngleUnits.arcSeconds:
                    return UnitAngle.arcSeconds
                case AngleUnits.degrees:
                    return UnitAngle.degrees
                case AngleUnits.gradians:
                    return UnitAngle.gradians
                case AngleUnits.radians:
                    return UnitAngle.radians
                case AngleUnits.revolutions:
                    return UnitAngle.revolutions
                default:
                    throw new Error(`Symbol is not found. ${symbol}`)
            }
        } catch(error : any) {
            throw new Error(`UnitAngle ~ ${error.message}`)
        }
    }

    baseUnit(): Dimension {
        return UnitAngle.degrees
    }
}