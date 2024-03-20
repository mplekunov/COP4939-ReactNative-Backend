/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useRef } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SessionRecording } from './SessionRecordingComponent';
import { Sex, User } from '../Backend/Model/User/user';
import { Person } from '../Backend/Model/Person/person';
import { Authentication } from '../Backend/Model/Server/authentication';
import { LoggerService } from '../Backend/Logger/loggerService';
import { UserDatabase } from '../Backend/Model/Database/userDatabase';
import { WaterSkiingSessionDatabase } from '../Backend/Model/Database/waterSkiingSessionDatabase';
import { TrackingSession } from '../Backend/Model/Tracking/trackingSession';
import { BSON, ObjectId } from 'bson';
import { TrackingRecord } from '../Backend/Model/Tracking/trackingRecord';
import { MotionRecord } from '../Backend/Model/Tracking/motionRecord';
import { Measurement } from '../Backend/Model/Units/unit';
import { UnitSpeed } from '../Backend/Model/Units/unitSpeed';
import { UnitLength } from '../Backend/Model/Units/unitLength';
import { UnitAcceleration } from '../Backend/Model/Units/unitAcceleration';
import { LocationRecord } from '../Backend/Model/Tracking/locationRecord';
import { Coordinate } from '../Backend/Model/Units/coordinate';
import { UnitAngle } from '../Backend/Model/Units/unitAngle';
import { Video } from '../Backend/Model/Camera/video';
import { WaterSkiingSession } from '../Backend/Model/WaterSkiing/waterSkiingSession';
import { ActivitySession } from '../Backend/Model/Session/activitySession';
import { Location } from '../Backend/Model/Location/location';
import { Pass, ProcessablePass } from '../Backend/Model/WaterSkiing/Processing/pass';
import { Gate } from '../Backend/Model/WaterSkiing/Course/gate';
import { Boat } from '../Backend/Model/WaterSkiing/Boat/boat';
import { Driver } from '../Backend/Model/WaterSkiing/Boat/driver';
import { WakeCross } from '../Backend/Model/WaterSkiing/Course/wakeCross';
import { Buoy } from '../Backend/Model/WaterSkiing/Course/buoy';
import { SkierDatabase } from '../Backend/Model/Database/skierDatabase';
import { Skier } from '../Backend/Model/WaterSkiing/Skier/skier';
import { WaterSkiingEquipment } from '../Backend/Model/WaterSkiing/Equipment/waterSkiingEquipment';
import { Fin } from '../Backend/Model/WaterSkiing/Equipment/fin';
import { Ski } from '../Backend/Model/WaterSkiing/Equipment/ski';
import { WaterSkiingAgeGroup } from '../Backend/Model/WaterSkiing/Skier/waterSkiingAgeGroup';
import { CloudStorage } from '../Backend/Model/Cloud/cloudStorage';
import { ContentType, Extension, File } from '../Backend/Model/File/file';
import { WaterSkiingPassDatabase } from '../Backend/Model/Database/waterSkiingPassDatabase';
import { ProcessableWaterSkiingCourse, ProcessingStatus } from '../Backend/Model/WaterSkiing/Course/waterSkiingCourse';
import { WaterSkiingCourseDatabase } from '../Backend/Model/Database/waterSkiingCourseDatabase';

/**
 * To Record Session:
 * 1. WaterSkiing Course setup
 * 2. WaterSkiing Recording Device
 * 3. Camera Feed
 * 
 * 1. Setup course map
 * 2. Start tracking recording
 * 3. Start Recording video
 * 4. Stop tracking recording
 * 5. Stop Recording video
 * 6. Process tracking info
 * 7. Parse tracking info (At this point we have Course + Tracking info + Raw Video)
 * 8. Use Course + Tracking info + Raw video in Algorithm for Pass processing
 * 9. Save WaterSkiingSession
 *  9.a. Save WaterSkiingSession to the MongoDB
 * 10. Save Pass
 *  10.a. Save Video to the Cloud => HTTPS link to the video
 *  10.b. Save Pass info + video metadata to the MongoDB
 */

/**
 * User Database CRUD operations example
 */
async function userCRUD(database: UserDatabase, user: User, newUser: User) {
  await database.create(user)
    .then((response) => console.log("CREATE: " + JSON.stringify(response)))
    .catch((response) => console.log("CREATE: " + JSON.stringify(response)))

  await database.read(user.username)
    .then((response) => console.log("READ: " + JSON.stringify(response)))
    .catch((response) => console.log("READ: " +JSON.stringify(response)))

  await database.update(user.username, newUser)
    .then((response) => console.log("UPDATE: " + JSON.stringify(response)))
    .catch((response) => console.log("UPDATE: " + JSON.stringify(response)))

  await database.delete(newUser.username)
    .then((response) => console.log("DELETE: " + JSON.stringify(response)))
    .catch((response) => console.log("DELETE: " + JSON.stringify(response)))
}

/**
 * Skier Database CRUD operations example
 */
async function skierCRUD(database: SkierDatabase, skier: Skier, newSkier: Skier) {
  await database.create(skier)
    .then((response) => console.log("CREATE: " + JSON.stringify(response)))
    .catch((response) => console.log("CREATE: " + JSON.stringify(response)))

  await database.read(skier.username)
    .then((response) => console.log("READ: " + JSON.stringify(response)))
    .catch((response) => console.log("READ: " +JSON.stringify(response)))

  await database.update(skier.username, newSkier)
    .then((response) => console.log("UPDATE: " + JSON.stringify(response)))
    .catch((response) => console.log("UPDATE: " + JSON.stringify(response)))

  await database.delete(skier.username)
    .then((response) => console.log("DELETE: " + JSON.stringify(response)))
    .catch((response) => console.log("DELETE: " + JSON.stringify(response)))
}

/**
 * WaterSkiingSession Database CRUD operations example
 */
async function waterSkiingSessionCRUD(database: WaterSkiingSessionDatabase, user: User, session: WaterSkiingSession) {
  await database.create(session)
    .then((response) => console.log("CREATE: " + JSON.stringify(response)))
    .catch((response) => console.log("CREATE: " + JSON.stringify(response)))

  await database.read(session.id)
    .then((response) => console.log("READ SPECIFIC: " + JSON.stringify(response)))
    .catch((response) => console.log("READ SPECIFIC: " + JSON.stringify(response)))

  await database.readAll(0, 100)
    .then((response) => console.log("READ ALL: " + JSON.stringify(response.data?.length)))
    .catch((response) => console.log("READ ALL: " + JSON.stringify(response)))

  await database.readAll(0, 100, user.username)
    .then((response) => console.log("READ ALL FOR USER: " + JSON.stringify(response.data?.length)))
    .catch((response) => console.log("READ ALL FOR USER: " + JSON.stringify(response)))

  await database.update(session.id, session)
    .then((response) => console.log("UPDATE: " + JSON.stringify(response)))
    .catch((response) => console.log("UPDATE: " + JSON.stringify(response)))

  // await database.delete(session.id)
  //   .then((response) => console.log("DELETE: " + JSON.stringify(response)))
  //   .catch((response) => console.log("DELETE: " + JSON.stringify(response)))
}

/**
 * WaterSkiingPass Database CRUD operations example
 */
async function waterSkiingPassCRUD(database: WaterSkiingPassDatabase, passes: ProcessablePass[], session: WaterSkiingSession) {
  for (let pass of passes) {
    await database.create(session.id, pass)
      .then((response) => console.log("CREATE: " + JSON.stringify(response)))
      .catch((response) => console.log("CREATE: " + JSON.stringify(response)))

    await database.read(pass.id!)
      .then((response) => console.log("READ SPECIFIC: " + JSON.stringify(response)))
      .catch((response) => console.log("READ SPECIFIC: " + JSON.stringify(response)))
  }

  await database.readAll(session.id, 0, 100)
    .then((response) => console.log("READ ALL: " + JSON.stringify(response.data?.length)))
    .catch((response) => console.log("READ ALL: " + JSON.stringify(response)))

  await database.update(passes[0].id!, passes[1])
    .then((response) => console.log("UPDATE: " + JSON.stringify(response)))
    .catch((response) => console.log("UPDATE: " + JSON.stringify(response)))

  await database.delete(passes[0].id!)
    .then((response) => console.log("DELETE: " + JSON.stringify(response)))
    .catch((response) => console.log("DELETE: " + JSON.stringify(response)))
}

/**
 * WaterSkiingCourse Database CRUD operations example
 */
async function waterSkiingCourseCRUD(database: WaterSkiingCourseDatabase, courses: ProcessableWaterSkiingCourse[]) {
  for (let course of courses) {
    await database.create(course)
      .then((response) => console.log("CREATE: " + JSON.stringify(response)))
      .catch((response) => console.log("CREATE: " + JSON.stringify(response)))

    await database.read(course.id)
      .then((response) => console.log("READ SPECIFIC: " + JSON.stringify(response)))
      .catch((response) => console.log("READ SPECIFIC: " + JSON.stringify(response)))
  }

  await database.readAll(0, 100)
    .then((response) => console.log("READ ALL: " + JSON.stringify(response.data?.length)))
    .catch((response) => console.log("READ ALL: " + JSON.stringify(response)))

  await database.update(courses[0].id, courses[1])
    .then((response) => console.log("UPDATE: " + JSON.stringify(response)))
    .catch((response) => console.log("UPDATE: " + JSON.stringify(response)))

  await database.delete(courses[0].id)
    .then((response) => console.log("DELETE: " + JSON.stringify(response)))
    .catch((response) => console.log("DELETE: " + JSON.stringify(response)))
}

/**
 * This is simply an example on how u can call Database/Cloud Storage interfaces
 */
function App(): React.JSX.Element {
  const logger = useRef(new LoggerService("SessionRecordingComponent"))

  const example = async () => {
    let date = new Date()
    date.setMonth(6)
    date.setDate(5)
    date.setFullYear(1998)

    let myUser: User = {
      firstName: "Michael", 
      lastName: "Plekunov", 
      dateOfBirth: date, 
      sex: Sex.MALE, 
      username: "mekromic", 
      password: "password"
    }

    let newUser: User = {
      firstName: "Michell", 
      lastName: "Plekunova", 
      dateOfBirth: date, 
      sex: Sex.FEMALE, 
      username: "mekromic1", 
      password: "password1"
    }

    let skier: Skier = {
      ...myUser,
      equipment: {
        fin: { 
          brand: "brand", 
          style: "style", 
          length: new Measurement(1, UnitLength.feet), 
          bindingType: "bindingType"
        },
        ski: {
          brand: "brand", 
          style: "style", 
          length: new Measurement(2, UnitLength.feet)
        }
      },
      ageGroup: WaterSkiingAgeGroup.JR_MEN
    }

    let newSkier: Skier = {
      ...skier
    }

    newSkier.username = "yeah"

    let session = {
      id: new BSON.ObjectId().toString(),
      location: {
        name: "Test Location", 
        position: {
          latitude: new Measurement(1, UnitAngle.degrees), 
          longitude: new Measurement(2, UnitAngle.degrees)
        },
      },
      date: new Date(),
      boat: new Boat("The Lucky one", "LuckyID"),
      driver: new Driver("Michael")
    }

    let passes: ProcessablePass[] = [
      {
        id: new ObjectId().toHexString(),
        date: new Date(),
        status: ProcessingStatus.Processing
      },
      {
        id: new ObjectId().toString(), 
        date: new Date(),
        status: ProcessingStatus.Processed,
        processedPass: {
          score: 1, 
          entryGate: {
            position: {
              longitude: new Measurement(1, UnitAngle.degrees), 
              latitude: new Measurement(2, UnitAngle.degrees)
            },
            maxSpeed: new Measurement(1, UnitSpeed.metersPerSecond),
            maxPitch: new Measurement(2, UnitAngle.degrees),
            maxRoll: new Measurement(1, UnitAngle.degrees),
            date: new Date()
        },
          exitGate: {
            position: {
              longitude: new Measurement(1, UnitAngle.degrees), 
              latitude: new Measurement(2, UnitAngle.degrees)
            },
            maxSpeed: new Measurement(1, UnitSpeed.metersPerSecond),
            maxPitch: new Measurement(2, UnitAngle.degrees),
            maxRoll: new Measurement(1, UnitAngle.degrees),
            date: new Date()
          },
          wakeCrosses: [
            {
              position: {
                longitude: new Measurement(1, UnitAngle.degrees), 
                latitude: new Measurement(2, UnitAngle.degrees),
              },
              maxSpeed: new Measurement(1, UnitSpeed.metersPerSecond),
              maxAngle: new Measurement(2, UnitAngle.degrees),
              maxPitch: new Measurement(3, UnitAngle.arcMinutes),
              maxRoll: new Measurement(4, UnitAngle.arcMinutes),
              maxAcceleration: new Measurement(5, UnitAcceleration.metersPersecondSquared),
              maxGForce: new Measurement(6, UnitAcceleration.metersPersecondSquared),
              date: new Date()
            }
          ],
          buoys: [
            {
              position: {
                longitude: new Measurement(1, UnitAngle.degrees), 
                latitude: new Measurement(2, UnitAngle.degrees)
              },
              maxSpeed: new Measurement(2, UnitSpeed.metersPerSecond),
              maxPitch: new Measurement(3, UnitAngle.degrees),
              maxRoll: new Measurement(5, UnitAngle.arcMinutes),
              date: new Date()
            }
          ],
          video: {
            id: new ObjectId().toString(),
            creationDate: new Date(),
            url: "www.example.com",
            durationInMilliseconds: 123,
            extension: Extension.MP4
          }
        }
      }
    ]

    let courses: ProcessableWaterSkiingCourse[] = [
      {
        id: new ObjectId().toString(),
        name: "UniqueName #1",
        status: ProcessingStatus.Processing,
        preProcessedCourse: {
          buoyPositions: [new Date(), new Date(), new Date(), new Date(), new Date(), new Date()],
          wakeCrossPositions: [new Date(), new Date(), new Date(), new Date(), new Date()],
          entryGatePosition: new Date(),
          exitGatePosition: new Date()
        }
      },
      {
        id: new ObjectId().toString(),
        name: "UniqueName #2",
        status: ProcessingStatus.Processed,
        preProcessedCourse: {
          buoyPositions: [new Date(), new Date(), new Date(), new Date(), new Date(), new Date()],
          wakeCrossPositions: [new Date(), new Date(), new Date(), new Date(), new Date()],
          entryGatePosition: new Date(),
          exitGatePosition: new Date()
        },
        processedCourse: {
          buoyPositions: [
            {
              longitude: new Measurement(1, UnitAngle.degrees), 
              latitude: new Measurement(2, UnitAngle.degrees)
            },
            {
              longitude: new Measurement(1, UnitAngle.degrees), 
              latitude: new Measurement(2, UnitAngle.degrees)
            },
            {
              longitude: new Measurement(1, UnitAngle.degrees), 
              latitude: new Measurement(2, UnitAngle.degrees)
            },
            {
              longitude: new Measurement(1, UnitAngle.degrees), 
              latitude: new Measurement(2, UnitAngle.degrees)
            },
            {
              longitude: new Measurement(1, UnitAngle.degrees), 
              latitude: new Measurement(2, UnitAngle.degrees)
            },
            {
              longitude: new Measurement(1, UnitAngle.degrees), 
              latitude: new Measurement(2, UnitAngle.degrees)
            }
          ],
          wakeCrossPositions: [
            {
              longitude: new Measurement(1, UnitAngle.degrees), 
              latitude: new Measurement(2, UnitAngle.degrees)
            },
            {
              longitude: new Measurement(1, UnitAngle.degrees), 
              latitude: new Measurement(2, UnitAngle.degrees)
            },
            {
              longitude: new Measurement(1, UnitAngle.degrees), 
              latitude: new Measurement(2, UnitAngle.degrees)
            },
            {
              longitude: new Measurement(1, UnitAngle.degrees), 
              latitude: new Measurement(2, UnitAngle.degrees)
            },
            {
              longitude: new Measurement(1, UnitAngle.degrees), 
              latitude: new Measurement(2, UnitAngle.degrees)
            }
          ],
          entryGatePosition: {
            longitude: new Measurement(1, UnitAngle.degrees), 
            latitude: new Measurement(2, UnitAngle.degrees)
          },
          exitGatePosition: {
            longitude: new Measurement(1, UnitAngle.degrees), 
            latitude: new Measurement(2, UnitAngle.degrees)
          }
        }
      }
    ]

    let payload = {
        username: "mekromic",
        password: "password"
    }

    let authentication = Authentication.getInstance()

    await authentication.signUp(myUser)
      .then((response) => logger.current.log("SIGNUP: " + JSON.stringify(response)))
      .catch((error) => logger.current.error("SIGNUP: " + JSON.stringify(error)))

    await authentication.logIn(payload)
      .then((response) => logger.current.log("LOGIN: " + JSON.stringify(response)))
      .catch((error) => logger.current.error("LOGIN: " + JSON.stringify(error)))

    // let userDatabase = new UserDatabase(authentication.current.app)

    // console.log("User CRUD")
    // await userCRUD(userDatabase, myUser, newUser)

    // let skierDatabase = new SkierDatabase(authentication.current.app)

    // console.log("Skier CRUD")
    // await skierCRUD(skierDatabase, skier, newSkier)

    // let waterSkiingSessionDatabase = new WaterSkiingSessionDatabase(authentication.app)

    // console.log("WaterSkiingSession CRUD")
    // await waterSkiingSessionCRUD(waterSkiingSessionDatabase, myUser, session)

    // let waterSkiingPassDatabase = new WaterSkiingPassDatabase(authentication.app)

    // console.log("WaterSkiingPass CRUD")
    // await waterSkiingPassCRUD(waterSkiingPassDatabase, passes, session)

    // let waterSkiingCourseDatabase = new WaterSkiingCourseDatabase(authentication.app)

    // console.log("WaterSkiingCourse CRUD")
    // await waterSkiingCourseCRUD(waterSkiingCourseDatabase, courses)
    
    // let cloudStorage = new CloudStorage()
    // let id = new ObjectId().toString()
    // let location = "/Users/mplekunov/backend-test/COP4939-ReactNative-Backend/ReactComponents/Linear Theory - Reduction of order.mp4"

    // let file = {
    //   name: id, 
    //   location: location, 
    //   type: ContentType.VIDEO, 
    //   extension: Extension.MP4
    // }

    // let result = await cloudStorage.uploadObject(
    //   file,
    //   (progress: number) => {
    //     console.log(progress)
    //   }
    // )
  
    // console.log("Cloud Storage")
    // console.log(JSON.stringify(result))
  }

  return (
    <View style={styles.container}> 
    <TouchableOpacity onPress={example} style={styles.recordButton}>
    </TouchableOpacity>
  </View>
  )
}

const styles = StyleSheet.create({
  recordButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 50,
    left: 'auto'
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default App;
