
import { Converter } from "../Database/database"
import { Extension } from "../File/file"

export interface Video {
    id: string
    creationDate: Date
    url: string
    durationInMilliseconds: number
    extension: Extension
}

export class VideoConverter implements Converter<Video> {
    convertToSchema(object: Video) {
        return {
            id: object.id,
            creationDate: object.creationDate,
            url: object.url,
            durationInMilliseconds: object.durationInMilliseconds,
            extension: object.extension
        }
    }
    convertFromSchema(schema: any): Video {
        try {
            return {
                id: schema.id,
                creationDate: new Date(schema.creationDate),
                url: String(schema.url),
                durationInMilliseconds: parseInt(schema.durationInMilliseconds),
                extension: schema.extension as Extension
            }
        } catch(error: any) {
            throw new Error(`Video ~ ${error.message}`)
        }
    }

}