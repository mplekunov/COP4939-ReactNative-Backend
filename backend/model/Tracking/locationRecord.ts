import { Coordinate } from "../Units/coordinate";

export class LocationRecord {
    coordinate: Coordinate

    constructor(coordinate: Coordinate) {
        this.coordinate = coordinate
    }
}