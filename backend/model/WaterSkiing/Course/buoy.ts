import { Converter } from "../../Database/database";
import { Coordinate, CoordinateConverter } from "../../Units/coordinate";
import { Measurement } from "../../Units/unit";
import { UnitAngle } from "../../Units/unitAngle";
import { UnitSpeed } from "../../Units/unitSpeed";

export interface Buoy {
    position: Coordinate
    maxSpeed: Measurement<UnitSpeed>
    maxRoll: Measurement<UnitAngle>
    maxPitch: Measurement<UnitAngle>
    date: Date
}

export class BuoyConverter implements Converter<Buoy> {
    private coordinateConverter = new CoordinateConverter()

    convertToSchema(object: Buoy) {
        return {
            position: this.coordinateConverter.convertToSchema(object.position),
            maxSpeed: object.maxSpeed.convertToSchema(),
            maxRoll: object.maxRoll.convertToSchema(),
            maxPitch: object.maxPitch.convertToSchema(),
            date: object.date
        }
    }

    convertFromSchema(schema: any): Buoy {
        try {
            return {
                position: this.coordinateConverter.convertFromSchema(schema.position),
                maxSpeed: new Measurement(parseFloat(schema.maxSpeed.value), UnitSpeed.parse(schema.maxSpeed.unit)),
                maxRoll: new Measurement(parseFloat(schema.maxRoll.value),UnitAngle.parse(schema.maxRoll.unit)),
                maxPitch: new Measurement(parseFloat(schema.maxPitch.value), UnitAngle.parse(schema.maxPitch.unit)),
                date: new Date(schema.date)
            }
        } catch(error: any) {
            throw new Error(`Buoy ~ ${error.message}`)
        }
    }
    
}