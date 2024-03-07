import { ServerCode, ServerResponse } from "../Network/server"
import { TrackingSession } from "../Tracking/trackingSession"
import { WaterSkiingSession } from "../WaterSkiing/waterSkiingSession"

export class WaterSkiingSessionDatabase {
    private app: Realm.App

    constructor(app: Realm.App) {
        this.app = app
    }

    public create(object: WaterSkiingSession): Promise<ServerResponse<WaterSkiingSession, string>> {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await this.app.currentUser?.callFunction('createWaterSkiingSession', object.convertToSchema()) as any
                
                if (response.data !== undefined) {
                    response.data = WaterSkiingSession.convertFromSchema(response.data)
                }

                return resolve(response as ServerResponse<WaterSkiingSession, string>)
            } catch(error: any) {
                return reject({
                    status: ServerCode.BadRequest,
                    error: error?.message ?? error
                })
            }
        })
    }

    public readAll(pageNumber: number, pageSize: number, username: string | null = null): Promise<ServerResponse<Array<WaterSkiingSession>, string>> {
        return new Promise(async (resolve, reject) => {
            try {
                let response : any; 
                if (username !== null) {
                    response = await this.app.currentUser?.callFunction('readAllUserWaterSkiingSessions', username, pageNumber, pageSize)
                } else {
                    response = await this.app.currentUser?.callFunction('readAllWaterSkiingSessions', pageNumber, pageSize)
                }

                if (response.data !== undefined && Array.isArray(response.data)) {
                    response.data = (response.data as []).map(schema => WaterSkiingSession.convertFromSchema(schema))
                }

                return resolve(response  as ServerResponse<Array<WaterSkiingSession>, string>)
            } catch(error: any) {
                return reject({
                    status: ServerCode.BadRequest,
                    error: error?.message ?? error
                })
            }
        })
    }

    public read(id: string): Promise<ServerResponse<WaterSkiingSession, string>> {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await this.app.currentUser?.callFunction('readWaterSkiingSession', id) as any

                if (response.data !== undefined) {
                    response.data = WaterSkiingSession.convertFromSchema(response.data)
                }

                return resolve(response as ServerResponse<WaterSkiingSession, string>)
            } catch(error: any) {
                return reject({
                    status: ServerCode.BadRequest,
                    error: error?.message ?? error
                })
            }
        })
    }

    public update(id: string, object: WaterSkiingSession): Promise<ServerResponse<WaterSkiingSession, string>> {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await this.app.currentUser?.callFunction('updateWaterSkiingSession', id, object.convertToSchema()) as any

                if (response.data !== undefined) {
                    response.data = WaterSkiingSession.convertFromSchema(response.data)
                }

                return resolve(response as ServerResponse<WaterSkiingSession, string>)
            } catch(error: any) {
                return reject({
                    status: ServerCode.BadRequest,
                    error: error?.message ?? error
                })
            }
        })
    }

    public delete(id: string): Promise<ServerResponse<WaterSkiingSession, string>> {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await this.app.currentUser?.callFunction('deleteWaterSkiingSession', id) as ServerResponse<WaterSkiingSession, string>
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