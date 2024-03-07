import { Measurement } from "../Units/unit";
import { UnitAcceleration } from "../Units/unitAcceleration";
import { UnitAngle } from "../Units/unitAngle";
import { UnitLength } from "../Units/unitLength";
import { UnitSpeed } from "../Units/unitSpeed";

export class MotionRecord {
    speed: Measurement<UnitSpeed>
    altitude: Measurement<UnitLength>
    pitch: Measurement<UnitAngle>
    roll: Measurement<UnitAngle>
    heading: Measurement<UnitAngle>
    course: Measurement<UnitAngle>
    acceleration: Measurement<UnitAcceleration>
    gForce: Measurement<UnitAcceleration>

    constructor(
        speed: Measurement<UnitSpeed>,
        altitude: Measurement<UnitLength>,
        pitch: Measurement<UnitAngle>,
        roll: Measurement<UnitAngle>,
        heading: Measurement<UnitAngle>,
        course: Measurement<UnitAngle>,
        acceleration: Measurement<UnitAcceleration>,
        gForce: Measurement<UnitAcceleration>
    ) {
        this.speed = speed
        this.altitude = altitude
        this.acceleration = acceleration
        this.gForce = gForce
        this.pitch = pitch
        this.roll = roll
        this.heading = heading
        this.course = course
    }

    convertToSchema(): any {
        return {
            speed: this.speed.convertToSchema(),
            altitude: this.altitude.convertToSchema(),
            pitch: this.pitch.convertToSchema(),
            roll: this.roll.convertToSchema(),
            heading: this.heading.convertToSchema(),
            course: this.course.convertToSchema(),
            acceleration: this.acceleration.convertToSchema(),
            gForce: this.gForce.convertToSchema()
        }
    }

    static convertFromSchema(schema: any): MotionRecord {
        try {
            return new MotionRecord(
                new Measurement(parseFloat(schema.speed.value), UnitSpeed.parse(schema.speed.unit)),
                new Measurement(parseFloat(schema.altitude.value), UnitLength.parse(schema.altitude.unit)),
                new Measurement(parseFloat(schema.pitch.value), UnitAngle.parse(schema.pitch.unit)),
                new Measurement(parseFloat(schema.roll.value), UnitAngle.parse(schema.roll.unit)),
                new Measurement(parseFloat(schema.heading.value), UnitAngle.parse(schema.heading.unit)),
                new Measurement(parseFloat(schema.course.value), UnitAngle.parse(schema.course.unit)),
                new Measurement(parseFloat(schema.acceleration.value), UnitAcceleration.parse(schema.acceleration.unit)),
                new Measurement(parseFloat(schema.gForce.value), UnitAcceleration.parse(schema.gForce.unit))
            )
        } catch(error : any) {
            throw new Error(`MotionRecord ~ ${error.message}`)
        }
    }
}