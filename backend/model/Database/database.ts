import { ServerCode, ServerResponse } from "../Server/authentication"
import { User } from "../User/user"

export interface Database<Type> {
    create(object: Type): Promise<ServerResponse<Type, string>>
    read(id: string): Promise<ServerResponse<Type, string>>
    update(id: string, object: Type): Promise<ServerResponse<Type, string>>
    delete(id: string): Promise<ServerResponse<Type, string>>
}

export class UserDatabase implements Database<User> {
    private app: Realm.App

    constructor(app: Realm.App) {
        this.app = app
    }

    create(object: User): Promise<ServerResponse<User, string>> {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await this.app.currentUser?.callFunction('createUser', object) as ServerResponse<User, string>
                return resolve(response)
            } catch(error: any) {
                return reject({
                    status: ServerCode.BadRequest,
                    error: error?.message ?? error
                })
            }
        })
    }

    read(id: string): Promise<ServerResponse<User, string>> {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await this.app.currentUser?.callFunction('getUser', id) as ServerResponse<User, string>
                return resolve(response)
            } catch(error: any) {
                return reject({
                    status: ServerCode.BadRequest,
                    error: error?.message ?? error
                })
            }
        })
    }

    update(id: string, object: User): Promise<ServerResponse<User, string>> {
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

    delete(id: string): Promise<ServerResponse<User, string>> {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await this.app.currentUser?.callFunction('deleteUser', id) as ServerResponse<User, string>
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