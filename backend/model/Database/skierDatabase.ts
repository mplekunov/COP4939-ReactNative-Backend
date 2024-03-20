import { ServerResponse } from "../Network/server"
import { Skier, SkierConverter } from "../WaterSkiing/Skier/skier"
import { MongoDBHelper } from "./database"

export class SkierDatabase extends MongoDBHelper {
    private static CREATE_FUNCTION = "createSkier"
    private static READ_FUNCTION = "readSkier"
    private static UPDATE_FUNCTION = "updateSkier"
    private static DELETE_FUNCTION = "deleteSkier"

    private static converter = new SkierConverter()

    constructor(app: Realm.App) {
        super(app)
    }
    
    public async create(object: Skier): Promise<ServerResponse<Skier, string>> {
        return await this.makeRequest(
            SkierDatabase.CREATE_FUNCTION, 
            [object],
            SkierDatabase.converter,
            SkierDatabase.converter
        )
    }

    public async read(id: string): Promise<ServerResponse<Skier, string>> {
        return await this.makeRequest(
            SkierDatabase.READ_FUNCTION, 
            [id],
            SkierDatabase.converter,
            SkierDatabase.converter
        )
    }

    public async update(id: string, object: Partial<Skier>): Promise<ServerResponse<Skier, string>> {
        return await this.makeRequest(
            SkierDatabase.UPDATE_FUNCTION, 
            [id, object],
            SkierDatabase.converter,
            SkierDatabase.converter
        )
    }

    public async delete(id: string): Promise<ServerResponse<null, string>> {
        return await this.makeRequest(
            SkierDatabase.DELETE_FUNCTION, 
            [id]
        )
    }
}