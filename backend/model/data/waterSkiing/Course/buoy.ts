import { Measurement } from "../../units/unit";
import { UnitAngle } from "../../units/unitAngle";
import { UnitSpeed } from "../../units/unitSpeed";

export class Buoy<T> {
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
        timeOfRecordingInMilliseconds: number
    ) {
        this.position = position
        this.maxSpeed = maxSpeed
        this.maxRoll = maxRoll
        this.maxPitch = maxPitch
        this.timeOfRecordingInMilliseconds = timeOfRecordingInMilliseconds
    }
}