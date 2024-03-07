export class Boat {
    readonly name: string
    readonly hullID: string

    constructor(name: string, hullID: string) {
        this.name = name
        this.hullID = hullID
    }

    convertToSchema(): any {
        return {
            name: this.name,
            hullID: this.hullID
        }
    }

    static convertFromSchema(schema: any): Boat {
        try {
            return new Boat(
                String(schema.name),
                String(schema.hullID)
            )
        } catch(error: any) {
            throw new Error(`Boat ~ ${error.message}`)
        }
    }
}