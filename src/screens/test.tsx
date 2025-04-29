// import * as React from 'react';
// import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
// import type { GestureResponderEvent } from 'react-native';
// import { StyleSheet, Text, View, Alert, Linking } from 'react-native';
// import type { PinchGestureHandlerGestureEvent } from 'react-native-gesture-handler';
// import { PinchGestureHandler, TapGestureHandler } from 'react-native-gesture-handler';
// import type { CameraProps, CameraRuntimeError, PhotoFile, CameraDevice } from 'react-native-vision-camera';
// import { useCameraDevice, useCameraFormat, useCameraPermission } from 'react-native-vision-camera'; // Removed microphone/location permissions
// import { Camera } from 'react-native-vision-camera';
// import { CONTENT_SPACING, CONTROL_BUTTON_SIZE, MAX_ZOOM_FACTOR, SAFE_AREA_PADDING, SCREEN_HEIGHT, SCREEN_WIDTH } from './Constants'; // Assuming these exist
// import Reanimated, { Extrapolate, interpolate, useAnimatedGestureHandler, useAnimatedProps, useSharedValue } from 'react-native-reanimated';
// import { useIsForeground } from './hooks/useIsForeground'; // Assuming this hook exists
// import { StatusBarBlurBackground } from './views/StatusBarBlurBackground'; // Assuming this view exists
// import { PressableOpacity } from 'react-native-pressable-opacity'; // Assuming this component exists
// import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
// import IonIcon from 'react-native-vector-icons/Ionicons';
// import type { Routes } from './Routes'; // Assuming these types exist
// import type { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { useIsFocused } from '@react-navigation/core';

// // --- Reanimated Setup ---
// const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
// Reanimated.addWhitelistedNativeProps({
//   zoom: true,
// });

// const SCALE_FULL_ZOOM = 3; // From original code for pinch gesture scaling

// // --- Component Props ---
// // Using a generic stack navigator prop type if Routes is not strictly defined for this example
// // type Props = NativeStackScreenProps<any, 'PhotoCameraPage'>;
// // Or use the specific one if available:
// type Props = NativeStackScreenProps<Routes, 'CameraPage'>;


// export function PhotoCameraPage({ navigation }: Props): React.ReactElement {
//   const camera = useRef<Camera>(null);
//   const [isCameraInitialized, setIsCameraInitialized] = useState(false);
//   const { hasPermission: hasCameraPermission, requestPermission: requestCameraPermission } = useCameraPermission();
//   const zoom = useSharedValue(1); // Use 1 as a sensible default before device is known

//   // --- Camera Activity State ---
//   const isFocussed = useIsFocused();
//   const isForeground = useIsForeground();
//   const isActive = isFocussed && isForeground && hasCameraPermission; // Camera should only be active if focused, foreground, and permitted

//   // --- Camera Settings State ---
//   const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('back');
//   const [enableHdr, setEnableHdr] = useState(false);
//   const [flash, setFlash] = useState<'off' | 'on'>('off');

//   // --- Device Selection ---
//   // Note: usePreferredCameraDevice hook removed as it wasn't part of the request's core features
//   const device = useCameraDevice(cameraPosition);

//   // --- Format Selection ---
//   const screenAspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
//   // Prioritize photo aspect ratio and resolution
//   const format = useCameraFormat(device, [
//     // Higher FPS isn't critical for photos, focus on resolution/ratio
//     { photoAspectRatio: screenAspectRatio },
//     { photoResolution: 'max' },
//     // Include video format requests for potential preview stabilization/quality
//     { videoAspectRatio: screenAspectRatio },
//     { videoResolution: 'high' },
//   ]);

//   // --- Feature Support Checks ---
//   const supportsFlash = device?.hasFlash ?? false;
//   const supportsHdr = format?.supportsPhotoHdr ?? false; // Check PHOTO HDR support specifically

//   // --- Zoom Configuration ---
//   const minZoom = device?.minZoom ?? 1;
//   const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR);

//   const cameraAnimatedProps = useAnimatedProps<CameraProps>(() => {
//     const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
//     return {
//       zoom: z,
//     };
//   }, [maxZoom, minZoom, zoom]);

//   // --- Permissions ---
//   useEffect(() => {
//     if (!hasCameraPermission) {
//       requestCameraPermission();
//     }
//   }, [hasCameraPermission, requestCameraPermission]);

//   // --- Callbacks ---
//   const onError = useCallback((error: CameraRuntimeError) => {
//     console.error("Camera Error:", error);
//     Alert.alert("Camera Error", error.message);
//   }, []);

//   const onInitialized = useCallback(() => {
//     console.log('Camera initialized!');
//     // Set initial zoom value after initialization when device is definitely known
//     zoom.value = device?.neutralZoom ?? 1;
//     setIsCameraInitialized(true);
//   }, [device?.neutralZoom, zoom]);

//   const onPhotoCaptured = useCallback(
//     (photo: PhotoFile) => {
//       console.log(`Photo captured! ${JSON.stringify(photo)}`);
//       // Navigate to a preview page or handle the photo file
//        navigation.navigate('MediaPage', { // Or a specific PhotoPreviewPage
//          path: photo.path,
//          type: 'photo',
//        });
//     },
//     [navigation],
//   );

//   const onFlipCameraPressed = useCallback(() => {
//     setCameraPosition((p) => (p === 'back' ? 'front' : 'back'));
//     // Reset zoom when flipping camera
//     zoom.value = device?.neutralZoom ?? 1; // Consider resetting zoom on flip
//   }, [device?.neutralZoom, zoom]); // Add device dependency if resetting zoom

//   const onFlashPressed = useCallback(() => {
//     setFlash((f) => (f === 'off' ? 'on' : 'off'));
//   }, []);

//   const onHdrPressed = useCallback(() => {
//     if (supportsHdr) {
//        setEnableHdr((h) => !h);
//     }
//   }, [supportsHdr]); // Ensure HDR is supported before toggling


//   // --- Gestures ---

//   // Tap to Focus
//   const onFocusTap = useCallback(
//     ({ nativeEvent: event }: GestureResponderEvent) => {
//       if (!isCameraInitialized || !device?.supportsFocus) return;
//       camera.current?.focus({
//         x: event.locationX,
//         y: event.locationY,
//       }).catch(err => console.warn("Focus failed: ", err)); // Add error handling
//     },
//     [device?.supportsFocus, isCameraInitialized],
//   );

//   // Double Tap to Flip
//   const onDoubleTap = useCallback(() => {
//     onFlipCameraPressed();
//   }, [onFlipCameraPressed]);

//   // Pinch to Zoom
//   const onPinchGesture = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent, { startZoom?: number }>({
//     onStart: (_, context) => {
//       context.startZoom = zoom.value;
//     },
//     onActive: (event, context) => {
//       const startZoom = context.startZoom ?? 1; // Default to 1 if context is somehow lost
//       // Map linear pinch gesture scale to potentially non-linear camera zoom
//       const scale = interpolate(event.scale, [1 - 1 / SCALE_FULL_ZOOM, 1, SCALE_FULL_ZOOM], [-1, 0, 1], Extrapolate.CLAMP);
//       zoom.value = interpolate(scale, [-1, 0, 1], [minZoom, startZoom, maxZoom], Extrapolate.CLAMP);
//     },
//   });

//   // --- Effects ---
//   useEffect(() => {
//     // Reset zoom if the device changes (e.g., flipping camera) and it has a different neutral zoom
//     zoom.value = device?.neutralZoom ?? 1;
//   }, [zoom, device]);

//   useEffect(() => {
//     console.log(`Selected Camera: ${device?.name} | Format: ${format?.width}x${format?.height} | HDR: ${supportsHdr}`);
//   }, [device?.name, format, supportsHdr]);

//   // --- Capture Button ---
//   const takePhoto = useCallback(async () => {
//     if (camera.current == null || !isCameraInitialized) {
//        console.warn('Camera not ready.');
//        return;
//     }

//     console.log('Taking photo...');
//     try {
//       const photo = await camera.current.takePhoto({
//         qualityPrioritization: 'quality', // Prioritize quality for photos
//         flash: flash, // Use the state-controlled flash setting
//         enableShutterSound: true, // Optional: provide user feedback
//         enableAutoStabilization: true, // Generally recommended
//       });
//       onPhotoCaptured(photo);
//     } catch (e) {
//       console.error('Failed to take photo!', e);
//       if (e instanceof Error) {
//           Alert.alert('Error', `Failed to take photo: ${e.message}`);
//       }
//     }
//   }, [camera, isCameraInitialized, flash, onPhotoCaptured]);


//   // --- Render Logic ---

//   // Handle Permissions Not Granted
//   if (!hasCameraPermission) {
//     return (
//       <View style={styles.container}>
//         <StatusBarBlurBackground />
//         <View style={styles.permissionContainer}>
//           <Text style={styles.permissionText}>Camera permission is required.</Text>
//           <PressableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
//               <Text style={styles.buttonText}>Request Permission</Text>
//           </PressableOpacity>
//            <PressableOpacity style={styles.permissionButton} onPress={() => Linking.openSettings()}>
//               <Text style={styles.buttonText}>Open Settings</Text>
//           </PressableOpacity>
//         </View>
//       </View>
//     );
//   }

//   // Handle No Device Found
//   if (device == null) {
//     return (
//       <View style={styles.container}>
//          <StatusBarBlurBackground />
//         <View style={styles.emptyContainer}>
//           <Text style={styles.text}>No suitable camera device found.</Text>
//           {/* Optionally add a button to re-check or go to settings */}
//         </View>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Use PinchGestureHandler to wrap the camera view for zooming */}
//       <PinchGestureHandler onGestureEvent={onPinchGesture} enabled={isActive}>
//         <Reanimated.View onTouchEnd={onFocusTap} style={StyleSheet.absoluteFill}>
//           {/* Use TapGestureHandler for double-tap flip */}
//           <TapGestureHandler onEnded={onDoubleTap} numberOfTaps={2}>
//             <ReanimatedCamera
//               ref={camera}
//               style={StyleSheet.absoluteFill}
//               device={device}
//               format={format}
//               isActive={isActive} // Control camera activity
//               onInitialized={onInitialized}
//               onError={onError}
//               // Enable photo capture
//               photo={true}
//               // Disable video/audio
//               video={false} // Explicitly false
//               audio={false} // Explicitly false
//               // --- Config Props ---
//               photoHdr={supportsHdr && enableHdr} // Pass HDR state only if supported
//               flash={flash} // Controlled via state, passed to takePhoto options instead
//               lowLightBoost={device.supportsLowLightBoost ?? false} // Keep low light boost if desired
//               enableZoomGesture={false} // Disable built-in zoom, using Reanimated pinch handler
//               animatedProps={cameraAnimatedProps} // Apply animated zoom
//               exposure={0} // Example exposure setting
//               // --- Orientation ---
//               // outputOrientation="device" // Keep if needed, depends on how you handle output
//               // --- Optional Callbacks ---
//               // onStarted={() => console.log('Camera started!')}
//               // onStopped={() => console.log('Camera stopped!')}
//             />
//           </TapGestureHandler>
//         </Reanimated.View>
//       </PinchGestureHandler>

//       {/* --- UI Overlay --- */}
//       <StatusBarBlurBackground />

//       {/* Right Controls */}
//       <View style={styles.rightButtonRow}>
//         {/* Flip Camera */}
//         <PressableOpacity style={styles.button} onPress={onFlipCameraPressed} disabledOpacity={0.4}>
//           <IonIcon name="camera-reverse" color="white" size={24} />
//         </PressableOpacity>

//         {/* Flash Control (only if supported) */}
//         {supportsFlash && (
//           <PressableOpacity style={styles.button} onPress={onFlashPressed} disabledOpacity={0.4}>
//             <IonIcon name={flash === 'on' ? 'flash' : 'flash-off'} color="white" size={24} />
//           </PressableOpacity>
//         )}

//         {/* HDR Control (only if supported) */}
//         {supportsHdr && (
//           <PressableOpacity style={styles.button} onPress={onHdrPressed} disabledOpacity={0.4}>
//             <MaterialIcon name={enableHdr ? 'hdr' : 'hdr-off'} color="white" size={24} />
//           </PressableOpacity>
//         )}

//          {/* Add other buttons if needed, e.g., settings */}
//          {/* <PressableOpacity style={styles.button} onPress={() => navigation.navigate('SettingsPage')}>
//            <IonIcon name="settings-outline" color="white" size={24} />
//          </PressableOpacity> */}
//       </View>

//       {/* Capture Button */}
//       <View style={styles.captureButtonContainer}>
//          <PressableOpacity
//             style={[styles.captureButton, !isCameraInitialized && styles.disabledButton]}
//             onPress={takePhoto}
//             disabled={!isCameraInitialized || !isActive} // Disable if not ready or not active
//             disabledOpacity={0.6}
//           >
//             {/* Simple circle or camera icon */}
//             <View style={styles.captureButtonInner} />
//          </PressableOpacity>
//       </View>

//     </View>
//   );
// }

// // --- Styles (Simplified and Adjusted) ---
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'black',
//   },
//   permissionContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   permissionText: {
//       color: 'white',
//       fontSize: 18,
//       marginBottom: 20,
//       textAlign: 'center',
//   },
//   permissionButton: {
//       backgroundColor: 'rgba(140, 140, 140, 0.6)',
//       paddingVertical: 10,
//       paddingHorizontal: 20,
//       borderRadius: 8,
//       marginBottom: 10,
//   },
//   buttonText: {
//       color: 'white',
//       fontSize: 16,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   captureButtonContainer: {
//     position: 'absolute',
//     bottom: SAFE_AREA_PADDING.paddingBottom + 20, // Added extra spacing
//     width: '100%',
//     alignItems: 'center',
//   },
//   captureButton: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: 'rgba(255, 255, 255, 0.4)', // Semi-transparent white
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 3,
//     borderColor: 'white',
//   },
//    captureButtonInner: { // Inner circle for visual feedback
//     width: 58,
//     height: 58,
//     borderRadius: 29,
//     backgroundColor: 'white',
//   },
//   disabledButton: {
//       backgroundColor: 'rgba(120, 120, 120, 0.4)',
//       borderColor: 'grey',
//   },
//   button: {
//     marginBottom: CONTENT_SPACING,
//     width: CONTROL_BUTTON_SIZE,
//     height: CONTROL_BUTTON_SIZE,
//     borderRadius: CONTROL_BUTTON_SIZE / 2,
//     backgroundColor: 'rgba(140, 140, 140, 0.3)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   rightButtonRow: {
//     position: 'absolute',
//     right: SAFE_AREA_PADDING.paddingRight,
//     top: SAFE_AREA_PADDING.paddingTop + (StatusBarBlurBackground ? 40 : 0), // Adjust top based on status bar component
//   },
//   text: {
//     color: 'white',
//     fontSize: 16, // Slightly larger for messages
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
// });