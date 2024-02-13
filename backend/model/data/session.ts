import { BaseTrackingRecord } from "./trackingRecord"

export class BaseTrackingSession<R> {
    readonly id: string
    readonly dateInSeconds: number
    readonly trackingRecords: Array<R>

    constructor(
        id: string,
        dateInSeconds: number,
        trackingRecords: Array<R>
    ) {
        this.id = id
        this.trackingRecords = trackingRecords
        this.dateInSeconds = dateInSeconds
    }
}

export class Session<R extends BaseTrackingRecord, V> extends BaseTrackingSession<R> {
    readonly video: V

    constructor(baseTrackingSession: BaseTrackingSession<R>, video: V) {
        super(baseTrackingSession.id, baseTrackingSession.dateInSeconds, baseTrackingSession.trackingRecords)
        this.video = video
    }
}