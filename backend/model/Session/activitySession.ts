import { Location } from "../Location/location"

export class ActivitySession {
    id: string
    location: Location
    date: Date

    constructor(id: string, location: Location, date: Date) {
        this.id = id
        this.location = location
        this.date = date
    }
}