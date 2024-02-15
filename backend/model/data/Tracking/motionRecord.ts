import { Measurement } from "../Units/unit";
import { Unit3D } from "../Units/unit3D";
import { UnitAcceleration } from "../Units/unitAcceleration";
import { UnitSpeed } from "../Units/unitSpeed";
import { Attitude } from "../WaterSkiing/Course/attitude";

export class MotionRecord {
    speed: Measurement<UnitSpeed>
    attitude: Attitude
    acceleration: Unit3D<Measurement<UnitAcceleration>>
    gForce: Unit3D<Measurement<UnitAcceleration>>

    constructor(
        speed: Measurement<UnitSpeed>,
        attitude: Attitude,
        acceleration: Unit3D<Measurement<UnitAcceleration>>,
        gForce: Unit3D<Measurement<UnitAcceleration>>
    ) {
        this.speed = speed
        this.attitude = attitude
        this.acceleration = acceleration
        this.gForce = gForce
    }

    static parse(json: string): MotionRecord {
        try {
            let anyJSON = JSON.parse(json)

            let speed = new Measurement(anyJSON.speed.value as number, UnitSpeed.parse(JSON.stringify(anyJSON.speed.unit)))
            let attitude = Attitude.parse(JSON.stringify(anyJSON.attitude))
            let acceleration = new Unit3D(
                new Measurement(anyJSON.acceleration.x.value as number, UnitAcceleration.parse(JSON.stringify(anyJSON.acceleration.x.unit))),
                new Measurement(anyJSON.acceleration.y.value as number, UnitAcceleration.parse(JSON.stringify(anyJSON.acceleration.y.unit))),
                new Measurement(anyJSON.acceleration.z.value as number, UnitAcceleration.parse(JSON.stringify(anyJSON.acceleration.z.unit)))
            )
            let gForce = new Unit3D(
                new Measurement(anyJSON.gForce.x.value as number, UnitAcceleration.parse(JSON.stringify(anyJSON.gForce.x.unit))),
                new Measurement(anyJSON.gForce.y.value as number, UnitAcceleration.parse(JSON.stringify(anyJSON.gForce.y.unit))),
                new Measurement(anyJSON.gForce.z.value as number, UnitAcceleration.parse(JSON.stringify(anyJSON.gForce.z.unit)))
            )

            return new MotionRecord(
                speed,
                attitude,
                acceleration,
                gForce
            )
        } catch (error) {
            throw new Error(`MotionRecord - ${error}`)
        }
    }
}