import { Measurement } from "../../Units/unit";
import { UnitAngle } from "../../Units/unitAngle";

export class Attitude {
    roll: Measurement<UnitAngle>
    yaw: Measurement<UnitAngle>
    pitch: Measurement<UnitAngle>

    constructor(
        roll: Measurement<UnitAngle>,
        yaw: Measurement<UnitAngle>,
        pitch: Measurement<UnitAngle>
    ) {
        this.pitch = pitch
        this.roll = roll
        this.yaw = yaw
    }

    static parse(json: string): Attitude {
        try {
            let anyJSON = JSON.parse(json)

            let roll = new Measurement(anyJSON.roll.value as number, UnitAngle.parse(JSON.stringify(anyJSON.roll.unit)))
            let yaw = new Measurement(anyJSON.yaw.value as number, UnitAngle.parse(JSON.stringify(anyJSON.yaw.unit)))
            let pitch = new Measurement(anyJSON.pitch.value as number, UnitAngle.parse(JSON.stringify(anyJSON.pitch.unit)))
        
            return new Attitude(roll, yaw, pitch)
        } catch (error) {
            throw new Error(`Attitude - ${error}`)
        }
    }
}