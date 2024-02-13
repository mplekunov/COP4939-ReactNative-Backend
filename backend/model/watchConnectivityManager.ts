import { getFileTransfers, getIsPaired, getIsWatchAppInstalled, getReachability, sendMessage, sendMessageData, startFileTransfer, watchEvents } from "react-native-watch-connectivity";
import { LoggerService } from "../logger/LoggerService";
import { FileSystem } from "../fileSystem/fileSystem";
import { DataPacket } from "./data/watch/dataPacket";
import { Buffer } from 'buffer';
import uuid from 'react-native-uuid';

interface CallbackPair {
    resolve: (data: DataPacket) => void;
    reject: (error: any) => void;
}

export class WatchConnectivityManager {
    private readonly logger: LoggerService = new LoggerService("WatchConnectivityManager")
    private readonly FILE_EXTENSION = "json"

    private onDataReceivedCallbacks: CallbackPair[] = []

    private static instance: WatchConnectivityManager | null = null

    public static getInstance(): WatchConnectivityManager {
        if (!WatchConnectivityManager.instance) {
            WatchConnectivityManager.instance = new WatchConnectivityManager()
        }

        return WatchConnectivityManager.instance
    }

    private constructor() {
        watchEvents.addListener('file-received', (files) => {
            files.forEach(async file => {
                try {
                    let data = DataPacket.parse(await FileSystem.read(file.url))
                    this.onDataReceivedCallbacks.forEach(callback => callback.resolve(data))  
                } catch (error) {
                    this.logger.error(`${error}`)
                    this.onDataReceivedCallbacks.forEach(callback => callback.reject(error))
                }
            })
        })
    }

    public waitForData(): Promise<DataPacket> {
        return new Promise((resolve, reject) => {
            this.onDataReceivedCallbacks.push({
                reject: reject,
                resolve: resolve
            })
        })
    }

    private async checkConnectionStatus() {
        let isReachable = await getReachability()
        let isPaired = await getIsPaired()
        let isInstalled = await getIsWatchAppInstalled()

        if (!isReachable) {
            throw Error('Watch is not reachable.')
        }

        if (!isPaired) {
            throw Error('Watch is not paired.')
        }

        if (!isInstalled) {
            throw Error('Watch is not installed.')
        }
    }

    public send(packet: DataPacket): Promise<void> {
        return new Promise(async (resolve, reject) => {
            this.logger.log('Starting file sending process...')

            await this.checkConnectionStatus()
    
            let id = uuid.v4()
    
            let path = `file://${FileSystem.getDocumentDir()}/${id}.${this.FILE_EXTENSION}`
    
            await FileSystem.write(path, JSON.stringify(packet))
    
            this.logger.log('Saved file at the file path')
    
            try {
                let fileTransferId = await startFileTransfer(path)
                let transferInfo = Object.entries(await getFileTransfers()).find(([id, _]) => id === fileTransferId)?.[1]
    
                if (transferInfo !== undefined && transferInfo.error) {
                    return reject(transferInfo.error)
                }
    
                this.logger.log('File has been sent')
                return resolve()
            } catch (error: any) {
                this.logger.error(`${error}`)
                return reject(error)
            }
        })
    }
}