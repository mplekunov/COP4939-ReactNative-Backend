import { Coordinate } from "../Units/coordinate"

export class Location {
    readonly name: string
    readonly coordinate: Coordinate

    constructor(name: string, coordinate: Coordinate) {
        this.name = name
        this.coordinate = coordinate
    }
}