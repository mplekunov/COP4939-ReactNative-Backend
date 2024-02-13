import { Video } from "../../camera/video"
import { Buoy } from "./Course/buoy"
import { Gate } from "./Course/gate"
import { WakeCross } from "./Course/wakeCross"

export class PassBuilder<CourseElementPositionType, VideoType> {
    private _score: number | undefined
    private _entryGate: Gate<CourseElementPositionType> | undefined
    private _exitGate: Gate<CourseElementPositionType> | undefined
    private _wakeCrosses : Array<WakeCross<CourseElementPositionType>> = Array()
    private _buoys: Array<Buoy<CourseElementPositionType>> = Array()
    private _timeOfRecordingInSecodns : number | undefined
    private _video: VideoType | undefined

    public getScore() : number | undefined {
        return this._score
    }

    public setScore(score: number) : PassBuilder<CourseElementPositionType, VideoType> {
        this._score = score
        return this
    }

    public getEntryGate() : Gate<CourseElementPositionType> | undefined {
        return this._entryGate
    }

    public setEntryGate(gate: Gate<CourseElementPositionType>) : PassBuilder<CourseElementPositionType, VideoType> {
        this._entryGate = gate
        return this
    }

    public getExitGate() : Gate<CourseElementPositionType> | undefined {
        return this._exitGate
    }

    public setExitGate(gate: Gate<CourseElementPositionType>) : PassBuilder<CourseElementPositionType, VideoType> {
        this._exitGate = gate
        return this
    }

    public getWakeCrosses() : Array<WakeCross<CourseElementPositionType>> {
        return this._wakeCrosses
    }

    public addWakeCross(wakeCross: WakeCross<CourseElementPositionType>) : PassBuilder<CourseElementPositionType, VideoType> {
        this._wakeCrosses.push(wakeCross)
        return this
    }

    public addWakeCrosses(wakeCrosses: Array<WakeCross<CourseElementPositionType>>) : PassBuilder<CourseElementPositionType, VideoType> {
        this._wakeCrosses.push(...wakeCrosses)
        return this
    }

    public getBuoys() : Array<Buoy<CourseElementPositionType>> {
        return this._buoys
    }

    public addBuoy(buoy: Buoy<CourseElementPositionType>) : PassBuilder<CourseElementPositionType, VideoType> {
        this._buoys.push(buoy)
        return this
    }

    public addBuoys(buoys: Array<Buoy<CourseElementPositionType>>) : PassBuilder<CourseElementPositionType, VideoType> {
        this._buoys.push(...buoys)
        return this
    }

    public getTimeOfRecording() : number | undefined {
        return this._timeOfRecordingInSecodns
    }

    public setTimeOfRecording(timeInSeconds: number) : PassBuilder<CourseElementPositionType, VideoType> {
        this._timeOfRecordingInSecodns = timeInSeconds
        return this
    }

    public getVideo() : VideoType | undefined {
        return this._video
    }

    public setVideo(video: VideoType) : PassBuilder<CourseElementPositionType, VideoType> {
        this._video = video
        return this
    }

    public build() : Pass<CourseElementPositionType, VideoType> | undefined {
        if (this._score === undefined|| 
            this._entryGate === undefined ||
            this._exitGate === undefined || 
            this._video === undefined||
            this._timeOfRecordingInSecodns === undefined ||
            this._buoys.length === 0 || 
            this._wakeCrosses.length === 0
        ) {
            return undefined
        }

        return new Pass(
            this._score,
            this._entryGate,
            this._exitGate,
            this._wakeCrosses,
            this._buoys,
            this._timeOfRecordingInSecodns,
            this._video
        )
    }
}

export class Pass<CourseElementPositionType, VideoType> {
    readonly score: number
    readonly entryGate: Gate<CourseElementPositionType>
    readonly exitGate: Gate<CourseElementPositionType>
    readonly wakeCrosses: Array<WakeCross<CourseElementPositionType>>
    readonly buoys: Array<Buoy<CourseElementPositionType>>
    readonly timeOfRecordingInSeconds: number
    readonly videoFile: VideoType | undefined

    constructor(
        score: number,
        entryGate: Gate<CourseElementPositionType>,
        exitGate: Gate<CourseElementPositionType>,
        wakeCrosses: Array<WakeCross<CourseElementPositionType>>,
        buoys: Array<Buoy<CourseElementPositionType>>,
        timeOfRecordingInSeconds: number,
        videoFile: VideoType
    ) {
        this.score = score
        this.entryGate = entryGate
        this.exitGate = exitGate
        this.wakeCrosses = wakeCrosses
        this.buoys = buoys
        this.timeOfRecordingInSeconds = timeOfRecordingInSeconds
        this.videoFile = videoFile
    }
}
