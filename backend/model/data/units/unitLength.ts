import { Dimension, UnitConverter, UnitConverterLinear } from "./unit"

export enum LengthUnits {
    megameters = "Mm",
    kilometers = "Km",
    hectometers = "hm",
    decameters = "dam",
    meters = "m",
    decimeters = "dm",
    centimeters = "cm",
    millimeters = "mm",
    micrometers = "µm",
    nanometers = "nm",
    picometers = "pm",
    inches = "in",
    feet = "ft",
    yards = "yd",
    miles = "mi"
}

export class UnitLength implements Dimension {
    static meters: UnitLength = new UnitLength(LengthUnits.meters, new UnitConverterLinear(1.0, 0))
    static megameters: UnitLength = new UnitLength(LengthUnits.megameters, new UnitConverterLinear(1000000.0, 0))
    static kilometers: UnitLength = new UnitLength(LengthUnits.kilometers, new UnitConverterLinear(1000.0, 0))
    static hectometers: UnitLength = new UnitLength(LengthUnits.hectometers, new UnitConverterLinear(100.0, 0))
    static decameters: UnitLength = new UnitLength(LengthUnits.decameters, new UnitConverterLinear(10.0, 0))
    static decimeters: UnitLength = new UnitLength(LengthUnits.decimeters, new UnitConverterLinear(0.1, 0))
    static centimeters: UnitLength = new UnitLength(LengthUnits.centimeters, new UnitConverterLinear(0.01, 0))
    static millimeters: UnitLength = new UnitLength(LengthUnits.meters, new UnitConverterLinear(0.001, 0))
    static micrometers: UnitLength = new UnitLength(LengthUnits.micrometers, new UnitConverterLinear(0.000001, 0))
    static nanometers: UnitLength = new UnitLength(LengthUnits.nanometers, new UnitConverterLinear(10^-9, 0))
    static picometers: UnitLength = new UnitLength(LengthUnits.picometers, new UnitConverterLinear(10^-12, 0))
    static inches: UnitLength = new UnitLength(LengthUnits.inches, new UnitConverterLinear(0.0254, 0))
    static feet: UnitLength = new UnitLength(LengthUnits.feet, new UnitConverterLinear(0.3048, 0))
    static yards: UnitLength = new UnitLength(LengthUnits.yards, new UnitConverterLinear(0.9144, 0))
    static miles: UnitLength = new UnitLength(LengthUnits.miles, new UnitConverterLinear(1609.34, 0))

    converter: UnitConverter
    symbol: string

    constructor(symbol: string, converter: UnitConverter) {
        this.symbol = symbol
        this.converter = converter
    }

    baseUnit(): Dimension {
        return UnitLength.meters
    }
}