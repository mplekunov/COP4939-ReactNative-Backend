import { Converter } from "../../Database/database"
import { Coordinate, CoordinateConverter } from "../../Units/coordinate"

export enum ProcessingStatus {
    Processed,
    Processing
}

export interface WaterSkiingCourse<T> {
    buoyPositions: T[]
    wakeCrossPositions: T[]
    entryGatePosition: T
    exitGatePosition: T
}

export interface ProcessableWaterSkiingCourse {
    id: string
    name: string
    status: ProcessingStatus
    preProcessedCourse: WaterSkiingCourse<Date>
    processedCourse?: WaterSkiingCourse<Coordinate>
}

class PreProcessedCourseConverter implements Converter<WaterSkiingCourse<Date>> {
    convertToSchema(course: WaterSkiingCourse<Date>) {
        return {
            buoyPositions: course?.buoyPositions,
            wakeCrossPositions: course?.wakeCrossPositions,
            entryGatePosition: course?.entryGatePosition,
            exitGatePosition: course?.exitGatePosition
        }
    }

    convertFromSchema(schema: any): WaterSkiingCourse<Date> {
        try {
            return {
                buoyPositions: (schema.buoyPositions as []).map(schema => new Date(schema)),
                wakeCrossPositions: (schema.wakeCrossPositions as []).map(schema => new Date(schema)),
                entryGatePosition: new Date(schema.entryGatePosition),
                exitGatePosition: new Date(schema.exitGatePosition)
            }
        } catch(error: any) {
            throw new Error(`Pass ~ ${error.message}`)
        }
    }
}

class ProcessedCourseConverter implements Converter<WaterSkiingCourse<Coordinate>>{
    private coordinateConverter = new CoordinateConverter()
    
    convertToSchema(course: WaterSkiingCourse<Coordinate>) {
        if (!course) {
            return null
        }

        return {
            buoyPositions: course?.buoyPositions?.map(buoy => this.coordinateConverter.convertToSchema(buoy)) ?? null,
            wakeCrossPositions: course?.wakeCrossPositions?.map(wakeCross => this.coordinateConverter.convertToSchema(wakeCross)) ?? null,
            entryGatePosition: this.coordinateConverter.convertToSchema(course?.entryGatePosition) ?? null,
            exitGatePosition: this.coordinateConverter.convertToSchema(course?.exitGatePosition) ?? null
        }
    }

    convertFromSchema(schema: any): WaterSkiingCourse<Coordinate> {
        try {
            return {
                buoyPositions: (schema.buoyPositions as []).map(schema => this.coordinateConverter.convertFromSchema(schema)),
                wakeCrossPositions: (schema.wakeCrossPositions as []).map(schema => this.coordinateConverter.convertFromSchema(schema)),
                entryGatePosition: this.coordinateConverter.convertFromSchema(schema.entryGatePosition),
                exitGatePosition: this.coordinateConverter.convertFromSchema(schema.exitGatePosition)
            }
        } catch(error: any) {
            throw new Error(`Pass ~ ${error.message}`)
        }
    }
}

export class WaterSkiingCourseConverter implements Converter<ProcessableWaterSkiingCourse> {
    private preProcessedConverter = new PreProcessedCourseConverter()
    private processedConverter = new ProcessedCourseConverter()

    convertToSchema(object: ProcessableWaterSkiingCourse) {
        return {
            id: object?.id,
            name: object?.name,
            preProcessedCourse: this.preProcessedConverter.convertToSchema(object.preProcessedCourse!),
            processedCourse: !object.processedCourse ? null : this.processedConverter.convertToSchema(object.processedCourse) 
        }
    }

    convertFromSchema(schema: any): ProcessableWaterSkiingCourse {
        try {
            let status = schema.status as ProcessingStatus
            if (status === ProcessingStatus.Processing) {
                return {
                    id: schema.id,
                    name: schema.name,
                    status: status,
                    preProcessedCourse: this.preProcessedConverter.convertFromSchema(schema.preProcessedCourse)
                }
            }

            return {
                id: schema.id,
                name: schema.name,
                status: status,
                preProcessedCourse: this.preProcessedConverter.convertFromSchema(schema.preProcessedCourse),
                processedCourse: !schema.processedCourse ? undefined : this.processedConverter.convertFromSchema(schema.processedCourse)
            }
        } catch(error: any) {
            throw new Error(`Pass ~ ${error.message}`)
        }
    }
}