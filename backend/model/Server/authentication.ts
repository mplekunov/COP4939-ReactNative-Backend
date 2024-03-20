import axios from "axios"
import Realm from "realm"
import { Login, User } from "../User/user"
import { ServerCode, ServerResponse } from "../Network/server"

export class Authentication {
    private static SIGNUP_FUNCTION = "signup"
    private static readonly APP_SERVICE_APP_ID = process.env.MONGODB_APP_SERVICE_APP_ID as string
    private static readonly APP_SERVICE_BASE_URL = `${process.env.MONGODB_APP_SERVICE_BASE_URL}/app/${this.APP_SERVICE_APP_ID}/endpoint/`

    private static instance: Authentication

    public readonly app: Realm.App

    public static getInstance(): Authentication {
        if (!Authentication.instance) {
            Authentication.instance = new Authentication()
        }

        return Authentication.instance
    }

    private constructor() {
        this.app = new Realm.App(Authentication.APP_SERVICE_APP_ID)
    }

    public logIn(login: Login): Promise<ServerResponse<Login, string>> {
        return new Promise(async (resolve, reject) => {
            if (login.username.length === 0 || login.password.length === 0) {
                return reject('All fields must contain information.')
            }
            
            try {
                let credentials = Realm.Credentials.function(login)
                let user = await this.app.logIn(credentials)
                await user.refreshCustomData()

                return resolve({
                    status: ServerCode.OK,
                    data: login
                })
            } catch(error: any) {
                if (error.response?.data?.status !== undefined) {
                    return resolve(error.response.data as ServerResponse<User, string>)
                }

                if (typeof error.message === 'string') {
                    return resolve({
                        status: ServerCode.BadRequest,
                        error: error?.message
                    })    
                }

                let response = JSON.parse(error.message)
                return resolve({
                    status: response.status?.$numberLong ?? ServerCode.BadRequest,
                    error: response?.error ?? response?.message
                })
            }
        })
    }

    public signUp(user: User): Promise<ServerResponse<User, string>> {
        return new Promise(async (resolve, reject) => {
            if (user.firstName.length === 0 || user.lastName.length === 0 || user.username.length === 0 || user.password.length === 0) {
                return reject('All fields must contain information.')
            }
        
            try {
                let response = (await axios.post(Authentication.APP_SERVICE_BASE_URL + Authentication.SIGNUP_FUNCTION, user)).data as ServerResponse<User, string>
                return resolve(response)
            } catch(error: any) {
                if (error.response?.data?.status !== undefined) {
                    return resolve(error.response.data as ServerResponse<User, string>)
                }

                if (typeof error.message === 'string') {
                    return resolve({
                        status: ServerCode.BadRequest,
                        error: error?.message
                    })    
                }
                
                let response = JSON.parse(error.message)
                return resolve({
                    status: response.status?.$numberLong ?? ServerCode.BadRequest,
                    error: response?.error ?? response?.message
                })
            }
        })
    }
}