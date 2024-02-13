import { LoggerService } from "../../logger/LoggerService";
import { FFmpegKit, FFmpegKitConfig, ReturnCode } from "ffmpeg-kit-react-native";

export class VideoManager {
    private logger: LoggerService

    constructor() {
        this.logger = new LoggerService(typeof(this))
    }

    async trimVideo(source: string, to: string, startTime: number, endTime: number) : Promise<Boolean> {
        return await FFmpegKit.execute(`-i ${source.toString()} -ss ${startTime} -to ${endTime} -c copy ${to.toString()}`)
        .then(async session => {
            const state = FFmpegKitConfig.sessionStateToString(
                await session.getState(),
              )
              
              const returnCode = await session.getReturnCode()
        
              if (ReturnCode.isSuccess(returnCode)) {
                return true
              } else if (ReturnCode.isCancel(returnCode)) {
                throw new Error('Encode canceled')
              } else {
                  throw new Error(`Trimming failed with state ${state} and rc ${returnCode}`)
              }
        })
    }
}