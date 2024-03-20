import RNFS from 'react-native-fs'

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

    public static getDocumentDir() : string | null {
        return RNFS.DocumentDirectoryPath
    }

    public static getMainBundleDir(): string | null {
        return RNFS.MainBundlePath
    }

    public static getCacheDir() : string | null {
        return RNFS.CachesDirectoryPath
    }
}