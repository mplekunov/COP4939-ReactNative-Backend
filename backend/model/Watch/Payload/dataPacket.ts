export enum DataType {
    WatchSessionStart,
    WatchSessionEnd,
    WatchSession,
    DataDeliveryInformation,
    WatchConnectivityError
}

export class DataPacket {
    readonly dataType: DataType
    readonly id: string
    readonly dataAsBase64: string

    constructor(type: DataType, id: string, dataAsBase64: string) {
        this.dataType = type
        this.id = id
        this.dataAsBase64 = dataAsBase64
    }

    static parse(json: string): DataPacket {
        try {
            let anyJson = JSON.parse(json)

            return new DataPacket(
                anyJson.dataType as DataType,
                anyJson.id as string,
                anyJson.dataAsBase64 as string
            )
        } catch (error) {
            throw new Error(`DataPacket - ${error}`)
        }
    }
}