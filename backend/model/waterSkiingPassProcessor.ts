import { FileSystem } from "../fileSystem/fileSystem";
import { LoggerService } from "../logger/LoggerService";
import { Video } from "./camera/video";
import { VideoManager } from "./camera/videoManager";
import { Session } from "./data/session";
import { TrackingRecord } from "./data/trackingRecord";
import { Coordinate } from "./data/units/coordinate";
import { Dimension, Measurement, max } from "./data/units/unit";
import { UnitAcceleration } from "./data/units/unitAcceleration";
import { UnitAngle } from "./data/units/unitAngle";
import { UnitLength } from "./data/units/unitLength";
import { UnitSpeed } from "./data/units/unitSpeed";
import { Buoy } from "./data/waterSkiing/Course/buoy";
import { Gate } from "./data/waterSkiing/Course/gate";
import { WakeCross } from "./data/waterSkiing/Course/wakeCross";
import { WaterSkiingCourse } from "./data/waterSkiing/Course/waterSkiingCourse";
import { Pass, PassBuilder } from "./data/waterSkiing/pass";

export class WaterSkiingPassProcessorForCoordinates {
    private readonly logger: LoggerService
    private readonly videoManager: VideoManager

    private readonly NUM_OF_BUOYS = 6

    private readonly RANGE: Measurement<UnitLength> = new Measurement<UnitLength>(1.0, UnitLength.meters)

    constructor() {
        this.logger = new LoggerService(typeof(this))
        this.videoManager = new VideoManager()
    }

    public async process(course: WaterSkiingCourse<Coordinate>, session: Session<TrackingRecord, Video<string>>) : Promise<Pass<Coordinate, Video<string>>> {
        return new Promise(async (resolve, reject) => {
            let records = session.trackingRecords
            let video = session.video
            
            let passBuilder = new PassBuilder<Coordinate, Video<string>>()
            let videoCreationDate = Math.floor(video.creationDate.getTime()) 
    
            if (records.length == 0) {
                return reject("Data array cannot be empty")
            }
    
            if (course.buoyPositions.length != course.wakeCrossPositions.length && course.wakeCrossPositions.length != this.NUM_OF_BUOYS) {
                return reject("The number of buoys/wake crosses is incorrect")
            }
    
            let maxSpeed = new Measurement<UnitSpeed>(0.0, records[0].motion.speed.unit)
            let maxRoll = new Measurement<UnitAngle>(0.0, records[0].motion.attitude.roll.unit)
            let maxPitch = new Measurement<UnitAngle>(0.0, records[0].motion.attitude.pitch.unit)
            let maxGForce = new Measurement<UnitAcceleration>(0.0, records[0].motion.gForce.x.unit)
            let maxAcceleration = new Measurement<UnitAcceleration>(0.0, records[0].motion.acceleration.x.unit)
            let maxAngle = new Measurement<UnitAngle>(0.0, records[0].motion.attitude.yaw.unit)
    
            let wakeCrossIndex = 0
            let buoyIndex = 0
    
            passBuilder.setScore(this.calculateTotalScore(course, records))
    
            let crossedEntryGate: Boolean = false
    
            let trimmedRecords = Array<TrackingRecord>()
    
            records.forEach(record => {
                if (record.timeOfRecrodingInMilliseconds >= videoCreationDate) {
                    trimmedRecords.push(record)
                }
            })
    
            trimmedRecords.forEach(record => {
                if (crossedEntryGate) {
                    maxSpeed = max(record.motion.speed, maxSpeed)
                    maxPitch = max(record.motion.attitude.pitch, maxPitch)
                    maxRoll = max(record.motion.attitude.roll, maxRoll)
                    maxAngle = max(record.motion.attitude.yaw, maxAngle)
                    maxGForce = max(
                        this.getTotalFromPythagorean(record.motion.gForce.x, record.motion.gForce.y, record.motion.gForce.z),
                        maxGForce
                    )
                    maxAcceleration = max(
                        this.getTotalFromPythagorean(record.motion.acceleration.x, record.motion.acceleration.y, record.motion.acceleration.z),
                        maxAcceleration
                    )
                }
    
                if (this.inRange(record.location.coordinate, course.entryGatePosition, this.RANGE)) {
                    passBuilder.setEntryGate(
                        new Gate(
                            course.entryGatePosition,
                            record.motion.speed,
                            record.motion.attitude.roll,
                            record.motion.attitude.pitch,
                            record.timeOfRecrodingInMilliseconds
                        )
                    )
    
                    crossedEntryGate = true
                }
    
                if (this.inRange(record.location.coordinate, course.exitGatePosition, this.RANGE)) {
                    passBuilder.setExitGate(
                        new Gate(
                            course.exitGatePosition,
                            maxSpeed,
                            maxRoll,
                            maxPitch,
                            record.timeOfRecrodingInMilliseconds
                        )
                    )
                }
    
                if (wakeCrossIndex < course.wakeCrossPositions.length && this.inRange(record.location.coordinate, course.wakeCrossPositions[wakeCrossIndex], this.RANGE)) {
                    passBuilder.addWakeCross(
                        new WakeCross(
                            course.wakeCrossPositions[wakeCrossIndex],
                            maxSpeed,
                            maxRoll,
                            maxPitch,
                            maxAngle,
                            maxGForce,
                            maxAcceleration,
                            record.timeOfRecrodingInMilliseconds
                        )
                    )

                    wakeCrossIndex++
                }
    
                if (buoyIndex < course.buoyPositions.length && this.inRange(record.location.coordinate, course.buoyPositions[buoyIndex], this.RANGE)) {
                    passBuilder.addBuoy(
                        new Buoy(
                            course.buoyPositions[buoyIndex],
                            maxSpeed,
                            maxRoll,
                            maxPitch,
                            record.timeOfRecrodingInMilliseconds
                        )
                    )
    
                    buoyIndex++ 
                }
            })

            let exitGate = passBuilder.getExitGate()
            let entryGate = passBuilder.getEntryGate()
    
            if (entryGate === undefined || exitGate === undefined) {
                return reject("Entry/Exit gates undefined.")
            }
    
            try {
                let trimmedVideo = await this.trimVideo(
                    exitGate.timeOfRecordingInMilliseconds,
                    entryGate.timeOfRecordingInMilliseconds,
                    video
                )

                passBuilder.setVideo(trimmedVideo)
                let pass = passBuilder.build()

                if (pass?.buoys.length !== this.NUM_OF_BUOYS || pass.wakeCrosses.length !== this.NUM_OF_BUOYS) {
                    return reject("Number of buoys or wake crosses is incorrect in the calculated pass.")
                }
    
                if (!pass) {
                    return reject("Pass is undefined.")   
                }

                return resolve(pass)
            } catch (error) {
                this.logger.error(`${error}`)
                return reject(error)
            }
        })
    }

    private trimVideo(startTime: number, endTime: number, video: Video<string>) : Promise<Video<string>> {
        return new Promise(async (resolve, reject) => {
            let documentsDirectory = FileSystem.getDocumentDir()

            if (documentsDirectory === null) {
                return reject("Document directory is undefined")
            }
    
            let creationDate = Math.floor(video.creationDate.getTime())
    
            let start = Math.abs(creationDate - startTime)
            let end = Math.abs(creationDate - endTime)
    
            let movieOutputURL = documentsDirectory + "/" + video.id + "." + video.fileLocation.split(".").pop()
    
            try {
                let result = await this.videoManager.trimVideo(video.fileLocation, movieOutputURL, start, end)
                
                if (!result) {
                    return reject("Couldn't trim video.")
                }

                return resolve(new Video<string>(video.id, video.creationDate, movieOutputURL, end - start))
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