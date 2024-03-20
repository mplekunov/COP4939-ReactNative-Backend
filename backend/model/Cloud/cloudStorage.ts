import AWS from 'aws-sdk'
import { ServerCode, ServerResponse } from '../Network/server'
import { FileSystem } from '../../FileSystem/fileSystem'
import { Buffer } from "buffer"
import { ContentType, Extension, File } from '../File/file'

export class CloudStorage {    
    private static CONFIG = { 
        bucket_name: process.env.S3_BUCKET_NAME as string
    }

    private static BASE_CDN_URL = process.env.BASE_CDN_URL as string
    
    constructor() {
        AWS.config.update({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: process.env.AWS_REGION
        })
    }

    public async downloadObject(objectKey: string): Promise<ServerResponse<File, string>> {
        return new Promise(async (resolve, reject) => {
            let s3 = new AWS.S3()

            let request = {
                Bucket: CloudStorage.CONFIG.bucket_name,
                Key: objectKey,
            }

            try {
                let download = s3.getObject(request)
                let response = await download.promise()

                let url = `${FileSystem.getDocumentDir()}/${request.Key}}`

                await FileSystem.write(`${FileSystem.getDocumentDir()}/${request.Key}}`, response.Body?.toString()!)

                let extension = objectKey.split(".")[1].toLocaleLowerCase()
                let contentType = response.ContentType?.split("/")[0].toLocaleLowerCase()
                return resolve({
                    status: ServerCode.OK,
                    data: {
                        name: objectKey,
                        extension: extension !== undefined ? extension as Extension : Extension.OTHER,
                        type: contentType !== undefined ? contentType as ContentType : ContentType.OTHER,
                        url: url
                    }
                })
            } catch(error: any) {
                return resolve({
                    status: ServerCode.BadRequest,
                    error: error
                })
            }
        })
    }

    public async uploadObject(object: File, progressCallback: (progress: number) => void): Promise<ServerResponse<File, string>> {
        return new Promise(async (resolve, _) => {
            let s3 = new AWS.S3()

            try {
                let file = await FileSystem.read(object.url, 'base64')

                let upload = s3.upload({
                    Bucket: CloudStorage.CONFIG.bucket_name,
                    Key: `${object.name}.${object.extension}`,
                    Body: Buffer.from(file, 'base64'),
                    ContentType: `${object.type}/${object.extension}`
                })
            
                upload.on('httpUploadProgress', (progress: AWS.S3.ManagedUpload.Progress) => {
                    let progressInPercentage = progress.loaded * 100 / progress.total
                    let rounded = Math.round((progressInPercentage + Number.EPSILON) * 100) / 100
                    progressCallback(rounded)
                })

                let response = await upload.promise()

                object.url = `${CloudStorage.BASE_CDN_URL}/${response.Key}`

                return resolve({
                    status: ServerCode.OK,
                    data: object
                })
            } catch (error: any) {
                return resolve({
                    status: ServerCode.BadRequest,
                    error: error
                })
            }
        })
    }

    public async deleteObject(key: string): Promise<ServerResponse<null, string>> {
        return new Promise(async (resolve, _) => {
            let s3 = new AWS.S3()

            try {
                let request = s3.deleteObject({
                    Bucket: CloudStorage.CONFIG.bucket_name,
                    Key: key
                })

                let response = await request.promise()

                if (response.$response.httpResponse.statusCode >= 300) {
                    return resolve({
                        status: response.$response.httpResponse.statusCode,
                        error: response.$response.httpResponse.statusMessage
                    })
                }
            } catch (error: any) {
                return resolve({
                    status: ServerCode.BadRequest,
                    error: error
                })
            }
        })
    }
}