import { BaseTrackingRecord } from "./trackingRecord"

export class BaseTrackingSession<R> {
    readonly id: string
    readonly dateInMilliseconds: number
    readonly trackingRecords: Array<R>

    constructor(
        id: string,
        dateInMilliseconds: number,
        trackingRecords: Array<R>
    ) {
        this.id = id
        this.trackingRecords = trackingRecords
        this.dateInMilliseconds = dateInMilliseconds
    }
}

export class Session<R extends BaseTrackingRecord, V> extends BaseTrackingSession<R> {
    readonly video: V

    constructor(baseTrackingSession: BaseTrackingSession<R>, video: V) {
        super(baseTrackingSession.id, baseTrackingSession.dateInMilliseconds, baseTrackingSession.trackingRecords)
        this.video = video
    }
}