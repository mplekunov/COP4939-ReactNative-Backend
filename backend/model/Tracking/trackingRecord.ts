import { LocationRecord } from "./locationRecord"
import { MotionRecord } from "./motionRecord"

export class TrackingRecord {
    readonly location: LocationRecord
    readonly motion: MotionRecord
    readonly date: Date

    constructor(
        motion: MotionRecord,
        location: LocationRecord,
        date: Date
    ) {
        this.location = location
        this.motion = motion
        this.date = date
    }
}
