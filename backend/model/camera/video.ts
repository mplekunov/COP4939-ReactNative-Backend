export class Video<Location> {
    readonly id: string
    readonly creationDate: Date
    readonly fileLocation: Location
    readonly durationInMilliseconds: number

    constructor(id: string, creationDate: Date, fileLocation: Location, durationInMilliseconds: number) {
        this.id = id
        this.creationDate = creationDate
        this.fileLocation = fileLocation
        this.durationInMilliseconds = durationInMilliseconds
    }
}