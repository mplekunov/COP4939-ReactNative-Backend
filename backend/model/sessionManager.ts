import { LoggerService } from "../logger/LoggerService"
import { BaseTrackingRecord } from "./data/trackingRecord"
import { DataPacket, DataType } from "./data/watch/dataPacket"
import { WatchConnectivityManager } from "./watchConnectivityManager"
import uuid from 'react-native-uuid';
import { Buffer } from 'buffer'
import { BaseTrackingSession } from "./data/session";

export class WatchSessionManager {
    private readonly watchManager: WatchConnectivityManager
    private readonly logger = new LoggerService("WatchSessionManager")

    private sessionID: string | null = null
    private sessiontStartTimeInSeconds: number | null = null

    private readonly TIME_OUT_IN_SECONDS = 30

    constructor() {
        this.watchManager = WatchConnectivityManager.getInstance()
    }

    public getSessionID() : string | null {
        return this.sessionID
    }

    private clearSessionProperties() {
        this.sessionID = null
        this.sessiontStartTimeInSeconds = null
    }

    public startSession(): Promise<void> {
        this.logger.log("Starting Session...")
        this.clearSessionProperties()

        return new Promise(async (resolve, reject) => {
            try {
                this.sessionID = uuid.v4().toString()
                this.sessiontStartTimeInSeconds = Date.now() / 1000

                await this.watchManager.send(this.encoder(DataType.WatchSessionStart, this.sessionID, ""))
                await this.getWatchResponse(DataType.WatchSessionStart)

                return resolve()
            } catch(error) {
                this.logger.error(`${error}`)
                this.clearSessionProperties()
                return reject(error)
            }
        })
    }

    public stopSession(): Promise<BaseTrackingSession<BaseTrackingRecord>> {
        this.logger.log("Ending Session...")
        return new Promise(async (resolve, reject) => {
            try {
                if (!this.sessionID) {
                    return reject("Session has not been started yet.")
                }

                if (!this.sessiontStartTimeInSeconds) {
                    return reject("Session start time has not been initialized.")
                }

                await this.watchManager.send(this.encoder(DataType.WatchSessionEnd, this.sessionID, ""))
                await this.getWatchResponse(DataType.WatchSessionEnd)

                let watchSession = await this.getWatchResponse(DataType.WatchSession)

                let jsonTrackingRecords = JSON.parse(Buffer.from(watchSession.dataAsBase64, 'base64').toString('utf-8')) as any[]

                let trackingRecords = jsonTrackingRecords.map(jsonRecord => BaseTrackingRecord.parse(JSON.stringify(jsonRecord)))

                let watchTrackingSession = new BaseTrackingSession<BaseTrackingRecord>(
                    watchSession.id,
                    this.sessiontStartTimeInSeconds,
                    trackingRecords
                )
                
                this.clearSessionProperties()
                return resolve(watchTrackingSession)
            } catch (error) {
                this.logger.error(`${error}`)
                return reject(error)
            }
        })
    }

    private getWatchResponse(type: DataType): Promise<DataPacket> {
        this.logger.log("Waiting for response...")
        
        return new Promise(async (resolve, reject) => {
            if (!this.sessionID) {
                return reject("Session has not been started yet.")
            }
    
            let timer = setTimeout(() => {
                return reject("Couldn't receive a response from the watch in allocated time.")
            }, this.TIME_OUT_IN_SECONDS * 1000)
    
            let dataPacket = await this.watchManager.waitForData()
            clearTimeout(timer)
            this.logger.log("Response has been received.")
    
            if (dataPacket.dataType !== type) {
                return reject("Wrong data type has been sent from the watch.")
            }
    
            if (dataPacket.id.toLocaleLowerCase() !== this.sessionID.toLocaleLowerCase()) {
                return reject("Session IDs are not the same.")
            }
    
            return resolve(dataPacket)
        })
    }

    private encoder(type: DataType, id: string, content: any) : DataPacket {
        return new DataPacket(type, id, JSON.stringify(content))
    }
}