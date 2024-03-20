import { ObjectId } from "bson";
import { File } from "../../File/file";
import { TrackingRecord } from "../trackingRecord";
import { FileSystem } from "../../../FileSystem/fileSystem";
import { LoggerService } from "../../../Logger/loggerService";
import { MotionRecord } from "../motionRecord";
import { LocationRecord } from "../locationRecord";
import { Measurement } from "../../Units/unit";
import { UnitSpeed } from "../../Units/unitSpeed";
import { UnitLength } from "../../Units/unitLength";
import { UnitAngle } from "../../Units/unitAngle";
import { UnitAcceleration } from "../../Units/unitAcceleration";
import { CloudStorage } from "../../Cloud/cloudStorage";

export class TrackingProcessor {
    private readonly logger = new LoggerService("TrackingProcessor")
    private static readonly processedStatsFileName = "processedData.CSV"

    private static readonly LONGITUDE = "longitude"
    private static readonly LATITUDE = "latitude"
    private static readonly ALTITUDE = "altitude"
    private static readonly SPEED = "speed"
    private static readonly COURSE = "course"
    private static readonly DATE = "date"
    private static readonly TIME = "time"
    private static readonly PITCH = "pitch"
    private static readonly ROLL = "roll"
    
    public async createProcessingJob(file: File): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                let uploadResponse = await this.uploadFile(file)
                return resolve(uploadResponse.id)
            } catch (error) {
                return reject(`Error during file upload or polling: ${error}`)
            }
        })
    }

    private async uploadFile(file: File): Promise<{ id: string }> {
        return { id: new ObjectId().toString() }
    }

    public async getProcessedRecords(jobId: string, onReceived: (trackingRecords: Array<TrackingRecord>) => void) {
        let pollingInterval = 60 * 1000
    
        let poll = async () => { 
            // let statusResponse = await fetch(file)
            // let { isFinished } = await statusResponse.json()
    
            // if (isFinished) {
            let records = await this.fetchProcessedRecords(jobId)
            onReceived(records)
            // } else {
            //     setTimeout(poll, pollingInterval)
            // }
        }
    
        poll()
    }
    
    private async fetchProcessedRecords(jobId: string): Promise<Array<TrackingRecord>> {
        let cloudStorage = new CloudStorage()

        let response = await cloudStorage.downloadObject(TrackingProcessor.processedStatsFileName)
        
        console.log(response.data)
        let fileContent = await FileSystem.read(response.data?.url!, 'utf8')

        return this.parseCSV(fileContent)
    }

    private parseCSV(csvString: string): TrackingRecord[] {
        let rows = csvString.split('\n')
        let headers = rows.shift()?.split(',')

        let headerToIndexMap = new Map<string, number>()
        headers?.forEach((value, index) => headerToIndexMap.set(value.toLocaleLowerCase(), index))

        if (headerToIndexMap.size === 0) {
            return []
        }
        let lastTime = -1
        let lastSpeed = -1

        return rows.map(row => {            
            let values = row.split(',')

            let dateString = values[headerToIndexMap.get(TrackingProcessor.DATE)!]
            let timeString = values[headerToIndexMap.get(TrackingProcessor.TIME)!]

            let time = this.parseCustomDateTime(dateString, timeString)

            let speed = parseFloat(values[headerToIndexMap.get(TrackingProcessor.SPEED)!])
            let altitude = parseFloat(values[headerToIndexMap.get(TrackingProcessor.ALTITUDE)!])
            let pitch = parseFloat(values[headerToIndexMap.get(TrackingProcessor.PITCH)!])
            let roll = parseFloat(values[headerToIndexMap.get(TrackingProcessor.ROLL)!])
            let course = parseFloat(values[headerToIndexMap.get(TrackingProcessor.COURSE)!])

            let longitude = parseInt(values[headerToIndexMap.get(TrackingProcessor.LONGITUDE)!])
            let latitude = parseInt(values[headerToIndexMap.get(TrackingProcessor.LATITUDE)!])

            let deltaSpeed = 1
            let deltaTime = 1

            if (lastTime !== -1 && lastSpeed !== -1) {
                deltaTime = time.getTime() - lastTime
                deltaSpeed = speed - lastSpeed

                lastSpeed = speed
                lastTime = time.getTime()
            }

            let acceleration = deltaSpeed/deltaTime
            let gForce = acceleration / 9.81

            return new TrackingRecord(
                new MotionRecord(
                    new Measurement(speed, UnitSpeed.metersPerSecond),
                    new Measurement(altitude, UnitLength.feet),
                    new Measurement(pitch, UnitAngle.degrees),
                    new Measurement(roll, UnitAngle.degrees),
                    new Measurement(course, UnitAngle.degrees),
                    new Measurement(acceleration, UnitAcceleration.metersPersecondSquared),
                    new Measurement(gForce, UnitAcceleration.gravity)
                ),
                new LocationRecord({
                    latitude: new Measurement(latitude, UnitAngle.radians),
                    longitude: new Measurement(longitude, UnitAngle.radians)
                }),
                time
            )
        })
    }

    private parseCustomDateTime(dateString: string, timeString: string): Date {
        let year = 2000 + parseInt(dateString.substring(0, 2), 10)
        let month = parseInt(dateString.substring(2, 4), 10) - 1
        let day = parseInt(dateString.substring(4), 10)
      
        let hours = parseInt(timeString.substring(0, 2), 10)
        let minutes = parseInt(timeString.substring(2, 4), 10)
        let seconds = parseInt(timeString.substring(4, 6), 10);
        let milliseconds = parseInt(timeString.substring(6), 10)
      
        return new Date(year, month, day, hours, minutes, seconds, milliseconds)
    }
}