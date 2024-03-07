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

    convertToSchema() : any {
        return {
            location: this.location.convertToSchema(),
            motion: this.motion.convertToSchema(),
            date: this.date
        }
    }

    static convertFromSchema(schema: any): TrackingRecord {
        try {
            return new TrackingRecord(
                MotionRecord.convertFromSchema(schema.motion),
                LocationRecord.convertFromSchema(schema.location),
                new Date(schema.date)
            )
        } catch(error : any) {
            throw new Error(`TrackingRecord ~ ${error.message}`)
        }
    }
}
