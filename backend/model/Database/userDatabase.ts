import { ServerResponse } from "../Network/server"
import { User, UserConverter } from "../User/user"
import { MongoDBHelper } from "./database"

export class UserDatabase extends MongoDBHelper {
    private static CREATE_FUNCTION = "createUser"
    private static READ_FUNCTION = "readUser"
    private static UPDATE_FUNCTION = "updateUser"
    private static DELETE_FUNCTION = "deleteUser"

    private static converter = new UserConverter()

    constructor(app: Realm.App) {
        super(app)
    }

    public async create(user: User): Promise<ServerResponse<User, string>> {
        return await this.makeRequest(
            UserDatabase.CREATE_FUNCTION, 
            [user],
            UserDatabase.converter,
            UserDatabase.converter
        )
    }

    public async read(username: string): Promise<ServerResponse<User, string>> {
        return await this.makeRequest(
            UserDatabase.READ_FUNCTION, 
            [username],
            UserDatabase.converter,
            UserDatabase.converter
        )
    }

    public async update(username: string, object: Partial<User>): Promise<ServerResponse<User, string>> {
        return await this.makeRequest(
            UserDatabase.UPDATE_FUNCTION, 
            [username, object],
            UserDatabase.converter,
            UserDatabase.converter
        )
    }

    public async delete(username: string): Promise<ServerResponse<null, string>> {
        return await this.makeRequest(
            UserDatabase.DELETE_FUNCTION, 
            [username]
        )
    }
}