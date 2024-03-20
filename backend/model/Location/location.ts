import { Converter } from "../Database/database"
import { Coordinate, CoordinateConverter } from "../Units/coordinate"

export interface Location {
    name: string
    position: Coordinate
}

export class LocationConverter implements Converter<Location> {
    private converter = new CoordinateConverter()

    convertToSchema(object: Location) {
        return {
            name: object.name,
            position: this.converter.convertToSchema(object.position)
        }
    }

    convertFromSchema(schema: any): Location {
        try {
            return {
                name: String(schema.name),
                position: this.converter.convertFromSchema(schema.position)
            }
        } catch(error: any) {
            throw new Error(`Location ~ ${error.message}`)
        }   
    }
}