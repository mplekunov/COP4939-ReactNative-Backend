import { useEffect, useRef, useState } from "react"
import { Video } from "../Backend/Model/Camera/video"
import { StyleSheet, Text, View } from "react-native"
import { LoggerService } from "../Backend/Logger/loggerService";
import { RecordButton } from "./RecordingButtonComponent";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import { BaseTrackingRecord } from "../Backend/Model/Data/Tracking/trackingRecord";
import { WatchTrackingSessionManager } from "../Backend/Model/watchTrackingSessionManager"
import { BaseTrackingSession, TrackingSession } from "../Backend/Model/Data/Tracking/trackingSession";
import { WaterSkiingPassProcessorForVideo } from "../Backend/Model/waterSkiingPassProcessorForVideo";
import { waterSkiingCourseGenerator } from "./testWaterSkiingCourseGenerator";
import { Pass } from "../Backend/Model/Data/WaterSkiing/Course/pass";
import { getPermissions, startVideoRecording, stopVideoRecording } from "./CameraComponents";

export const SessionRecording: React.FC = () => {
    const [watchSession, setWatchSession] = useState<BaseTrackingSession<BaseTrackingRecord>>()
    const [video, setVideo] = useState<Video<string>>()
    const [session, setSession] = useState<TrackingSession<BaseTrackingRecord, Video<string>>>()
    const [pass, setPass] = useState<Pass<number, Video<string>>>()
    const [isRecording, setIsRecording] = useState<boolean>(false)

    const camera = useRef<Camera>(null)
    
    const watchSessionManager = useRef(new WatchTrackingSessionManager())

    const logger = useRef(new LoggerService("SessionRecordingComponent"))

    getPermissions((error) => logger.current.error(`${error}`))

    useEffect(() => {
        logger.current.log(JSON.stringify(pass))
    }, [pass])

    useEffect(() => {
        if (!session) {
            return
        }

        logger.current.log("Session has been received...")

        let processor = new WaterSkiingPassProcessorForVideo()

        logger.current.log("Processing session to get Pass...")
        processor.process(waterSkiingCourseGenerator(session.video), 0, session)
            .then((pass) => setPass(pass))
            .catch((error) => logger.current.error(`${error}`))
    }, [session])

    useEffect(() => {
        if (!watchSession || !video) {
            return
        }

        if (watchSession.id.toLocaleLowerCase() === video.id.toLocaleLowerCase()) {
            setSession(new TrackingSession(watchSession, video))
        }
    }, [watchSession, video])

    const onRecordButtonPress = async () => {
        if (isRecording === undefined) {
            return 
        }
      
        if (!isRecording) {
            watchSessionManager.current.startSession()
            .then(() => {
                let sessionID = watchSessionManager.current.getSessionID()

                if (camera.current && sessionID) {
                    startVideoRecording(
                        camera.current,
                        sessionID,
                        (video: Video<string>) => setVideo(video),
                        (error: any) => logger.current.error(`${error}`)
                    )

                    setIsRecording(true)
                }
            })
            .catch(error => logger.current.error(`${error}`))
        } else {
            watchSessionManager.current.stopSession()
            .then(async (watchSession: BaseTrackingSession<BaseTrackingRecord>) => {
                if (camera.current) {
                    await stopVideoRecording(camera.current, (error: any) => logger.current.error(`${error}`))
                    setWatchSession(watchSession)

                    setIsRecording(false)
                }
            })
            .catch(error => logger.current.error(`${error}`))
        }
    }

    return (
        <View>
            <Camera 
                ref={camera}
                isActive={true}
                audio={true}
                video={true}
                style={styles.camera}
                device={useCameraDevice('back')!}
            />
            <RecordButton  onPress={() => onRecordButtonPress()} isRecording={isRecording} style={styles.recordingButton}/>
        </View>
    )
}

const styles = StyleSheet.create({
    recordingButton: {
        position: 'relative',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems:'center'
    },
    camera: {
        position: 'relative',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems:'center',
        width: '100%',
        height: '100%'
      }
})