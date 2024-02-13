import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, TouchableOpacity, GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';

interface RecrodButtonProps {
    onPress: (event: GestureResponderEvent) => void
    isRecording: boolean
    style ?: StyleProp<ViewStyle>
}

export const RecordButton: React.FC<RecrodButtonProps>  = ({onPress, isRecording, style}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    if (isRecording) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.2,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
        ).start();
    } else {
        scaleAnim.stopAnimation();
    }
      return (
        <View style={style}>
          <TouchableOpacity onPress={onPress} style={styles.recordButton}>
            <Animated.View style={[styles.recordButtonInner, isRecording && { transform: [{ scale: scaleAnim }] }]} />
          </TouchableOpacity>
        </View>
      );
  };
  
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
    recordButtonInner: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#e74c3c'
    },
  });