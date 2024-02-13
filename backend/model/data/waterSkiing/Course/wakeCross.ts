import { Measurement } from "../../units/unit";
import { UnitAcceleration } from "../../units/unitAcceleration";
import { UnitAngle } from "../../units/unitAngle";
import { UnitSpeed } from "../../units/unitSpeed";

export class WakeCross<T> {
    readonly position: T
    readonly maxSpeed: Measurement<UnitSpeed>
    readonly maxRoll: Measurement<UnitAngle>
    readonly maxPitch: Measurement<UnitAngle>
    readonly maxAngle: Measurement<UnitAngle>
    readonly maxGForce: Measurement<UnitAcceleration>
    readonly maxAcceleration: Measurement<UnitAcceleration>
    readonly timeOfRecordingInSeconds: number

    constructor(
        position: T, 
        maxSpeed: Measurement<UnitSpeed>, 
        maxRoll: Measurement<UnitAngle>, 
        maxPitch: Measurement<UnitAngle>, 
        maxAngle: Measurement<UnitAcceleration>, 
        maxGForce: Measurement<UnitAcceleration>, 
        maxAcceleration: Measurement<UnitAcceleration>, 
        timeOfRecordingInSeconds: number
    ) {
        this.position = position
        this.maxSpeed = maxSpeed
        this.maxRoll = maxRoll
        this.maxPitch = maxPitch
        this.maxAngle = maxAngle
        this.maxGForce = maxGForce
        this.maxAcceleration = maxAcceleration
        this.timeOfRecordingInSeconds = timeOfRecordingInSeconds
    }
}