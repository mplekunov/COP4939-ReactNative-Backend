export class Video<Location> {
    readonly id: string
    readonly creationDate: Date
    readonly fileLocation: Location
    readonly duration: number

    constructor(id: string, creationDate: Date, fileLocation: Location, duration: number) {
        this.id = id
        this.creationDate = creationDate
        this.fileLocation = fileLocation
        this.duration = duration
    }
}