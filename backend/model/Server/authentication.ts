import axios from "axios"
import Realm from "realm"
import { Login, User } from "../User/user"

export enum ServerCode {
    OK = 200,
    CREATED = 201,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404
}

export interface ServerResponse<DataType, ErrorType> {
    status: ServerCode
    data?: DataType
    error?: ErrorType
}

export class Authentication {
    private readonly APP_SERVICE_APP_ID = "reactnativeapp-utclw"
    private readonly APP_SERVICE_BASE_URL = `https://us-east-1.aws.data.mongodb-api.com/app/${this.APP_SERVICE_APP_ID}/endpoint/`

    private static instance: Authentication

    public readonly app: Realm.App

    public static getInstance(): Authentication {
        if (!Authentication.instance) {
            Authentication.instance = new Authentication()
        }

        return Authentication.instance
    }

    private constructor() {
        this.app = new Realm.App(this.APP_SERVICE_APP_ID)
    }

    public logIn(login: Login): Promise<ServerResponse<Login, string>> {
        return new Promise(async (resolve, reject) => {
            if (login.username.length === 0 || login.password.length === 0) {
                return reject('All fields must contain information.')
            }
            try {
                let credentials = Realm.Credentials.function(login)
                return await this.app.logIn(credentials)
                    .then(user => {
                        resolve({
                            status: 200,
                            data: login
                        })
                    })
                    .catch(error => {
                        let response = JSON.parse(error.message).message
                        resolve(response as ServerResponse<Login, string>)
                    })
            } catch(error) {
                return reject(error)
            }
        })
    }

    public signUp(user: User): Promise<ServerResponse<User, string>> {
        return new Promise(async (resolve, reject) => {
            if (user.firstName.length === 0 || user.lastName.length === 0 || user.username.length === 0 || user.password.length === 0) {
                return reject('All fields must contain information.')
            }
        
            try {
                return await axios.post(this.APP_SERVICE_BASE_URL + "signup", user)
                    .then((response) => {
                        resolve(response.data as ServerResponse<User, string>)
                    })
                    .catch((error) => {
                        resolve(error.response.data as ServerResponse<User, string>)
                    })
            } catch(error) {
                return reject(error)
            }
        })
    }
}