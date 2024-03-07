import { Video } from "../Camera/video"
import { TrackingRecord } from "./trackingRecord"

export class TrackingSession {
    readonly id: string
    readonly date: Date
    readonly trackingRecords: Array<TrackingRecord>
    readonly video: Video

    constructor(id: string, date: Date, trackingRecords: Array<TrackingRecord>, video: Video) {
        this.id = id
        this.trackingRecords = trackingRecords
        this.date = date
        this.video = video
    }

    convertToSchema(): any {
        return {
            id: this.id,
            date: this.date,
            trackingRecords: this.trackingRecords.map(record => record.convertToSchema()),
            video: this.video.convertToSchema()
        }
    }

    static convertFromSchema(schema: any): TrackingSession {
        try {
            return new TrackingSession(
                schema.id,
                new Date(schema.recordDate),
                (schema.trackingRecords as []).map(schema => TrackingRecord.convertFromSchema(schema)),
                Video.convertFromSchema(schema.video)
            )
        } catch(error: any) {
            throw new Error(`TrackingSession ~ ${error.message}`)
        }
    }
}