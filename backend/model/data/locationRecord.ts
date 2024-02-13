import { Coordinate } from "./units/coordinate";
import { Measurement } from "./units/unit";
import { UnitSpeed } from "./units/unitSpeed";

export class LocationRecord {
    speed: Measurement<UnitSpeed>
    coordinate: Coordinate

    constructor(speed: Measurement<UnitSpeed>, coordinate: Coordinate) {
        this.speed = speed
        this.coordinate = coordinate
    }
}