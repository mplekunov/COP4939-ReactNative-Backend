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
import { Database } from '../Backend/Model/Database/database';
import { Authentication } from '../Backend/Model/Server/authentication';
import { LoggerService } from '../Backend/Logger/loggerService';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function App(): React.JSX.Element {
  const authentication = useRef(Authentication.getInstance())

  const logger = useRef(new LoggerService("SessionRecordingComponent"))

  const register = () => {
    let date = new Date()
    date.setMonth(6)
    date.setDate(5)
    date.setFullYear(1998)

    let myUser = new User(new Person("Michael", "Plekunov", date, Sex.MALE), "mekromic", "password")

    let database = new Database()

    let payload = {
        username: "mekromic",
        password: "password"
    }

    authentication.current.signUp(myUser)
    .then(
        (response) => {
            logger.current.log(JSON.stringify(response))
        }
    )
    .catch((error) => {
        logger.current.error(`${error}`)
    })

    authentication.current.logIn(payload)
    .then((response) => {
        logger.current.log(`${response}`)
      }
    )
    .catch((error) => {
      logger.current.error(`${error}`)
    })
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
