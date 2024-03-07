import { Measurement } from "./unit"
import { UnitAngle } from "./unitAngle"

export class Coordinate {
    latitude: Measurement<UnitAngle>
    longitude: Measurement<UnitAngle>

    constructor(latitude: Measurement<UnitAngle>, longitude: Measurement<UnitAngle>) {
        this.latitude = latitude
        this.longitude = longitude
    }

    convertToSchema() : any {
        return {
            latitude: this.latitude.convertToSchema(),
            longitude: this.longitude.convertToSchema()
        }
    }

    static convertFromSchema(schema: any) : Coordinate {
        try {
            return new Coordinate(
                new Measurement(parseFloat(schema.latitude.value), UnitAngle.parse(schema.latitude.unit)),
                new Measurement(parseFloat(schema.longitude.value), UnitAngle.parse(schema.longitude.unit))
            )
        } catch(error : any) {
            throw new Error(`Coordinate ~ ${error.message}`)
        }
    }
}