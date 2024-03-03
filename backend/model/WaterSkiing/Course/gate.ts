import { Measurement } from "../../Units/unit";
import { UnitAngle } from "../../Units/unitAngle";
import { UnitSpeed } from "../../Units/unitSpeed";

export class Gate<T> {
    readonly position: T
    readonly maxSpeed: Measurement<UnitSpeed>
    readonly maxRoll: Measurement<UnitAngle>
    readonly maxPitch: Measurement<UnitAngle>
    readonly timeOfRecordingInMilliseconds: number

    constructor(
        position: T,
        maxSpeed: Measurement<UnitSpeed>,
        maxRoll: Measurement<UnitAngle>,
        maxPitch: Measurement<UnitAngle>,
        timeOfRecordingInSeconds: number
    ) {
        this.position = position
        this.maxSpeed = maxSpeed
        this.maxRoll = maxRoll
        this.maxPitch = maxPitch
        this.timeOfRecordingInMilliseconds = timeOfRecordingInSeconds
    }
}
