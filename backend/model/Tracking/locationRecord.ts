import { Coordinate } from "../Units/coordinate";

export class LocationRecord {
    coordinate: Coordinate

    constructor(coordinate: Coordinate) {
        this.coordinate = coordinate
    }

    convertToSchema() : any {
        return {
            coordinate: this.coordinate.convertToSchema()
        }
    }

    static convertFromSchema(schema: any) : LocationRecord {
        try {
            return new LocationRecord(Coordinate.convertFromSchema(schema.coordinate))
        } catch(error : any) {
            throw new Error(`Location Record ~ ${error.message}`)
        }
    }
}