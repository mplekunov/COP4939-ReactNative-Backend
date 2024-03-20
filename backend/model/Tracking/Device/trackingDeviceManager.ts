import { FileSystem } from "../../../FileSystem/fileSystem";
import { LoggerService } from "../../../Logger/loggerService";
import { ContentType, Extension, File } from "../../File/file";

export class TrackingDeviceManager {
    private readonly logger = new LoggerService("TrackingDeviceManager")
    private static ubxDemoFileName = "rawData.ubx";

    public async start(): Promise<void> {
        this.logger.log("Session has been started.")

        // Send command to the device to start recording
    }

    public async stop(): Promise<File> {
        this.logger.log("Session has been stopped.")
        // Send command to the device to stop recording

        console.log()
        return new Promise((resolve, _) => {
            return resolve({
                name: TrackingDeviceManager.ubxDemoFileName,
                url: FileSystem.getMainBundleDir() + TrackingDeviceManager.ubxDemoFileName,
                type: ContentType.OTHER,
                extension: Extension.OTHER
            })
        })
    }
}