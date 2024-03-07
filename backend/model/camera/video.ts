export class Video {
    readonly id: string
    readonly creationDate: Date
    readonly fileLocation: string
    readonly durationInMilliseconds: number

    constructor(id: string, creationDate: Date, fileLocation: string, durationInMilliseconds: number) {
        this.id = id
        this.creationDate = creationDate
        this.fileLocation = fileLocation
        this.durationInMilliseconds = durationInMilliseconds
    }

    convertToSchema(): any {
        return {
            id: this.id,
            creationDate: this.creationDate,
            fileLocation: this.fileLocation,
            durationInMilliseconds: this.durationInMilliseconds
        }
    }

    static convertFromSchema(schema: any) : Video {
        try {
            return new Video(
                schema.id,
                new Date(schema.creationDate),
                String(schema.fileLocation),
                parseInt(schema.durationInMilliseconds)
            )
        } catch(error: any) {
            throw new Error(`Video ~ ${error.message}`)
        }
    }
}