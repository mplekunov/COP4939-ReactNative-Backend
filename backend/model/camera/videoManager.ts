import { LoggerService } from "../../logger/LoggerService";
import { FFmpegKit, FFmpegKitConfig, Level, ReturnCode } from "ffmpeg-kit-react-native";

export class VideoManager {
    private logger: LoggerService = new LoggerService("VideoManager")

    public trimVideo(source: string, to: string, startTime: number, endTime: number) : Promise<Boolean> {
        return new Promise(async (resolve, reject) => {
          FFmpegKitConfig.setLogLevel(Level.AV_LOG_QUIET)
        
          try {
            let session = await FFmpegKit.execute(`-i ${source.toString()} -ss ${startTime} -to ${endTime} -c copy ${to.toString()}`)

            let state = FFmpegKitConfig.sessionStateToString(await session.getState())
            
            let returnCode = await session.getReturnCode()
      
            if (ReturnCode.isSuccess(returnCode)) {
              return resolve(true)
            } else if (ReturnCode.isCancel(returnCode)) {
              return reject('Encode canceled')
            } else {
                return reject(`Trimming failed with state ${state} and rc ${returnCode}`)
            }
          } catch (error) {
            this.logger.error(`VideoManager - ${error}`)
            return reject(error)
          }
        })
    }
}