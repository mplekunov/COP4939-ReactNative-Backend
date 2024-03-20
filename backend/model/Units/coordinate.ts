import { Converter } from "../Database/database"
import { Measurement } from "./unit"
import { UnitAngle } from "./unitAngle"

export interface Coordinate {
    latitude: Measurement<UnitAngle>
    longitude: Measurement<UnitAngle>
}

export class CoordinateConverter implements Converter<Coordinate> {
    convertToSchema(coordinate: Coordinate) : any {
        return {
            latitude: coordinate.latitude.convertToSchema(),
            longitude: coordinate.longitude.convertToSchema()
        }
    }

    convertFromSchema(schema: any) : Coordinate {
        try {
            return {
                latitude: new Measurement(parseFloat(schema.latitude.value), UnitAngle.parse(schema.latitude.unit)),
                longitude: new Measurement(parseFloat(schema.longitude.value), UnitAngle.parse(schema.longitude.unit))
            }
        } catch(error : any) {
            throw new Error(`Coordinate ~ ${error.message}`)
        }
    }
}