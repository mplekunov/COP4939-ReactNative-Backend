import { Location } from "../Location/location";
import { ActivitySession } from "../Session/activitySession";
import { Boat } from "./Boat/boat";
import { Driver } from "./Boat/driver";
import { Pass } from "./Course/pass";

export class WaterSkiingSession extends ActivitySession {
    readonly passes: Array<Pass>
    readonly boat: Boat
    readonly driver: Driver

    constructor(session: ActivitySession, passes : Array<Pass>, boat: Boat, driver: Driver) {
        super(session.id, session.location, session.date)
        this.passes = passes
        this.boat = boat
        this.driver = driver
    }

    convertToSchema() : any {
        return {
            id: this.id,
            location: this.location.convertToSchema(),
            date: this.date,
            passes: this.passes.map(pass => pass.convertToSchema()),
            boat: this.boat.convertToSchema(),
            driver: this.driver.convertToSchema()
        }
    }

    static convertFromSchema(schema: any): WaterSkiingSession {
        try {
            return new WaterSkiingSession(
                new ActivitySession(
                    String(schema.id),
                    Location.convertFromSchema(schema.location),
                    new Date(schema.date)
                ),
                (schema.passes as []).map(schema => Pass.convertFromSchema(schema)),
                Boat.convertFromSchema(schema.boat),
                Driver.convertFromSchema(schema.driver)
            )
        } catch(error: any) {
            throw new Error(`WaterSkiingSession ~ ${error.message}`)
        }
    }
}