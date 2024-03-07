/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useRef } from 'react';
import type {PropsWithChildren} from 'react';
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
import { BSON } from 'bson';
import 'react-native-get-random-values';
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
import { Pass } from '../Backend/Model/WaterSkiing/Course/pass';
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

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): React.JSX.Element {
  const authentication = useRef(Authentication.getInstance())

  const logger = useRef(new LoggerService("SessionRecordingComponent"))

  const register = async () => {
    let date = new Date()
    date.setMonth(6)
    date.setDate(5)
    date.setFullYear(1998)

    let myUser = new User(new Person("Michael", "Plekunov", date, Sex.MALE), "mekromic", "password")
    let newUser = new User(new Person("Michell", "Plekunova", date, Sex.FEMALE), "mekromic1", "password1")

    let session = new WaterSkiingSession(
      new ActivitySession(
        new BSON.ObjectId().toString(),
        new Location("Test Location", new Coordinate(new Measurement(1, UnitAngle.degrees), new Measurement(2, UnitAngle.degrees))),
        new Date()
      ),
      [
        new Pass(1, 
          new Gate(
            new Coordinate(new Measurement(1, UnitAngle.degrees), new Measurement(2, UnitAngle.degrees)),
            new Measurement(1, UnitSpeed.metersPerSecond),
            new Measurement(2, UnitAngle.degrees),
            new Measurement(1, UnitAngle.degrees),
            new Date()
          ),
          new Gate(
            new Coordinate(new Measurement(1, UnitAngle.degrees), new Measurement(2, UnitAngle.degrees)),
            new Measurement(1, UnitSpeed.metersPerSecond),
            new Measurement(2, UnitAngle.degrees),
            new Measurement(1, UnitAngle.degrees),
            new Date()
          ),
          [
            new WakeCross(
              new Coordinate(new Measurement(1, UnitAngle.degrees), new Measurement(2, UnitAngle.degrees)),
              new Measurement(1, UnitSpeed.metersPerSecond),
              new Measurement(2, UnitAngle.degrees),
              new Measurement(3, UnitAngle.arcMinutes),
              new Measurement(4, UnitAngle.arcMinutes),
              new Measurement(5, UnitAcceleration.metersPersecondSquared),
              new Measurement(6, UnitAcceleration.metersPersecondSquared),
              new Date()
            )
          ],
          [
            new Buoy(
              new Coordinate(new Measurement(1, UnitAngle.degrees), new Measurement(2, UnitAngle.degrees)),
              new Measurement(2, UnitSpeed.metersPerSecond),
              new Measurement(3, UnitAngle.degrees),
              new Measurement(5, UnitAngle.arcMinutes),
              new Date()
            )
          ],
          new Date(),
          new Video(
            "the video",
            new Date(),
            "www.example.com",
            123
          )
        )
      ],
      new Boat("The Lucky one", "LuckyID"),
      new Driver("Michael")
    )

    let payload = {
        username: "mekromic",
        password: "password"
    }

    await authentication.current.signUp(myUser)
      .then((response) => logger.current.log("SIGNUP: " + JSON.stringify(response)))
      .catch((error) => logger.current.error("SIGNUP: " + JSON.stringify(error)))

    await authentication.current.logIn(payload)
      .then((response) => logger.current.log("LOGIN: " + JSON.stringify(response)))
      .catch((error) => logger.current.error("LOGIN: " + JSON.stringify(error)))

    let myDatabase = new UserDatabase(authentication.current.app)

    let waterSkiingSessionDatabase = new WaterSkiingSessionDatabase(authentication.current.app)

    let skierDatabase = new SkierDatabase(authentication.current.app)

    let skier = new Skier(
      myUser, 
      new WaterSkiingEquipment(
        new Fin("brand", "style", new Measurement(1, UnitLength.feet), "bindingType"),
        new Ski("brand", "style", new Measurement(2, UnitLength.feet))
      ),
      WaterSkiingAgeGroup.JR_MEN
    )

    await skierDatabase.create(skier)
      .then((response) => logger.current.log("CREATE: " + JSON.stringify(response)))
      .catch((response) => logger.current.log("CREATE: " + JSON.stringify(response)))

    // await skierDatabase.read(skier.username)
    //   .then((response) => logger.current.log("READ: " + JSON.stringify(response)))
    //   .catch((response) => logger.current.log("READ: " + JSON.stringify(response)))

    // await skierDatabase.update(skier.username, skier)
    //   .then((response) => logger.current.log("UPDATE: " + JSON.stringify(response)))
    //   .catch((response) => logger.current.log("UPDATE: " + JSON.stringify(response)))

    // await skierDatabase.delete(skier.username)
    //   .then((response) => logger.current.log("DELETE: " + JSON.stringify(response)))
    //   .catch((response) => logger.current.log("DELETE: " + JSON.stringify(response)))


    // await waterSkiingSessionDatabase.create(session)
    //   .then((response) => logger.current.log("CREATE: " + JSON.stringify(response)))
    //   .catch((response) => logger.current.log("CREATE: " + JSON.stringify(response)))

    // await waterSkiingSessionDatabase.read(session.id)
    //   .then((response) => logger.current.log("READ SPECIFIC: " + JSON.stringify(response)))
    //   .catch((response) => logger.current.log("READ SPECIFIC: " + JSON.stringify(response)))

    // await waterSkiingSessionDatabase.readAll(0, 100)
    //   .then((response) => logger.current.log("READ ALL: " + JSON.stringify(response.data?.length)))
    //   .catch((response) => logger.current.log("READ ALL: " + JSON.stringify(response)))

    // await waterSkiingSessionDatabase.readAll(0, 100, myUser.username)
    //   .then((response) => logger.current.log("READ ALL FOR USER: " + JSON.stringify(response.data?.length)))
    //   .catch((response) => logger.current.log("READ ALL FOR USER: " + JSON.stringify(response)))

    // await waterSkiingSessionDatabase.update(session.id, session)
    //   .then((response) => logger.current.log("UPDATE: " + JSON.stringify(response)))
    //   .catch((response) => logger.current.log("UPDATE: " + JSON.stringify(response)))

    // await waterSkiingSessionDatabase.delete(session.id)
    //   .then((response) => logger.current.log("DELETE: " + JSON.stringify(response)))
    //   .catch((response) => logger.current.log("DELETE: " + JSON.stringify(response)))


    // await myDatabase.create(newUser)
    //   .then((response) => logger.current.log("CREATE: " + JSON.stringify(response)))
    //   .catch((response) => logger.current.log("CREATE: " + JSON.stringify(response)))

    // await myDatabase.read(newUser.username)
    //   .then((response) => logger.current.log("READ: " + JSON.stringify(response)))
    //   .catch((response) => logger.current.log("READ: " +JSON.stringify(response)))

    // await myDatabase.read(myUser.username)
    //   .then((response) => logger.current.log("READ: " + JSON.stringify(response)))
    //   .catch((response) => logger.current.log("READ: " +JSON.stringify(response)))


    // newUser.username = "yeah"

    // await myDatabase.update(myUser.username, newUser)
    //   .then((response) => logger.current.log("UPDATE: " + JSON.stringify(response)))
    //   .catch((response) => logger.current.log("UPDATE: " + JSON.stringify(response)))

    // await myDatabase.delete(newUser.username)
    //   .then((response) => logger.current.log("DELETE: " + JSON.stringify(response)))
    //   .catch((response) => logger.current.log("DELETE: " + JSON.stringify(response)))
  }

  return (
    <View style={styles.container}> 
    <TouchableOpacity onPress={register} style={styles.recordButton}>
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
