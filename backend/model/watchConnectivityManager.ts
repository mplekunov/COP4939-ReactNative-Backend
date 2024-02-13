import { getFileTransfers, getIsPaired, getIsWatchAppInstalled, getReachability, sendMessage, sendMessageData, startFileTransfer, watchEvents } from "react-native-watch-connectivity";
import { LoggerService } from "../logger/LoggerService";
import { FileSystem } from "../fileSystem/fileSystem";
import { DataPacket, IDataPacket } from "./data/watch/dataPacket";
import { Buffer } from 'buffer'
import uuid from 'react-native-uuid';

export class WatchConnectivityManager {
    private readonly logger: LoggerService = new LoggerService("WatchConnectivityManager")
    private readonly FILE_EXTENSION = "json"

    private onDataReceivedCallbacks: ((value: DataPacket | PromiseLike<DataPacket>) => void)[] = []

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
                let data = JSON.parse(await FileSystem.read(file.url)) as IDataPacket
                this.onDataReceivedCallbacks.forEach(resolve => resolve(data))  
            })
        })
    }

    public waitForData(): Promise<DataPacket> {
        return new Promise((resolve) => {
            this.onDataReceivedCallbacks.push(resolve)
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

    public async sendAsFile(packet: DataPacket) {
        this.logger.log('Starting file sending process...')

        await this.checkConnectionStatus()

        let id = uuid.v4()

        let path = `file://${FileSystem.getDocumentDir()}/${id}.${this.FILE_EXTENSION}`

        this.logger.log(`Created file path is ${path}`)

        await FileSystem.write(path, JSON.stringify(packet))

        this.logger.log('Saved file at the file path')

        try {
            let fileTransferId = await startFileTransfer(path)
            let transferInfo = Object.entries(await getFileTransfers()).find(([id, _]) => id === fileTransferId)?.[1]

            if (transferInfo !== undefined && transferInfo.error) {
                throw transferInfo.error
            }

            this.logger.log('File has been sent')
        } catch (error: any) {
            this.logger.error(`${error}`)
            throw Error(error)
        }
    }

    public async sendAsMessage(content: string) {
        await this.checkConnectionStatus()

        let data = Buffer.from(content, 'utf-8').toString('base64')

        await sendMessageData(data)
        .then((encodedResponse) => {
            let response = Buffer.from(encodedResponse, 'base64').toString('utf-8')
            this.logger.log(response)
        })
        .catch((error) => {
            throw Error(error)
        })
    }
}