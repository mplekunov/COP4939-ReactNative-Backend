import { Video } from "../../Camera/video"
import { Coordinate } from "../../Units/coordinate"
import { Buoy } from "./buoy"
import { Gate } from "./gate"
import { WakeCross } from "./wakeCross"

export class PassBuilder {
    private _score: number | undefined
    private _entryGate: Gate | undefined
    private _exitGate: Gate | undefined
    private _wakeCrosses : Array<WakeCross> = Array()
    private _buoys: Array<Buoy> = Array()
    private _date : Date | undefined
    private _video: Video | undefined

    public getScore() : number | undefined {
        return this._score
    }

    public setScore(score: number) : PassBuilder {
        this._score = score
        return this
    }

    public getEntryGate() : Gate | undefined {
        return this._entryGate
    }

    public setEntryGate(gate: Gate) : PassBuilder {
        this._entryGate = gate
        return this
    }

    public getExitGate() : Gate | undefined {
        return this._exitGate
    }

    public setExitGate(gate: Gate) : PassBuilder {
        this._exitGate = gate
        return this
    }

    public getWakeCrosses() : Array<WakeCross> {
        return this._wakeCrosses
    }

    public addWakeCross(wakeCross: WakeCross) : PassBuilder {
        this._wakeCrosses.push(wakeCross)
        return this
    }

    public addWakeCrosses(wakeCrosses: Array<WakeCross>) : PassBuilder {
        this._wakeCrosses.push(...wakeCrosses)
        return this
    }

    public getBuoys() : Array<Buoy> {
        return this._buoys
    }

    public addBuoy(buoy: Buoy) : PassBuilder {
        this._buoys.push(buoy)
        return this
    }

    public addBuoys(buoys: Array<Buoy>) : PassBuilder {
        this._buoys.push(...buoys)
        return this
    }

    public getDate() : Date | undefined {
        return this._date
    }

    public setDate(date: Date) : PassBuilder {
        this._date = date
        return this
    }

    public getVideo() : Video | undefined {
        return this._video
    }

    public setVideo(video: Video) : PassBuilder {
        this._video = video
        return this
    }

    public build() : Pass | undefined {
        if (this._score === undefined|| 
            this._entryGate === undefined ||
            this._exitGate === undefined || 
            this._video === undefined||
            this._date === undefined ||
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
            this._date,
            this._video
        )
    }
}

export class Pass {
    readonly score: number
    readonly entryGate: Gate
    readonly exitGate: Gate
    readonly wakeCrosses: Array<WakeCross>
    readonly buoys: Array<Buoy>
    readonly date: Date
    readonly video: Video

    constructor(
        score: number,
        entryGate: Gate,
        exitGate: Gate,
        wakeCrosses: Array<WakeCross>,
        buoys: Array<Buoy>,
        date: Date,
        video: Video
    ) {
        this.score = score
        this.entryGate = entryGate
        this.exitGate = exitGate
        this.wakeCrosses = wakeCrosses
        this.buoys = buoys
        this.date = date
        this.video = video
    }

    convertToSchema(): any {
        return {
            score: this.score,
            entryGate: this.entryGate.convertToSchema(),
            exitGate: this.exitGate.convertToSchema(),
            wakeCrosses: this.wakeCrosses.map(wakeCross => wakeCross.convertToSchema()),
            buoys: this.buoys.map(buoy => buoy.convertToSchema()),
            date: this.date,
            video: this.video.convertToSchema()
        }
    }

    static convertFromSchema(schema: any): Pass {
        try {
            return new Pass(
                parseInt(schema.score),
                Gate.convertFromSchema(schema.entryGate),
                Gate.convertFromSchema(schema.exitGate),
                (schema.wakeCrosses as []).map(schema => WakeCross.convertFromSchema(schema)),
                (schema.buoys as []).map(schema => Buoy.convertFromSchema(schema)),
                new Date(schema.date),
                Video.convertFromSchema(schema.video)
            )
        } catch(error: any) {
            throw new Error(`Pass ~ ${error.message}`)
        }
    }
}
