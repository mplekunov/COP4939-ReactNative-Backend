import { Dimension, Unit, UnitConverter, UnitConverterLinear } from "./unit"

export enum AccelerationUnits {
    metersPerSecondSquared = "m/s^2",
    gravity = "g"
}

export class UnitAcceleration implements Dimension {
    static metersPersecondSquared: UnitAcceleration = new UnitAcceleration(AccelerationUnits.metersPerSecondSquared, new UnitConverterLinear(1.0, 0))
    static gravity: UnitAcceleration = new UnitAcceleration(AccelerationUnits.gravity, new UnitConverterLinear(9.81, 0))

    converter: UnitConverter
    symbol: string

    constructor(symbol: string, converter: UnitConverter) {
        this.symbol = symbol
        this.converter = converter
    }

    static parse(symbol: string): UnitAcceleration {
        try {

            if (!symbol) {
                throw new Error("Symbol is undefined.")
            }

            switch (symbol as string) {
                case AccelerationUnits.gravity:
                    return UnitAcceleration.gravity
                case AccelerationUnits.metersPerSecondSquared:
                    return UnitAcceleration.metersPersecondSquared
                default:
                    throw new Error(`Symbol is not found. ${symbol}`)
            }
        } catch (error) {
            throw new Error(`UnitAcceleration ~ ${error}`)
        }
    }

    baseUnit(): Dimension {
        return UnitAcceleration.metersPersecondSquared
    }
}