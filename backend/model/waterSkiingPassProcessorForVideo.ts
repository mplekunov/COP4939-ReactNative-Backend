import { LoggerService } from "../logger/LoggerService";
import { Video } from "./camera/video";
import { VideoManager } from "./camera/videoManager";
import { BaseTrackingRecord } from "./data/trackingRecord";
import { Dimension, Measurement, max } from "./data/units/unit";
import { UnitAcceleration } from "./data/units/unitAcceleration";
import { UnitAngle } from "./data/units/unitAngle";
import { UnitLength } from "./data/units/unitLength";
import { UnitSpeed } from "./data/units/unitSpeed";
import { WaterSkiingCourse } from "./data/waterSkiing/Course/waterSkiingCourse";
import { Pass, PassBuilder } from "./data/waterSkiing/pass";
import { Gate } from "./data/waterSkiing/Course/gate";
import { WakeCross } from "./data/waterSkiing/Course/wakeCross";
import { Buoy } from "./data/waterSkiing/Course/buoy";
import { FileSystem } from "../fileSystem/fileSystem";
import { Session } from "./data/session";

export class WaterSkiingPassProcessorForVideo {
    private readonly logger: LoggerService = new LoggerService("WaterSkiingPassProcessorForVideo")
    private readonly videoManager: VideoManager

    private readonly NUM_OF_BUOYS = 6
    
    private readonly RANGE: Measurement<UnitLength> = new Measurement<UnitLength>(1.0, UnitLength.meters)

    constructor() {
        this.videoManager = new VideoManager()
    }

    public process(course: WaterSkiingCourse<number>, totalScore: number, session: Session<BaseTrackingRecord, Video<string>>) : Promise<Pass<number, Video<string>>> {
        this.logger.log("Starting pass processing...")

        return new Promise(async (resolve, reject) => {
            let passBuilder = new PassBuilder<number, Video<string>>()
            let video = session.video
            let records = session.trackingRecords
    
            let videoCreationDateInSeconds = Math.floor(video.creationDate.getTime() / 1000) 
    
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
    
            passBuilder.setScore(totalScore)
    
            let crossedEntryGate: Boolean = false
    
            let trimmedRecords = Array<BaseTrackingRecord>()
    
            records.forEach(record => {
                if (record.timeOfRecordingInSeconds >= videoCreationDateInSeconds) {
                    trimmedRecords.push(record)
                }
            })

            let alpha = 0.1
            let offset: number | undefined
    
            trimmedRecords.forEach(record => {
                if (this.inRange(record.timeOfRecordingInSeconds, course.entryGatePosition + videoCreationDateInSeconds, alpha)) {
                    passBuilder.setEntryGate(new Gate(
                        0,
                        record.motion.speed,
                        record.motion.attitude.roll,
                        record.motion.attitude.pitch,
                        record.timeOfRecordingInSeconds
                    )).setTimeOfRecording(record.timeOfRecordingInSeconds)
    
                    offset = course.entryGatePosition
                    crossedEntryGate = true
                }
            })
    
            trimmedRecords.forEach(record => {
                if (crossedEntryGate && offset !== undefined) {
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
    
                if (this.inRange(record.timeOfRecordingInSeconds, course.exitGatePosition + videoCreationDateInSeconds, alpha)) {
                    passBuilder.setExitGate(
                        new Gate(
                            course.exitGatePosition - offset!,
                            maxSpeed,
                            maxRoll,
                            maxPitch,
                            record.timeOfRecordingInSeconds
                        )
                    )
                }
    
                if (wakeCrossIndex < course.wakeCrossPositions.length && this.inRange(record.timeOfRecordingInSeconds, course.wakeCrossPositions[wakeCrossIndex] + videoCreationDateInSeconds, alpha)) {
                    passBuilder.addWakeCross(
                        new WakeCross(
                            course.wakeCrossPositions[wakeCrossIndex] - offset!,
                            maxSpeed,
                            maxRoll,
                            maxPitch,
                            maxAngle,
                            maxGForce,
                            maxAcceleration,
                            record.timeOfRecordingInSeconds
                        )
                    )

                    wakeCrossIndex ++
                }
    
                if (buoyIndex < course.buoyPositions.length && this.inRange(record.timeOfRecordingInSeconds, course.buoyPositions[buoyIndex] + videoCreationDateInSeconds, alpha)) {
                    passBuilder.addBuoy(
                        new Buoy(
                            course.buoyPositions[buoyIndex] - offset!,
                            maxSpeed,
                            maxRoll,
                            maxPitch,
                            record.timeOfRecordingInSeconds
                        )
                    )
    
                    buoyIndex++ 
                }
            })

            if (passBuilder.getEntryGate() === undefined || passBuilder.getExitGate() === undefined) {
                return reject("Entry/Exit gates undefined.")
            }
    
            try {
                let trimmedVideo = await this.trimVideo(
                    passBuilder.getEntryGate()?.timeOfRecordingInSeconds!,
                    passBuilder.getExitGate()?.timeOfRecordingInSeconds!,
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
                return reject(error)
            }
        })
    }

    private inRange(first: number, second: number, alpha: number) : Boolean {
        return Math.abs(first - second) <= alpha
    }

    private trimVideo(startTime: number, endTime: number, video: Video<string>) : Promise<Video<string>> {
        return new Promise(async (resolve, reject) => {
            let documentsDirectory = FileSystem.getDocumentDir()

            if (documentsDirectory === null) {
                return reject("Document directory is undefined")
            }

            this.logger.log(`${video.creationDate.getTime() / 1000}`)

            let creationDate = Math.floor(video.creationDate.getTime() / 1000)

            let start = Math.ceil(Math.abs(creationDate - startTime))
            let end = Math.floor(Math.abs(creationDate - endTime))

            this.logger.log(`${start} - start`)
            this.logger.log(`${end} - end`)

            let movieOutputURL = documentsDirectory + "/" + video.id + "." + video.fileLocation.split(".").pop()

            try {
                let result = await this.videoManager.trimVideo(video.fileLocation, movieOutputURL, start, end)
                
                if (!result) {
                    return reject("Couldn't trim video.")
                }

                return resolve(new Video<string>(video.id, video.creationDate, movieOutputURL, end - start))
            } catch (error) {
                return reject(error)
            }
        })
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