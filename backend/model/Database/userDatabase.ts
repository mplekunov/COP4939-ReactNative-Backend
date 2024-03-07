import { ServerCode, ServerResponse } from "../Network/server"
import { User } from "../User/user"

export class UserDatabase {
    private app: Realm.App

    constructor(app: Realm.App) {
        this.app = app
    }

    public create(user: User): Promise<ServerResponse<User, string>> {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await this.app.currentUser?.callFunction('createUser', user) as ServerResponse<User, string>
                return resolve(response)
            } catch(error: any) {
                return reject({
                    status: ServerCode.BadRequest,
                    error: error?.message ?? error
                })
            }
        })
    }

    public read(username: string): Promise<ServerResponse<User, string>> {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await this.app.currentUser?.callFunction('getUser', username) as ServerResponse<User, string>
                return resolve(response)
            } catch(error: any) {
                return reject({
                    status: ServerCode.BadRequest,
                    error: error?.message ?? error
                })
            }
        })
    }

    public update(id: string, object: User): Promise<ServerResponse<User, string>> {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await this.app.currentUser?.callFunction('updateUser', id, object) as ServerResponse<User, string>
                return resolve(response)
            } catch(error: any) {
                return reject({
                    status: ServerCode.BadRequest,
                    error: error?.message ?? error
                })
            }
        })
    }

    public delete(username: string): Promise<ServerResponse<User, string>> {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await this.app.currentUser?.callFunction('deleteUser', username) as ServerResponse<User, string>
                return resolve(response)
            } catch(error: any) {
                return reject({
                    status: ServerCode.BadRequest,
                    error: error?.message ?? error
                })
            }
        })
    }
}