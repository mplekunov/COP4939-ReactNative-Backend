import { LoggerService } from "../../../Logger/loggerService";
import { ContentType, Extension, File } from "../../File/file";

export class TrackingDeviceManager {
    private readonly logger = new LoggerService("TrackingSessionManager")

    public async start(): Promise<void> {
        this.logger.log("Session has been started.")

        // Send command to the device to start recording
    }

    public async stop(): Promise<File> {
        this.logger.log("Session has been stopped.")
        // Send command to the device to stop recording

        return new Promise((resolve, _) => {
            return resolve({
                name: "data",
                location: "location",
                type: ContentType.OTHER,
                extension: Extension.OTHER
            })
        })
    }
}