import { Dimension, UnitConverter, UnitConverterLinear } from "./unit"

export enum SpeedUnits {
    metersPerSecond = "m/s",
    kilometersPerHour = "km/h",
    milesPerHour = "mph",
    knots = "knots"
}

export class UnitSpeed implements Dimension {
    static metersPerSecond: UnitSpeed = new UnitSpeed(SpeedUnits.metersPerSecond, new UnitConverterLinear(1.0, 0))
    static kilometersPerHour: UnitSpeed = new UnitSpeed(SpeedUnits.kilometersPerHour, new UnitConverterLinear(0.277778, 0))
    static milesPerHour: UnitSpeed = new UnitSpeed(SpeedUnits.milesPerHour, new UnitConverterLinear(0.44704, 0))
    static knots: UnitSpeed = new UnitSpeed(SpeedUnits.knots, new UnitConverterLinear(0.514444, 0))

    converter: UnitConverter
    symbol: string

    constructor(symbol: string, converter: UnitConverter) {
        this.symbol = symbol
        this.converter = converter
    }

    static parse(symbol: string): UnitSpeed {
        try {

            if (!symbol) {
                throw new Error("Symbol is undefined.")
            }

            switch (symbol as string) {
                case SpeedUnits.kilometersPerHour:
                    return UnitSpeed.kilometersPerHour
                case SpeedUnits.knots:
                    return UnitSpeed.knots
                case SpeedUnits.metersPerSecond:
                    return UnitSpeed.metersPerSecond
                case SpeedUnits.milesPerHour:
                    return UnitSpeed.milesPerHour
                default:
                    throw new Error(`Symbol is not found. ${symbol}`)
            }
        } catch (error) {
            throw new Error(`UnitSpeed ~ ${error}`)
        }
    }

    baseUnit(): Dimension {
        return UnitSpeed.metersPerSecond
    }
}