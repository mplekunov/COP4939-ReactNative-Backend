import { Video, VideoConverter } from "../../Camera/video"
import { Converter } from "../../Database/database"
import { Buoy, BuoyConverter } from "../Course/buoy"
import { Gate, GateConverter } from "../Course/gate"
import { WakeCross, WakeCrossConverter } from "../Course/wakeCross"
import { ProcessingStatus } from "../Course/waterSkiingCourse"

export interface Pass {
    video: Video
    score: number
    entryGate: Gate
    exitGate: Gate
    wakeCrosses: Array<WakeCross>
    buoys: Array<Buoy>
}

export interface ProcessablePass {
    id: string
    date: Date
    status: ProcessingStatus
    processedPass?: Pass
}

class PassConverter implements Converter<Pass> {
    private gateConverter = new GateConverter()
    private wakeCrossConverter = new WakeCrossConverter()
    private buoyConverter = new BuoyConverter()
    private videoConverter = new VideoConverter()

    convertToSchema(object: Pass): any {
        return {
            score: object.score,
            entryGate: this.gateConverter.convertToSchema(object.entryGate),
            exitGate: this.gateConverter.convertToSchema(object.exitGate),
            wakeCrosses: object.wakeCrosses.map(wakeCross => this.wakeCrossConverter.convertToSchema(wakeCross)),
            buoys: object.buoys.map(buoy => this.buoyConverter.convertToSchema(buoy)),
            video: this.videoConverter.convertToSchema(object.video)
        }
    }

    convertFromSchema(schema: any): Pass {
        try {
            return {
                score: parseInt(schema.score),
                entryGate: this.gateConverter.convertFromSchema(schema.entryGate),
                exitGate: this.gateConverter.convertFromSchema(schema.exitGate),
                wakeCrosses: (schema.wakeCrosses as []).map(schema => this.wakeCrossConverter.convertFromSchema(schema)),
                buoys: (schema.buoys as []).map(schema => this.buoyConverter.convertFromSchema(schema)),
                video: this.videoConverter.convertFromSchema(schema.video)
            }
        } catch(error: any) {
            throw new Error(`Pass ~ ${error.message}`)
        }
    }
}


export class ProcessablePassConverter implements Converter<ProcessablePass> {
    private passConverter = new PassConverter()

    convertToSchema(pass: Partial<ProcessablePass>): any {
        return {
            id: pass.id,
            date: pass.date,
            status: pass.status,
            processedPass: pass.processedPass ? this.passConverter.convertToSchema(pass.processedPass) : null 
        }
    }

    convertFromSchema(schema: any): ProcessablePass {
        try {
            let status = schema.status as ProcessingStatus

            if (status === ProcessingStatus.Processing) {
                return {
                    id: schema.id,
                    status: status,
                    date: new Date(schema.date)
                }
            }

            return {
                id: schema.id,
                date: new Date(schema.date),
                status: status,
                processedPass: this.passConverter.convertFromSchema(schema.processedPass)
            }
        } catch(error: any) {
            console.log(error)
            throw new Error(`ProcessablePass ~ ${error.message}`)
        }
    }
}
