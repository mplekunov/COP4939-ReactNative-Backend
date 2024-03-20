import { Converter } from "../../Database/database";
import { Coordinate, CoordinateConverter } from "../../Units/coordinate";
import { Measurement } from "../../Units/unit";
import { UnitAcceleration } from "../../Units/unitAcceleration";
import { UnitAngle } from "../../Units/unitAngle";
import { UnitSpeed } from "../../Units/unitSpeed";

export interface WakeCross {
    position: Coordinate
    maxSpeed: Measurement<UnitSpeed>
    maxRoll: Measurement<UnitAngle>
    maxPitch: Measurement<UnitAngle>
    maxAngle: Measurement<UnitAngle>
    maxGForce: Measurement<UnitAcceleration>
    maxAcceleration: Measurement<UnitAcceleration>
    date: Date
}

export class WakeCrossConverter implements Converter<WakeCross> {
    private coordinateConverter = new CoordinateConverter()

    convertToSchema(object: WakeCross) {
        return {
            position: this.coordinateConverter.convertToSchema(object.position),
            maxSpeed: object.maxSpeed.convertToSchema(),
            maxRoll: object.maxRoll.convertToSchema(),
            maxPitch: object.maxPitch.convertToSchema(),
            maxAngle: object.maxAngle.convertToSchema(),
            maxAcceleration: object.maxAcceleration.convertToSchema(),
            maxGForce: object.maxGForce.convertToSchema(),
            date: object.date
        }
    }
    convertFromSchema(schema: any): WakeCross {
        try {
            return {
                position: this.coordinateConverter.convertFromSchema(schema.position),
                maxSpeed: new Measurement(parseFloat(schema.maxSpeed.value), UnitSpeed.parse(schema.maxSpeed.unit)),
                maxRoll: new Measurement(parseFloat(schema.maxRoll.value), UnitAngle.parse(schema.maxRoll.unit)),
                maxPitch: new Measurement(parseFloat(schema.maxPitch.value), UnitAngle.parse(schema.maxPitch.unit)),
                maxAngle: new Measurement(parseFloat(schema.maxAngle.value), UnitAngle.parse(schema.maxAngle.unit)),
                maxAcceleration: new Measurement(parseFloat(schema.maxAcceleration.value), UnitAcceleration.parse(schema.maxAcceleration.unit)),
                maxGForce: new Measurement(parseFloat(schema.maxGForce.value), UnitAcceleration.parse(schema.maxGForce.unit)),
                date: new Date(schema.date)
            }
        } catch(error: any) {
            throw new Error(`WakeCross ~ ${error.message}`)
        }
    }
}