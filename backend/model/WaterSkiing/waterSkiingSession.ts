import { Converter } from "../Database/database";
import { Location, LocationConverter } from "../Location/location";
import { ActivitySession } from "../Session/activitySession";
import { Boat } from "./Boat/boat";
import { Driver } from "./Boat/driver";

export interface WaterSkiingSession extends ActivitySession {
    boat: Boat
    driver: Driver
}

export class WaterSkiingSessionConverter implements Converter<WaterSkiingSession> {
    private locationConverter = new LocationConverter()

    convertToSchema(waterSkiingSession: WaterSkiingSession) : any {
        return {
            id: waterSkiingSession.id,
            location: this.locationConverter.convertToSchema(waterSkiingSession.location),
            date: waterSkiingSession.date,
            boat: waterSkiingSession.boat.convertToSchema(),
            driver: waterSkiingSession.driver.convertToSchema()
        }
    }

    convertFromSchema(schema: any): WaterSkiingSession {
        try {
            return {
                id: String(schema.id),
                location: this.locationConverter.convertFromSchema(schema.location),
                date: new Date(schema.date),
                boat: Boat.convertFromSchema(schema.boat),
                driver: Driver.convertFromSchema(schema.driver)
            }
        } catch(error: any) {
            console.log(error)
            throw new Error(`WaterSkiingSession ~ ${error.message}`)
        }
    }
}