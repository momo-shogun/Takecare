import { View, Text, SafeAreaView, Platform, StyleSheet } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Camera, useCameraDevice, useCameraFormat, useCameraPermission } from 'react-native-vision-camera'
import { CONTENT_SPACING, CONTROL_BUTTON_SIZE, MAX_ZOOM_FACTOR, SAFE_AREA_PADDING, SCREEN_HEIGHT, SCREEN_WIDTH } from './constant'
import { usePreferredCameraDevice } from './hooks/usePreferredCameraDevice'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { useIsForeground } from './hooks/useIsForeground'
import TakePhotoButton from '../components/TakePhotoButton'

export default function ScanScreen() {
  const { hasPermission } = useCameraPermission()
  const cameraRef = useRef<Camera>(null)
  const isFocused = useIsFocused()
  const isForeground = useIsForeground()
  const isActive = isFocused && isForeground

  const [isCameraInitialized, setIsCameraInitialized] = useState(false)
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('front')
  const [enableHdr, setEnableHdr] = useState(false)
  const [flash, setFlash] = useState<'off' | 'on'>('off')
  const [enableNightMode, setEnableNightMode] = useState(false)

  const [preferredDevice] = usePreferredCameraDevice()
  let device = useCameraDevice(cameraPosition)
  if (preferredDevice != null && preferredDevice.position === cameraPosition) {
    device = preferredDevice
  }

  const [targetFps, setTargetFps] = useState(60)
  const screenAspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH
  const format = useCameraFormat(device, [
    { fps: targetFps },
    { videoAspectRatio: screenAspectRatio },
    { videoResolution: 'max' },
    { photoAspectRatio: screenAspectRatio },
    { photoResolution: 'max' },
  ])
  const fps = Math.min(format?.maxFps ?? 1, targetFps)
  const supportsFlash = device?.hasFlash ?? false
  const supportsHdr = format?.supportsPhotoHdr
  const supports60Fps = useMemo(() => device?.formats.some((f) => f.maxFps >= 60), [device?.formats])
  const canToggleNightMode = device?.supportsLowLightBoost ?? false
  const minZoom = device?.minZoom ?? 1
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR)

  const navigation = useNavigation()

  useEffect(() => {
    Camera.requestCameraPermission();
  }, []);

  if (hasPermission === false) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 justify-center items-center px-5">
          <Text className="text-white text-base text-center mb-4">Camera permission denied.</Text>
          <Text className="text-white text-base text-center">Please grant permission in settings.</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (device == null) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-white text-xs font-bold text-center">Your phone does not have a Camera.</Text>
      </View>
    )
  }

  const handleTakePhoto = async () => {
    if (!cameraRef.current) {
      console.warn('Camera not ready or ref not available');
      return;
    };
    try {
      const photo = await cameraRef.current.takePhoto()
      console.log('Photo taken:', photo.path);
      const photoPath = `${Platform.OS === 'android' ? 'file://' : ''}${photo.path}`;
      navigation.navigate('Result', { photoPath });
    } catch (error) {
      
    }
    
  }

  return (
    <>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isActive}
        photo={true}
      />
      <TakePhotoButton onPress={handleTakePhoto} />
    </>
  )
}
