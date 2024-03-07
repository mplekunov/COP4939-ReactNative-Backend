export interface Unit {
    symbol: string
}

export interface UnitConverter {
    baseUnitValue(value: number) : number
    value(fromBaseUnitValue: number) : number
}

export class UnitConverterLinear implements UnitConverter {
    coefficient: number
    constant: number

    constructor(coefficient: number, constant: number) {
        this.coefficient = coefficient
        this.constant = constant
    }

    baseUnitValue(value: number): number {
        return this.coefficient * value + this.constant
    }

    value(fromBaseUnitValue: number): number {
        return (fromBaseUnitValue - this.constant) / this.coefficient
    }
}

export interface Dimension extends Unit {
    converter: UnitConverter
    baseUnit() : Dimension
}

export class Measurement<UnitType extends Dimension> {
    value: number
    readonly unit: UnitType

    constructor(value: number, unit: UnitType) {
        this.value = value
        this.unit = unit
    }

    convertToSchema() : any {
        return {
            value: this.value,
            unit: this.unit.symbol
        }
    }

    converted(to: UnitType) : Measurement<UnitType> {
        let baseValue = this.unit.converter.baseUnitValue(this.value)
        return new Measurement(to.converter.value(baseValue), to)
    }

    add(other: Measurement<UnitType>) : Measurement<UnitType> {
        if (this.unit !=  other.unit) {
            throw Error("Cannot perform math operation on different UnitTypes.")
        }

        let baseValue = this.unit.converter.baseUnitValue(this.value)
        let otherBaseValue = this.unit.converter.baseUnitValue(other.value)

        return new Measurement(baseValue + otherBaseValue, this.unit)
    }

    subtract(other: Measurement<UnitType>) : Measurement<UnitType> {
        if (this.unit != other.unit) {
            throw Error("Cannot perform math operation on different UnitTypes.")
        }

        let baseValue = this.unit.converter.baseUnitValue(this.value)
        let otherBaseValue = this.unit.converter.baseUnitValue(other.value)

        return new Measurement(baseValue - otherBaseValue, this.unit)
    }

    multiply(other: Measurement<UnitType>) : Measurement<UnitType> {
        if (this.unit !=  other.unit) {
            throw Error("Cannot perform math operation on different UnitTypes.")
        }

        let baseValue = this.unit.converter.baseUnitValue(this.value)
        let otherBaseValue = this.unit.converter.baseUnitValue(other.value)

        return new Measurement(baseValue * otherBaseValue, this.unit)
    }

    divide(other: Measurement<UnitType>) : Measurement<UnitType> {
        if (this.unit !=  other.unit) {
            throw Error("Cannot perform math operation on different UnitTypes.")
        }

        let baseValue = this.unit.converter.baseUnitValue(this.value)
        let otherBaseValue = this.unit.converter.baseUnitValue(other.value)

        if (otherBaseValue === 0) {
            throw Error("Cannot divide by 0.")
        }

        return new Measurement(baseValue / otherBaseValue, this.unit)
    }
}

export function max<T extends Dimension>(first: Measurement<T>, second: Measurement<T>) : Measurement<T> {
    if (first.unit != second.unit) {
        throw Error("Cannot perform comparison operation on different UnitTypes.")
    }

    if (first.value < second.value) {
        return second
    } else {
        return first
    }
}

export function min<T extends Dimension>(first: Measurement<T>, second: Measurement<T>) : Measurement<T> {
    if (first.unit != second.unit) {
        throw Error("Cannot perform comparison operation on different UnitTypes.")
    }

    if (first.value < second.value) {
        return first
    } else {
        return second
    }
}
