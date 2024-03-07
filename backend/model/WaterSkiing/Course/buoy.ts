import { Coordinate } from "../../Units/coordinate";
import { Measurement } from "../../Units/unit";
import { UnitAngle } from "../../Units/unitAngle";
import { UnitSpeed } from "../../Units/unitSpeed";

export class Buoy {
    readonly position: Coordinate
    readonly maxSpeed: Measurement<UnitSpeed>
    readonly maxRoll: Measurement<UnitAngle>
    readonly maxPitch: Measurement<UnitAngle>
    readonly date: Date

    constructor(
        position: Coordinate, 
        maxSpeed: Measurement<UnitSpeed>, 
        maxRoll: Measurement<UnitAngle>, 
        maxPitch: Measurement<UnitAngle>, 
        date: Date
    ) {
        this.position = position
        this.maxSpeed = maxSpeed
        this.maxRoll = maxRoll
        this.maxPitch = maxPitch
        this.date = date
    }

    convertToSchema(): any {
        return {
            position: this.position.convertToSchema(),
            maxSpeed: this.maxSpeed.convertToSchema(),
            maxRoll: this.maxRoll.convertToSchema(),
            maxPitch: this.maxPitch.convertToSchema(),
            date: this.date
        }
    }

    static convertFromSchema(schema: any): Buoy {
        try {
            return new Buoy(
                Coordinate.convertFromSchema(schema.position),
                new Measurement(parseFloat(schema.maxSpeed.value), UnitSpeed.parse(schema.maxSpeed.unit)),
                new Measurement(parseFloat(schema.maxRoll.value),UnitAngle.parse(schema.maxRoll.unit)),
                new Measurement(parseFloat(schema.maxPitch.value), UnitAngle.parse(schema.maxPitch.unit)),
                new Date(schema.date)
            )
        } catch(error: any) {
            throw new Error(`Buoy ~ ${error.message}`)
        }
    }
}