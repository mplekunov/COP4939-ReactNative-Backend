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
}