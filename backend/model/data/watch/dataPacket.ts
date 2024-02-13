export enum DataType {
    WatchSessionStart,
    WatchSessionEnd,
    WatchSession,
    DataDeliveryInformation,
    WatchConnectivityError
}

export interface IDataPacket {
    dataType: DataType
    id: string
    dataAsBase64: string
}

export class DataPacket implements IDataPacket {
    readonly dataType: DataType
    readonly id: string
    readonly dataAsBase64: string

    constructor(type: DataType, id: string, dataAsBase64: string) {
        this.dataType = type
        this.id = id
        this.dataAsBase64 = dataAsBase64
    }
}