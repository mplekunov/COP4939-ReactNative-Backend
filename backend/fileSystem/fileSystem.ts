import RNFS from 'react-native-fs'

export interface File {
    name?: string,
    path: string,
    size: number
}


export class FileSystem {
    public static async read(fromUri: string, encodingOptions?: any) : Promise<string> {
        return await RNFS.readFile(fromUri, encodingOptions)
    }

    public static async write(toUri: string, content: string) : Promise<void> {
        return await RNFS.writeFile(toUri, content)
    }

    public static async readAsChunk(fromUri: string, start: number, end: number): Promise<string> {
        return await RNFS.read(fromUri, end - start, start, 'base64')
    }

    public static async getFileStats(fromUri: string): Promise<File> {
        let result = await RNFS.stat(fromUri)

        return {
            name: result.name,
            path: result.path,
            size: result.size
        }
    }

    public static getDocumentDir() : string | null {
        return RNFS.DocumentDirectoryPath
    }

    public static getCacheDir() : string | null {
        return RNFS.CachesDirectoryPath
    }
}