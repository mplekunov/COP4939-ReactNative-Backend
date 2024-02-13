import { LocationRecord } from "./locationRecord"
import { Measurement } from "./units/unit"
import { UnitSpeed } from "./units/unitSpeed"
import { MotionRecord } from "./waterSkiing/motionRecord"

export class BaseTrackingRecord {
    readonly motion: MotionRecord
    readonly timeOfRecrodingInMilliseconds: number

    constructor(motion: MotionRecord, timeOfRecrodingInMilliseconds: number) {
        this.motion = motion
        this.timeOfRecrodingInMilliseconds = timeOfRecrodingInMilliseconds
    }

    static parse(json: string) : BaseTrackingRecord {
        try {
            let anyJSON = JSON.parse(json)

            let motion = MotionRecord.parse(JSON.stringify(anyJSON.motion))
            let timeOfRecrodingInMilliseconds = anyJSON.timeOfRecrodingInMilliseconds as number

            return new BaseTrackingRecord(motion, timeOfRecrodingInMilliseconds)
        } catch (error) {
            throw new Error(`BaseTrackingRecord - ${error}`)
        }
    }
}

export class TrackingRecord extends BaseTrackingRecord {
    readonly speed: Measurement<UnitSpeed>
    readonly location: LocationRecord

    constructor(
        motion: MotionRecord,
        speed: Measurement<UnitSpeed>,
        location: LocationRecord,
        timeOfRecrodingInMilliseconds: number
    ) {
        super(motion, timeOfRecrodingInMilliseconds)
        this.speed = speed
        this.location = location
    }
}
