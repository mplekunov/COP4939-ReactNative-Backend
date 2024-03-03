import { LoggerService } from "../../Logger/loggerService"
import { BaseTrackingRecord } from "../Tracking/trackingRecord"
import { DataPacket, DataType } from "./Payload/dataPacket"
import { WatchConnectivityManager } from "./Network/watchConnectivityManager"
import uuid from 'react-native-uuid';
import { Buffer } from 'buffer'
import { BaseTrackingSession } from "../Tracking/trackingSession";

export class WatchTrackingSessionManager {
    private readonly watchManager: WatchConnectivityManager = WatchConnectivityManager.getInstance()
    private readonly logger = new LoggerService("WatchSessionManager")

    private sessionID: string | null = null
    private sessionStartTimeInMilliseconds: number | null = null

    private readonly TIME_OUT_IN_SECONDS = 30

    public getSessionID() : string | null {
        return this.sessionID
    }

    private clearSessionProperties() {
        this.sessionID = null
        this.sessionStartTimeInMilliseconds = null
    }

    public startSession(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            this.logger.log("Starting Session...")
            this.clearSessionProperties()

            try {
                this.sessionID = uuid.v4().toString()
                this.sessionStartTimeInMilliseconds = Date.now()

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
        return new Promise(async (resolve, reject) => {
            this.logger.log("Ending Session...")

            try {
                if (!this.sessionID) {
                    return reject("Session has not been started yet.")
                }

                if (!this.sessionStartTimeInMilliseconds) {
                    return reject("Session start time has not been initialized.")
                }

                await this.watchManager.send(this.encoder(DataType.WatchSessionEnd, this.sessionID, ""))
                await this.getWatchResponse(DataType.WatchSessionEnd)

                let watchSession = await this.getWatchResponse(DataType.WatchSession)

                let jsonTrackingRecords = JSON.parse(Buffer.from(watchSession.dataAsBase64, 'base64').toString('utf-8')) as any[]

                let trackingRecords = jsonTrackingRecords.map(jsonRecord => BaseTrackingRecord.parse(JSON.stringify(jsonRecord)))

                let watchTrackingSession = new BaseTrackingSession<BaseTrackingRecord>(
                    watchSession.id,
                    this.sessionStartTimeInMilliseconds,
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
        return new Promise(async (resolve, reject) => {
            this.logger.log("Waiting for response...")

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