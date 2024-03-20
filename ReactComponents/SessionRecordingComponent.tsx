import { useEffect, useRef, useState } from "react"
import { Video } from "../Backend/Model/Camera/video"
import { StyleSheet, View } from "react-native"
import { LoggerService } from "../Backend/Logger/loggerService";
import { RecordButton } from "./RecordingButtonComponent";
import { Camera, useCameraDevice } from "react-native-vision-camera";
import { TrackingRecord } from "../Backend/Model/Tracking/trackingRecord";
import { TrackingSession } from "../Backend/Model/Tracking/trackingSession";
import { Pass } from "../Backend/Model/WaterSkiing/Processing/pass";
import { getPermissions, startVideoRecording, stopVideoRecording } from "./CameraComponents";
import { WaterSkiingDataProcessor } from "../Backend/Model/WaterSkiing/Processing/waterSkiingPassProcessor";
import { TrackingDeviceManager } from "../Backend/Model/Tracking/Device/trackingDeviceManager";
import { ObjectId } from 'bson';
import { ContentType, File } from "../Backend/Model/File/file";
import { TrackingDataProcessor } from "../Backend/Model/Tracking/Processing/trackingProcessor";
import { WaterSkiingSessionDatabase } from "../Backend/Model/Database/waterSkiingSessionDatabase";
import { CloudStorage } from "../Backend/Model/Cloud/cloudStorage";
import { WaterSkiingPassDatabase } from "../Backend/Model/Database/waterSkiingPassDatabase";

export const SessionRecording: React.FC = () => {
    const [rawNavFile, setRawNavFile] = useState<File>()
    const [trackingRecords, setTrackingRecords] = useState<Array<TrackingRecord>>()
    const [video, setVideo] = useState<Video>()
    const [session, setSession] = useState<TrackingSession>()
    const [pass, setPass] = useState<Pass>()
    const [isRecording, setIsRecording] = useState<boolean>(false)

    const camera = useRef<Camera>(null)
    
    const trackingDeviceManager = useRef(new TrackingDeviceManager())
    
    const trackingProcessor = useRef(new TrackingDataProcessor())

    const logger = useRef(new LoggerService("SessionRecordingComponent"))

    getPermissions((error) => logger.current.error(`${error}`))

    // Before we start recording we should either have an ID of the current WaterSkiingSession or
    // Create a new WaterSkiingSession and save it in MongoDB

    // Start of the Recording
    const onRecordButtonPress = async () => {
        if (isRecording === undefined) {
            return 
        }
      
        if (!isRecording) {
            // Start Tracking Device Recording
            trackingDeviceManager.current.start()
            .then(() => {
                let sessionID = new ObjectId().toString()

                if (camera.current && sessionID) {
                    // Start Video Recording
                    startVideoRecording(
                        camera.current,
                        sessionID,
                        (video: Video) => setVideo(video),
                        (error: any) => logger.current.error(`${error}`)
                    )

                    setIsRecording(true)
                }
            })
            .catch(error => logger.current.error(`${error}`))
        } else {
            // Stop Tracking Device Recording
            trackingDeviceManager.current.stop()
            .then(async (rawNavigationFile: File) => {
                if (camera.current) {
                    // Stop Video Recording
                    await stopVideoRecording(camera.current, (error: any) => logger.current.error(`${error}`))
                    setRawNavFile(rawNavigationFile)

                    setIsRecording(false)
                }
            })
            .catch(error => logger.current.error(`${error}`))
        }
    }

    // When rawNavFile has been received, process it to get TrackingRecord[]
    useEffect(() => {
        if (!rawNavFile) {
            return
        }

        // Process Raw Navigation File to get TrackingRecords
        trackingProcessor.current.createProcessingJob(rawNavFile)
        .then((id: string) => {
            trackingProcessor.current.getProcessedRecords(id, (trackingRecords: TrackingRecord[]) => setTrackingRecords(trackingRecords))
        })
    }, [rawNavFile])

    // When Both Tracking Records and Video have been received, set TrackingSession
    useEffect(() => {
        if (!trackingRecords || !video) {
            return
        }

        setSession(new TrackingSession(new ObjectId().toString(), new Date(), trackingRecords, video))
    }, [trackingRecords, video])

    // When TrackingSession has been set, process Pass
    useEffect(() => {
        if (!session) {
            return
        }

        let processor = new WaterSkiingDataProcessor()

        // processor.process(), session)
        //     .then((pass) => setPass(pass))
        //     .catch((error) => logger.current.error(`${error}`))
    }, [session])

    // When Pass has been received
    useEffect(() => {
        if (pass === undefined) {
            return
        }
        // We can upload video to cloud storage
        let cloud = new CloudStorage()

        cloud.uploadObject({
            name: pass.video.id,
            url: pass.video.url,
            type: ContentType.VIDEO,
            extension: pass.video.extension
        }, (progress: number) => {
            // Progress of upload in percentage
        })
        .then((response) => {
            pass.video.url = response.data!.url
        })
        .catch((error) => logger.current.error(`${error}`))

        // Then we can upload Pass to MongoDB
        // let passDatabase = new WaterSkiingPassDatabase()
    }, [pass])

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