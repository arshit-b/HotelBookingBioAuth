// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow strict-local
//  */

// import React, {useState} from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
//   Button,
// } from 'react-native';
// import ReactNativeBiometrics from 'react-native-biometrics';

// const App = () => {
//   const [prevKey, setPrevKey] = useState('');
//   const [prevSig, setPrevsig] = useState('');
//   const checkBioAvailable = async () => {
//     ReactNativeBiometrics.isSensorAvailable().then(resultObject => {
//       const {available, biometryType} = resultObject;
//       console.log(resultObject);
//       if (available && biometryType === ReactNativeBiometrics.TouchID) {
//         console.log('TouchID is supported');
//       } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
//         console.log('FaceID is supported');
//       } else if (
//         available &&
//         biometryType === ReactNativeBiometrics.Biometrics
//       ) {
//         console.log('Biometrics is supported');
//       } else {
//         console.log('Biometrics not supported');
//       }
//     });
//   };

//   const createKey = async () => {
//     ReactNativeBiometrics.createKeys('Confirm fingerprint').then(
//       resultObject => {
//         const {publicKey} = resultObject;
//         if (prevKey == publicKey) {
//           console.log('same as prev public key');
//         } else {
//           console.log('not same key');
//         }
//         setPrevKey(publicKey);
//         console.log(publicKey);
//         // sendPublicKeyToServer(publicKey);
//       },
//     );
//   };

//   const bioKeyExist = () => {
//     ReactNativeBiometrics.biometricKeysExist().then(resultObject => {
//       const {keysExist} = resultObject;

//       if (keysExist) {
//         console.log(resultObject);
//         console.log('Keys exist');
//       } else {
//         console.log('Keys do not exist or were deleted');
//       }
//     });
//   };

//   const deleteKey = () => {
//     ReactNativeBiometrics.deleteKeys().then(resultObject => {
//       const {keysDeleted} = resultObject;

//       if (keysDeleted) {
//         console.log('Successful deletion');
//       } else {
//         console.log(
//           'Unsuccessful deletion because there were no keys to delete',
//         );
//       }
//     });
//   };

//   const createSignature = () => {
//     let epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
//     let payload = epochTimeSeconds + 'some message';

//     ReactNativeBiometrics.createSignature({
//       promptMessage: 'Sign in',
//       payload: payload,
//     }).then(resultObject => {
//       const {success, signature} = resultObject;

//       if (success) {
//         console.log(resultObject);
//         if (prevSig == signature) {
//           console.log('same as prev signature');
//         } else {
//           setPrevsig(signature);
//           console.log('not same signature');
//         }
//         // verifySignatureWithServer(signature, payload);
//       }
//     });
//   };

//   const simplePrompt = () => {
//     ReactNativeBiometrics.simplePrompt({promptMessage: 'Confirm fingerprint'})
//       .then(resultObject => {
//         const {success} = resultObject;

//         if (success) {
//           console.log(resultObject);

//           console.log('successful biometrics provided');
//         } else {
//           console.log('user cancelled biometric prompt');
//         }
//       })
//       .catch(() => {
//         console.log('biometrics failed');
//       });
//   };
//   return (
//     <SafeAreaView style={styles.container}>
//       <Button
//         style={styles.checkButton}
//         onPress={checkBioAvailable}
//         title="checkBioAvailable"
//         color="#841584"
//       />
//       <Button
//         style={styles.checkButton}
//         onPress={createKey}
//         title="createKey"
//         color="#841584"
//       />
//       <Button
//         style={styles.checkButton}
//         onPress={bioKeyExist}
//         title="bioKeyExist"
//         color="#841584"
//       />
//       <Button
//         style={styles.checkButton}
//         onPress={deleteKey}
//         title="deleteKey"
//         color="#841584"
//       />
//       <Button
//         style={styles.checkButton}
//         onPress={createSignature}
//         title="createSignature"
//         color="#841584"
//       />
//       <Button
//         style={styles.checkButton}
//         onPress={simplePrompt}
//         title="simplePrompt"
//         color="#841584"
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     width: '100%',
//     maxWidth: 340,
//     alignSelf: 'center',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   checkButton: {
//     margin: 10,
//   },
// });

// export default App;

import React from 'react';
import 'react-native-gesture-handler';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './src/views/screens/HomeScreen';
import COLORS from './src/consts/colors';
import DetailsScreen from './src/views/screens/DetailsScreen';
import RootStackScreen from './src/views/screens/RootStackScreen';
const Stack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <RootStackScreen />
      {/* <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
      </Stack.Navigator> */}
    </NavigationContainer>
  );
};

export default App;
