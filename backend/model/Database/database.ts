import { ServerCode, ServerResponse } from "../Network/server"

export interface Converter<T> {
    convertToSchema(object: Partial<T>): any
    convertFromSchema(schema: any): T
}

export interface MongoFunctions {
    getCreateFunctionName(): string
    getReadFunctionName(): string
    getUpdateFunctionName(): string
    getDeleteFunctionName(): string    
}

export class MongoDBHelper {
    private app: Realm.App

    constructor(app: Realm.App) {
        this.app = app
    }

    protected async makeRequest<RequestType, ResponseType>(
        functionName: string, 
        args: any[], 
        requestConverter?: Converter<RequestType>,
        responseConverter?: Converter<ResponseType>
    ): Promise<ServerResponse<ResponseType, string>> {
        return new Promise(async (resolve, reject) => {
            try {
                let preparedArgs: any[] = args

                if (requestConverter !== undefined) {
                    preparedArgs = this.convertRequest(args, requestConverter)
                }

                let response = await this.app.currentUser?.callFunction(functionName, preparedArgs) as any

                if (responseConverter !== undefined) {
                    return resolve(this.convertResponse(response, responseConverter))
                }

                return resolve(response as ServerResponse<ResponseType, string>)
            } catch(error: any) {
                return reject({
                    status: ServerCode.BadRequest,
                    error: error?.message ?? error
                })
            }
        })
    }

    private convertResponse<R>(response: any, converter: Converter<R>): ServerResponse<R, string> {
        if (response.data !== undefined) {
            if (Array.isArray(response.data)) {
                response.data = (response.data as []).map(data => converter.convertFromSchema(data))
            } else {
                response.data = converter.convertFromSchema(response.data)
            }
        }

        return response as ServerResponse<R, string>
    }

    private convertRequest<R>(args: any[], converter: Converter<R>): any[] {
        let convertedArgs: any[] = []

        for (let arg of args) {
            let convertedArg: any
            if (typeof arg === 'object') {
                convertedArg = converter.convertToSchema(arg)
            } else {
                convertedArg = arg
            }

            convertedArgs.push(convertedArg)
        }

        return convertedArgs
    }
}