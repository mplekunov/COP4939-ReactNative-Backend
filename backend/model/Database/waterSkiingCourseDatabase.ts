import { ServerResponse } from "../Network/server"
import { ProcessableWaterSkiingCourse, WaterSkiingCourseConverter } from "../WaterSkiing/Course/waterSkiingCourse"
import { MongoDBHelper } from "./database"

export class WaterSkiingCourseDatabase extends MongoDBHelper {
    private static CREATE_FUNCTION = "createWaterSkiingCourse"
    private static READ_ALL_FUNCTION = "readAllWaterSkiingCourses"
    private static READ_FUNCTION = "readWaterSkiingCourse"
    private static UPDATE_FUNCTION = "updateWaterSkiingCourse"
    private static DELETE_FUNCTION = "deleteWaterSkiingCourse"

    private static converter = new WaterSkiingCourseConverter()

    constructor(app: Realm.App) {
        super(app)
    }

    public async create(object: ProcessableWaterSkiingCourse): Promise<ServerResponse<ProcessableWaterSkiingCourse, string>> {
        return await this.makeRequest(
            WaterSkiingCourseDatabase.CREATE_FUNCTION, 
            [object],
            WaterSkiingCourseDatabase.converter,
            WaterSkiingCourseDatabase.converter
        )
    }

    public async readAll(pageNumber: number, pageSize: number): Promise<ServerResponse<Array<ProcessableWaterSkiingCourse>, string>> {
        return await this.makeRequest<ProcessableWaterSkiingCourse, any>(
            WaterSkiingCourseDatabase.READ_ALL_FUNCTION, 
            [pageNumber, pageSize],
            WaterSkiingCourseDatabase.converter,
            WaterSkiingCourseDatabase.converter
        )
    }

    public async read(id: string): Promise<ServerResponse<ProcessableWaterSkiingCourse, string>> {
        return await this.makeRequest(
            WaterSkiingCourseDatabase.READ_FUNCTION, 
            [id],
            WaterSkiingCourseDatabase.converter,
            WaterSkiingCourseDatabase.converter
        )
    }

    public async update(id: string, object: Partial<ProcessableWaterSkiingCourse>): Promise<ServerResponse<ProcessableWaterSkiingCourse, string>> {
        return await this.makeRequest(
            WaterSkiingCourseDatabase.UPDATE_FUNCTION, 
            [id, object],
            WaterSkiingCourseDatabase.converter,
            WaterSkiingCourseDatabase.converter
        )
    }

    public async delete(id: string): Promise<ServerResponse<null, string>> {
        return await this.makeRequest(
            WaterSkiingCourseDatabase.DELETE_FUNCTION, 
            [id]
        )
    }
}