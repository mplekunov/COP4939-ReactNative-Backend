import { Coordinate } from "../Units/coordinate";
import { Measurement } from "../Units/unit";
import { UnitSpeed } from "../Units/unitSpeed";

export class LocationRecord {
    speed: Measurement<UnitSpeed>
    coordinate: Coordinate

    constructor(speed: Measurement<UnitSpeed>, coordinate: Coordinate) {
        this.speed = speed
        this.coordinate = coordinate
    }
}