import { Measurement } from "./unit"
import { UnitAngle } from "./unitAngle"

export class Coordinate {
    latitude: Measurement<UnitAngle>
    longitude: Measurement<UnitAngle>

    constructor(latitude: Measurement<UnitAngle>, longitude: Measurement<UnitAngle>) {
        this.latitude = latitude
        this.longitude = longitude
    }
}