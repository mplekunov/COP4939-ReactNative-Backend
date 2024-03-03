import { ActivitySession } from "../Session/activitySession";
import { Boat } from "./Boat/boat";
import { Driver } from "./Boat/driver";
import { Pass } from "./Course/pass";

export class WaterSkiingSession<CourseElementPositionType, VideoType> extends ActivitySession {
    readonly passes: Array<Pass<CourseElementPositionType, VideoType>>
    readonly boat: Boat
    readonly driver: Driver

    constructor(session: ActivitySession, passes : Array<Pass<CourseElementPositionType, VideoType>>, boat: Boat, driver: Driver) {
        super(session.id, session.location, session.date)
        this.passes = passes
        this.boat = boat
        this.driver = driver
    }
}