import { ServerResponse } from "../Network/server"
import { WaterSkiingSession, WaterSkiingSessionConverter } from "../WaterSkiing/waterSkiingSession"
import { MongoDBHelper } from "./database"

export class WaterSkiingSessionDatabase extends MongoDBHelper {
    private static CREATE_FUNCTION = "createWaterSkiingSession"
    private static READ_FUNCTION = "readWaterSkiingSession"
    private static READ_ALL_FUNCTION = "readAllWaterSkiingSessions"
    private static READ_ALL_USER_FUNCTION = "readAllUserWaterSkiingSessions"
    private static UPDATE_FUNCTION = "updateWaterSkiingSession"
    private static DELETE_FUNCTION = "deleteWaterSkiingSession"

    private static converter = new WaterSkiingSessionConverter()

    constructor(app: Realm.App) {
        super(app)
    }

    public async create(object: WaterSkiingSession): Promise<ServerResponse<WaterSkiingSession, string>> {
        return await this.makeRequest(
            WaterSkiingSessionDatabase.CREATE_FUNCTION, 
            [object],
            WaterSkiingSessionDatabase.converter,
            WaterSkiingSessionDatabase.converter
        )
    }

    public async readAll(pageNumber: number, pageSize: number, username: string | null = null): Promise<ServerResponse<Array<WaterSkiingSession>, string>> {
        if (username !== null) {
            return await this.makeRequest<WaterSkiingSession, any>(
                WaterSkiingSessionDatabase.READ_ALL_USER_FUNCTION, 
                [username, pageNumber, pageSize],
                WaterSkiingSessionDatabase.converter,
                WaterSkiingSessionDatabase.converter
            )
        } else {
            return await this.makeRequest<WaterSkiingSession, any>(
                WaterSkiingSessionDatabase.READ_ALL_FUNCTION, 
                [pageNumber, pageSize],
                WaterSkiingSessionDatabase.converter,
                WaterSkiingSessionDatabase.converter
            )
        }
    }

    public async read(id: string): Promise<ServerResponse<WaterSkiingSession, string>> {
       return await this.makeRequest(
            WaterSkiingSessionDatabase.READ_FUNCTION, 
            [id],
            WaterSkiingSessionDatabase.converter,
            WaterSkiingSessionDatabase.converter
        )
    }

    public async update(id: string, object: Partial<WaterSkiingSession>): Promise<ServerResponse<WaterSkiingSession, string>> {
        return await this.makeRequest(
            WaterSkiingSessionDatabase.UPDATE_FUNCTION, 
            [id, object],
            WaterSkiingSessionDatabase.converter,
            WaterSkiingSessionDatabase.converter
        )
    }

    public async delete(id: string): Promise<ServerResponse<null, string>> {
        return await this.makeRequest(
            WaterSkiingSessionDatabase.DELETE_FUNCTION, 
            [id]
        )
    }
}