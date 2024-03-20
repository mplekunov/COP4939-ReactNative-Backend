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
    course: Measurement<UnitAngle>
    acceleration: Measurement<UnitAcceleration>
    gForce: Measurement<UnitAcceleration>

    constructor(
        speed: Measurement<UnitSpeed>,
        altitude: Measurement<UnitLength>,
        pitch: Measurement<UnitAngle>,
        roll: Measurement<UnitAngle>,
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
        this.course = course
    }
}