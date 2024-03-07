export class Driver {
    readonly name: String

    constructor(name: string) {
        this.name = name
    }

    convertToSchema(): any {
        return {
            name: this.name
        }
    }

    static convertFromSchema(schema: any): Driver {
        try {
            return new Driver(
                String(schema.name)
            )
        } catch(error: any) {
            throw new Error(`Driver ~ ${error.message}`)
        }
    }
}