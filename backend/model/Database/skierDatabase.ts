import { ServerCode, ServerResponse } from "../Network/server"
import { TrackingSession } from "../Tracking/trackingSession"
import { Skier } from "../WaterSkiing/Skier/skier"
import { WaterSkiingSession } from "../WaterSkiing/waterSkiingSession"
import { UserDatabase } from "./userDatabase"
import { WaterSkiingSessionDatabase } from "./waterSkiingSessionDatabase"

export class SkierDatabase {
    private app: Realm.App

    constructor(app: Realm.App) {
        this.app = app
    }
    
    public create(object: Skier): Promise<ServerResponse<Skier, string>> {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await this.app.currentUser?.callFunction('createSkier', object.convertToSchema()) as any
                
                if (response.data !== undefined) {
                    response.data = Skier.convertFromSchema(response.data)
                }

                return resolve(response as ServerResponse<Skier, string>)
            } catch(error: any) {
                return reject({
                    status: ServerCode.BadRequest,
                    error: error?.message ?? error
                })
            }
        })
    }

    public read(id: string): Promise<ServerResponse<Skier, string>> {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await this.app.currentUser?.callFunction('readSkier', id) as any

                if (response.data !== undefined) {
                    response.data = Skier.convertFromSchema(response.data)
                }

                return resolve(response as ServerResponse<Skier, string>)
            } catch(error: any) {
                return reject({
                    status: ServerCode.BadRequest,
                    error: error?.message ?? error
                })
            }
        })
    }

    public update(id: string, object: Skier): Promise<ServerResponse<Skier, string>> {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await this.app.currentUser?.callFunction('updateSkier', id, object.convertToSchema()) as any

                if (response.data !== undefined) {
                    response.data = Skier.convertFromSchema(response.data)
                }

                return resolve(response as ServerResponse<Skier, string>)
            } catch(error: any) {
                return reject({
                    status: ServerCode.BadRequest,
                    error: error?.message ?? error
                })
            }
        })
    }

    public delete(id: string): Promise<ServerResponse<Skier, string>> {
        return new Promise(async (resolve, reject) => {
            try {
                let response = await this.app.currentUser?.callFunction('deleteSkier', id) as ServerResponse<Skier, string>
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