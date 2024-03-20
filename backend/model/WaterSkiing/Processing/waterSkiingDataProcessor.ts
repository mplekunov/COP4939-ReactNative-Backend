import { FileSystem } from "../../../FileSystem/fileSystem";
import { LoggerService } from "../../../Logger/loggerService";
import { Video } from "../../Camera/video";
import { VideoManager } from "../../Camera/videoManager";
import { TrackingSession } from "../../Tracking/trackingSession";
import { TrackingRecord } from "../../Tracking/trackingRecord";
import { Coordinate } from "../../Units/coordinate";
import { Dimension, Measurement, max } from "../../Units/unit";
import { UnitAcceleration } from "../../Units/unitAcceleration";
import { UnitAngle } from "../../Units/unitAngle";
import { UnitLength } from "../../Units/unitLength";
import { UnitSpeed } from "../../Units/unitSpeed";
import { ProcessableWaterSkiingCourse, WaterSkiingCourse } from "../Course/waterSkiingCourse";
import { Pass, ProcessablePass } from "./pass";

export class WaterSkiingDataProcessor {
    private readonly logger = new LoggerService("WaterSkiingPassProcessor")
    private readonly videoManager = new VideoManager()

    private readonly NUM_OF_BUOYS = 6
    private readonly NUM_OF_WAKE_CROSSES = 5

    private readonly RANGE = new Measurement<UnitLength>(1.0, UnitLength.meters)
    
    private getTimeInSeconds(date: Date): number {
        return Math.round(date.getTime() / 1000)
    }
    
    public processCourse(dateCourse: WaterSkiingCourse<Date>, trackingRecords: TrackingRecord[]): WaterSkiingCourse<Coordinate> {
        let course: Partial<WaterSkiingCourse<Coordinate>> = {
            buoyPositions: [],
            wakeCrossPositions: [],
        }

        let coordinateMap =  new Map<number, Coordinate>()

        trackingRecords.forEach(record => coordinateMap.set(this.getTimeInSeconds(record.date), record.location.coordinate))

        try {
            dateCourse.buoyPositions.forEach(date => {
                if (coordinateMap.has(this.getTimeInSeconds(date))) {
                    course.buoyPositions?.push(coordinateMap.get(this.getTimeInSeconds(date))!)
                }
            })

            dateCourse.wakeCrossPositions.forEach(date => {
                if (coordinateMap.has(this.getTimeInSeconds(date))) {
                    course.wakeCrossPositions?.push(coordinateMap.get(this.getTimeInSeconds(date))!)
                }
            })

            if (coordinateMap.has(this.getTimeInSeconds(dateCourse.entryGatePosition))) {
                course.entryGatePosition = coordinateMap.get(this.getTimeInSeconds(dateCourse.entryGatePosition))
            }

            if (coordinateMap.has(this.getTimeInSeconds(dateCourse.exitGatePosition))) {
                course.exitGatePosition = coordinateMap.get(this.getTimeInSeconds(dateCourse.exitGatePosition))
            }

            return {
                buoyPositions: course.buoyPositions!,
                wakeCrossPositions: course.wakeCrossPositions!,
                entryGatePosition: course.entryGatePosition!,
                exitGatePosition: course.exitGatePosition!
            }
        } catch(error: any) {
            this.logger.error(error)
            throw error
        }
    }    
    
    public async processPass(course: WaterSkiingCourse<Coordinate>, session: TrackingSession) : Promise<Pass> {
        return new Promise(async (resolve, reject) => {
            let records = session.trackingRecords
            let video = session.video
            
            var pass: Partial<Pass> = {}

            let videoCreationDate = video.creationDate
    
            if (records.length == 0) {
                return reject("Data array cannot be empty")
            }
    
            if (course.buoyPositions.length != course.wakeCrossPositions.length && course.wakeCrossPositions.length != this.NUM_OF_BUOYS) {
                return reject("The number of buoys/wake crosses is incorrect")
            }
    
            let maxSpeed = new Measurement<UnitSpeed>(0.0, records[0].motion.speed.unit)
            let maxRoll = new Measurement<UnitAngle>(0.0, records[0].motion.roll.unit)
            let maxPitch = new Measurement<UnitAngle>(0.0, records[0].motion.pitch.unit)
            let maxGForce = new Measurement<UnitAcceleration>(0.0, records[0].motion.gForce.unit)
            let maxAcceleration = new Measurement<UnitAcceleration>(0.0, records[0].motion.acceleration.unit)
            let maxCourse = new Measurement<UnitAngle>(0.0, records[0].motion.course.unit)
    
            let wakeCrossIndex = 0
            let buoyIndex = 0
    
            pass.score = this.calculateTotalScore(course, records)
    
            let crossedEntryGate: Boolean = false
    
            let trimmedRecords = Array<TrackingRecord>()
    
            records.forEach(record => {
                if (record.date >= videoCreationDate) {
                    trimmedRecords.push(record)
                }
            })
    
            trimmedRecords.forEach(record => {
                if (crossedEntryGate) {
                    maxSpeed = max(record.motion.speed, maxSpeed)
                    maxPitch = max(record.motion.pitch, maxPitch)
                    maxRoll = max(record.motion.roll, maxRoll)
                    maxCourse = max(record.motion.course, maxCourse)
                    maxGForce = max(record.motion.gForce, maxGForce)
                    maxAcceleration = max(record.motion.acceleration, maxAcceleration)
                }
    
                if (this.inRange(record.location.coordinate, course.entryGatePosition, this.RANGE)) {
                    pass.entryGate = {
                        position: course.entryGatePosition,
                        maxSpeed: record.motion.speed,
                        maxRoll: record.motion.roll,
                        maxPitch: record.motion.pitch,
                        date: record.date
                    }
    
                    crossedEntryGate = true
                }
    
                if (this.inRange(record.location.coordinate, course.exitGatePosition, this.RANGE)) {
                    pass.exitGate = {
                        position: course.exitGatePosition,
                        maxSpeed: maxSpeed,
                        maxRoll: maxRoll,
                        maxPitch: maxPitch,
                        date: record.date
                    }
                }
    
                if (buoyIndex < course.buoyPositions.length && this.inRange(record.location.coordinate, course.buoyPositions[buoyIndex], this.RANGE)) {
                    pass.buoys?.push(
                        {
                            position: course.buoyPositions[buoyIndex],
                            maxSpeed: maxSpeed,
                            maxRoll: maxRoll,
                            maxPitch: maxPitch,
                            date: record.date
                        }
                    )
    
                    buoyIndex++ 
                }

                if (wakeCrossIndex < course.wakeCrossPositions.length && this.inRange(record.location.coordinate, course.wakeCrossPositions[wakeCrossIndex], this.RANGE)) {
                    pass.wakeCrosses?.push(
                        {
                            position: course.wakeCrossPositions[wakeCrossIndex],
                            maxSpeed: maxSpeed,
                            maxRoll: maxRoll,
                            maxPitch: maxPitch,
                            maxAngle: maxCourse,
                            maxGForce: maxGForce,
                            maxAcceleration: maxAcceleration,
                            date: record.date
                        }
                    )

                    wakeCrossIndex++
                }
            })

            let exitGate = pass.exitGate
            let entryGate = pass.entryGate
    
            if (entryGate === undefined || exitGate === undefined) {
                return reject("Entry/Exit gates undefined.")
            }
    
            try {
                let trimmedVideo = await this.trimVideo(
                    exitGate.date.getTime(),
                    entryGate.date.getTime(),
                    video
                )

                pass.video =trimmedVideo

                if (pass?.buoys?.length !== this.NUM_OF_BUOYS || pass?.wakeCrosses?.length !== this.NUM_OF_WAKE_CROSSES) {
                    return reject("Number of buoys or wake crosses is incorrect in the calculated pass.")
                }
    
                if (!pass) {
                    return reject("Pass is undefined.")   
                }

                return resolve({
                    buoys: pass.buoys!,
                    entryGate: pass.entryGate!,
                    exitGate: pass.exitGate!,
                    score: pass.score!,
                    video: pass.video!,
                    wakeCrosses: pass.wakeCrosses!
                })
            } catch (error) {
                this.logger.error(`${error}`)
                return reject(error)
            }
        })
    }

    private trimVideo(startTime: number, endTime: number, video: Video) : Promise<Video> {
        return new Promise(async (resolve, reject) => {
            let documentsDirectory = FileSystem.getDocumentDir()

            if (documentsDirectory === null) {
                return reject("Document directory is undefined")
            }
    
            let creationDate = Math.floor(video.creationDate.getTime())
    
            let start = Math.abs(creationDate - startTime)
            let end = Math.abs(creationDate - endTime)
    
            let movieOutputURL = documentsDirectory + "/" + video.id + "." + video.url.split(".").pop()
    
            try {
                let result = await this.videoManager.trimVideo(video.url, movieOutputURL, start, end)
                
                if (!result) {
                    return reject("Couldn't trim video.")
                }

                return resolve({
                    id: video.id, 
                    creationDate: video.creationDate, 
                    url: movieOutputURL, 
                    durationInMilliseconds: end - start, 
                    extension: video.extension
                })
            } catch (error) {
                this.logger.error(`${error}`)
                return reject(error)
            }
        })
    }

    private calculateTotalScore(course: WaterSkiingCourse<Coordinate>, records: Array<TrackingRecord>) : number {
        let i = 0
        let score = 0
        
        records.forEach(record => {
            if (i < course.buoyPositions.length && this.inRange(record.location.coordinate, course.buoyPositions[i], this.RANGE)) {
                let skier = record.location.coordinate
                let buoy = course.buoyPositions[i]
                let entryGate = course.entryGatePosition
                let exitGate = course.exitGatePosition

                if (i % 2 === 0) {
                    score += this.getBuoyScore(skier, buoy, entryGate, exitGate, Side.Right)
                } else {
                    score += this.getBuoyScore(skier, buoy, entryGate, exitGate, Side.Left)
                }

                i += 1
            }
        })

        return score
    }

    private getBuoyScore(skier: Coordinate, buoy: Coordinate, entryGate: Coordinate, exitGate: Coordinate, fromSide: Side) : number {
        if (fromSide === Side.Left && this.isLeftOf(skier, buoy, entryGate, exitGate) ||
            fromSide === Side.Right && this.isRightOf(skier, buoy, entryGate, exitGate)) {
                return 1
            }
        
        return 0
    }

    private isLeftOf(skier: Coordinate, buoy: Coordinate, entryGate: Coordinate, exitGate: Coordinate) : Boolean {
        var bearingA = this.getBearingAngle(buoy, skier)
        var bearingB = this.getBearingAngle(entryGate, exitGate)

        let offset = new Measurement<UnitAngle>(90, UnitAngle.degrees).subtract(bearingB)
        bearingA = bearingA.subtract(offset)

        return bearingA > new Measurement<UnitAngle>(90, UnitAngle.degrees) && bearingA < new Measurement<UnitAngle>(270, UnitAngle.degrees)
    }

    private isRightOf(skier: Coordinate, buoy: Coordinate, entryGate: Coordinate, exitGate: Coordinate) : Boolean {
        var bearingA = this.getBearingAngle(buoy, skier)
        var bearingB = this.getBearingAngle(entryGate, exitGate)

        let offset = new Measurement<UnitAngle>(90, UnitAngle.degrees).subtract(bearingB)
        bearingA = bearingA.subtract(offset)

        return !(bearingA > new Measurement<UnitAngle>(90, UnitAngle.degrees) && bearingA < new Measurement<UnitAngle>(270, UnitAngle.degrees))
    }

    private getBearingAngle(start: Coordinate, end: Coordinate) : Measurement<UnitAngle> {
        let startLat = start.latitude.converted(UnitAngle.radians)
        let endLat = end.latitude.converted(UnitAngle.radians)
        let startLon = start.longitude.converted(UnitAngle.radians)
        let endLon = end.longitude.converted(UnitAngle.radians)

        let dLon = endLon.subtract(startLon)

        let y = Math.sin(dLon.value) * Math.cos(endLon.value)
        let x = Math.cos(startLat.value) * Math.sin(endLat.value) - Math.sin(startLat.value) * Math.cos(endLat.value) * Math.cos(dLon.value)

        let c = Math.atan2(y, x)

        let bearing = new Measurement<UnitAngle>(c, UnitAngle.radians)

        bearing = bearing.converted(UnitAngle.degrees).add(new Measurement<UnitAngle>(360, UnitAngle.degrees))

        return new Measurement(bearing.value / 360, UnitAngle.degrees)
    }

    private inRange(point: Coordinate, within: Coordinate, withRange: Measurement<UnitAngle>) : Boolean {
        let distance = this.getHaversineDistance(point, within)

        return distance <= withRange
    }

    private getHaversineDistance(start: Coordinate, end: Coordinate) : Measurement<UnitLength> {
        let r = 6371000.0

        let phi_1 = start.latitude.converted(UnitAngle.radians)
        let phi_2 = end.latitude.converted(UnitAngle.radians)
        let lambda_1 = start.longitude.converted(UnitAngle.radians)
        let lambda_2 = end.longitude.converted(UnitAngle.radians)

        let dPhi = phi_2.subtract(phi_1)
        let dLambda = lambda_2.subtract(lambda_1)

        let dPhiSin2 = Math.pow(Math.sin(dPhi.value / 2.0), 2)
        let dLambdaSin2 = Math.pow(Math.sin(dLambda.value / 2.0), 2)

        let a = dPhiSin2 + Math.cos(phi_1.value) * Math.cos(phi_2.value) * dLambdaSin2

        let d = 2 * r * Math.asin(Math.sqrt(a))

        return new Measurement(d, UnitLength.meters)
    }

    private getTotalFromPythagorean<T extends Dimension>(x: Measurement<T>, y: Measurement<T>, z: Measurement<T>) : Measurement<T> {
        let xValue = x.value
        let yValue = y.value
        let zValue = z.value

        if (x.unit != y.unit || y.unit != z.unit) {
            this.logger.error("Units are not the same.")
        }

        let totalValue = Math.sqrt(xValue * xValue + yValue * yValue + zValue * zValue)

        return new Measurement(totalValue, x.unit)
    }
}

enum Side {
    Left,
    Right
}