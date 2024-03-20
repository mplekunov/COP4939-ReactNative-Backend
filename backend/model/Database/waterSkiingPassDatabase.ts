import { ServerResponse } from "../Network/server"
import { ProcessablePassConverter, ProcessablePass } from "../WaterSkiing/Processing/pass"
import { MongoDBHelper } from "./database"

export class WaterSkiingPassDatabase extends MongoDBHelper{
    private static CREATE_FUNCTION = "createWaterSkiingPass"
    private static READ_FUNCTION = "readWaterSkiingPass"
    private static READ_ALL_FUNCTION = "readAllWaterSkiingPasses"
    private static UPDATE_FUNCTION = "updateWaterSkiingPass"
    private static DELETE_FUNCTION = "deleteWaterSkiingPass"

    private static converter = new ProcessablePassConverter()

    constructor(app: Realm.App) {
        super(app)
    }

    public async create(sessionId: string, object: ProcessablePass): Promise<ServerResponse<ProcessablePass, string>> {
        return await this.makeRequest<ProcessablePass, ProcessablePass>(
            WaterSkiingPassDatabase.CREATE_FUNCTION, 
            [sessionId, object],
            WaterSkiingPassDatabase.converter,
            WaterSkiingPassDatabase.converter
        )
    }

    public async readAll(sessionId: string, pageNumber: number, pageSize: number): Promise<ServerResponse<Array<ProcessablePass>, string>> {
        return await await this.makeRequest<ProcessablePass, any>(
            WaterSkiingPassDatabase.READ_ALL_FUNCTION, 
            [sessionId, pageNumber, pageSize],
            WaterSkiingPassDatabase.converter,
            WaterSkiingPassDatabase.converter
        )
    }

    public async read(id: string): Promise<ServerResponse<ProcessablePass, string>> {
        return await this.makeRequest<ProcessablePass, ProcessablePass>(
            WaterSkiingPassDatabase.READ_FUNCTION, 
            [id],
            WaterSkiingPassDatabase.converter,
            WaterSkiingPassDatabase.converter
        )
    }

    public async update(id: string, object: Partial<ProcessablePass>): Promise<ServerResponse<ProcessablePass, string>> {
        return await this.makeRequest<ProcessablePass, ProcessablePass>(
            WaterSkiingPassDatabase.UPDATE_FUNCTION, 
            [id, object],
            WaterSkiingPassDatabase.converter,
            WaterSkiingPassDatabase.converter
        )
    }

    public async delete(id: string): Promise<ServerResponse<null, string>> {
        return await this.makeRequest(
            WaterSkiingPassDatabase.DELETE_FUNCTION, 
            [id]
        )
    }
}