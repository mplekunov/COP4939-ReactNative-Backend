import { Coordinate } from "../Units/coordinate"

export class Location {
    readonly name: string
    readonly position: Coordinate

    constructor(name: string, position: Coordinate) {
        this.name = name
        this.position = position
    }

    convertToSchema(): any {
        return {
            name: this.name,
            position: this.position.convertToSchema()
        }
    }

    static convertFromSchema(schema: any): Location {
        try {
            return new Location(
                String(schema.name),
                Coordinate.convertFromSchema(schema.position)
            )
        } catch(error: any) {
            throw new Error(`Location ~ ${error.message}`)
        }
    }
}