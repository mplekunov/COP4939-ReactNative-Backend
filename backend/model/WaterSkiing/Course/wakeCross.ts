import { Coordinate } from "../../Units/coordinate";
import { Measurement } from "../../Units/unit";
import { UnitAcceleration } from "../../Units/unitAcceleration";
import { UnitAngle } from "../../Units/unitAngle";
import { UnitSpeed } from "../../Units/unitSpeed";

export class WakeCross {
    readonly position: Coordinate
    readonly maxSpeed: Measurement<UnitSpeed>
    readonly maxRoll: Measurement<UnitAngle>
    readonly maxPitch: Measurement<UnitAngle>
    readonly maxAngle: Measurement<UnitAngle>
    readonly maxGForce: Measurement<UnitAcceleration>
    readonly maxAcceleration: Measurement<UnitAcceleration>
    readonly date: Date

    constructor(
        position: Coordinate, 
        maxSpeed: Measurement<UnitSpeed>, 
        maxRoll: Measurement<UnitAngle>, 
        maxPitch: Measurement<UnitAngle>, 
        maxAngle: Measurement<UnitAngle>, 
        maxGForce: Measurement<UnitAcceleration>, 
        maxAcceleration: Measurement<UnitAcceleration>, 
        date: Date
    ) {
        this.position = position
        this.maxSpeed = maxSpeed
        this.maxRoll = maxRoll
        this.maxPitch = maxPitch
        this.maxAngle = maxAngle
        this.maxGForce = maxGForce
        this.maxAcceleration = maxAcceleration
        this.date = date
    }

    convertToSchema(): any {
        return {
            position: this.position.convertToSchema(),
            maxSpeed: this.maxSpeed.convertToSchema(),
            maxRoll: this.maxRoll.convertToSchema(),
            maxPitch: this.maxPitch.convertToSchema(),
            maxAngle: this.maxAngle.convertToSchema(),
            maxAcceleration: this.maxAcceleration.convertToSchema(),
            maxGForce: this.maxGForce.convertToSchema(),
            date: this.date
        }
    }


    static convertFromSchema(schema: any): WakeCross {
        try {
            return new WakeCross(
                Coordinate.convertFromSchema(schema.position),
                new Measurement(parseFloat(schema.maxSpeed.value), UnitSpeed.parse(schema.maxSpeed.unit)),
                new Measurement(parseFloat(schema.maxRoll.value), UnitAngle.parse(schema.maxRoll.unit)),
                new Measurement(parseFloat(schema.maxPitch.value), UnitAngle.parse(schema.maxPitch.unit)),
                new Measurement(parseFloat(schema.maxAngle.value), UnitAngle.parse(schema.maxAngle.unit)),
                new Measurement(parseFloat(schema.maxAcceleration.value), UnitAcceleration.parse(schema.maxAcceleration.unit)),
                new Measurement(parseFloat(schema.maxGForce.value), UnitAcceleration.parse(schema.maxGForce.unit)),
                new Date(schema.date)
            )
        } catch(error: any) {
            throw new Error(`WakeCross ~ ${error.message}`)
        }
    }
}