import { Camera } from "react-native-vision-camera"
import { Video } from "../Backend/Model/Camera/video"
import { Extension } from "../Backend/Model/File/file"

export async function getPermissions(onError: (error: any) => void) {
    try {
        if (Camera.getCameraPermissionStatus() === 'not-determined') {
            let status = await Camera.requestCameraPermission()
                
            if (status === 'denied') {
                onError('Camera permission has been denied.')
            }
        }
        
        if (Camera.getMicrophonePermissionStatus() === 'not-determined') {
            let status = await Camera.requestMicrophonePermission()

            if (status === 'denied') {
                onError('Microphone permission has been denied')
            }
        }
    } catch (error) {
        onError(error)
    }
}

export function startVideoRecording(camera: Camera, sessionID: string, onRecordFinish: (video: Video) => void, onError: (error: any) => void) {
    try {
        const creationDate = new Date();

        camera.startRecording({
            onRecordingFinished: (video) => onRecordFinish(
                {
                    id: sessionID, 
                    creationDate: creationDate, 
                    url: video.path, 
                    durationInMilliseconds: video.duration * 1000,
                    extension: Extension.MP4
                }
            ),
            onRecordingError: (error) => onError(error),
            videoBitRate: 'high',
            videoCodec: 'h264',
        })
    } catch (error) {
        onError(error)
    }
}

export async function stopVideoRecording(camera: Camera, onError: (error: any) => void) {
    try {
        await camera.stopRecording()
    } catch (error) {
        onError(error)
    }
}