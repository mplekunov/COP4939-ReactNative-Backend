import RNFS from 'react-native-fs'

const { DocumentDirectoryPath } = RNFS

export class FileSystem {
    public static async read(fromUri: string) : Promise<string> {
        return await RNFS.readFile(fromUri)
    }

    public static async write(toUri: string, content: string) : Promise<void> {
        return await RNFS.writeFile(toUri, content)
    }

    public static getDocumentDir() : string | null {
        return RNFS.DocumentDirectoryPath
    }

    public static getCacheDir() : string | null {
        return RNFS.CachesDirectoryPath
    }
}