import { LocationRecord } from "./locationRecord"
import { Measurement } from "./units/unit"
import { UnitSpeed } from "./units/unitSpeed"
import { MotionRecord } from "./waterSkiing/motionRecord"

export class BaseTrackingRecord {
    readonly motion: MotionRecord
    readonly timeOfRecordingInSeconds: number

    constructor(motion: MotionRecord, timeOfRecordingInSeconds: number) {
        this.motion = motion
        this.timeOfRecordingInSeconds = timeOfRecordingInSeconds
    }

    static parse(json: string) : BaseTrackingRecord {
        try {
            let anyJSON = JSON.parse(json)

            let motion = MotionRecord.parse(JSON.stringify(anyJSON.motion))
            let timeOfRecordingInSeconds = anyJSON.timeOfRecordingInSeconds as number

            return new BaseTrackingRecord(motion, timeOfRecordingInSeconds)
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
        timeOfRecordingInSeconds: number
    ) {
        super(motion, timeOfRecordingInSeconds)
        this.speed = speed
        this.location = location
    }
}
