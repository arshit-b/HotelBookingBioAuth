import React from 'react';
import 'react-native-gesture-handler';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './src/views/screens/HomeScreen';
import COLORS from './src/consts/colors';
import DetailsScreen from './src/views/screens/DetailsScreen';
import RootStackScreen from './src/views/screens/RootStackScreen';
import AuthContext from './src/context/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBiometrics from 'react-native-biometrics';

import {postUserSignin, postUserSignup} from './src/api/apiCalls';
// import {API_BASE_URL} from '@env';
// console.log('API', API_BASE_URL);

const Stack = createStackNavigator();

const App = () => {
  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          email: action.email,
          publicKey: action.publicKey,
          isLoading: false,
        };
      case 'SIGNIN':
        return {
          ...prevState,
          useEmail: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'SIGNOUT':
        return {
          ...prevState,
          useEmail: null,
          userToken: null,
          isLoading: false,
        };
      case 'SIGNUP':
        return {
          ...prevState,
          email: action.email,
          userName: action.userName,
          publicKey: action.publicKey,
          isLoading: false,
        };
    }
  };

  const initialLoginState = {
    isLoading: true,
    useName: null,
    email: null,
    publicKey: null,
  };

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState,
  );

  const storeData = value => {
    try {
      const jsonValue = JSON.stringify(value);
      console.log('[App.js] @storage_Key', jsonValue);
      AsyncStorage.setItem('@storage_Key', jsonValue);
    } catch (e) {
      return e;
    }
  };
  const authContext = {
    getUserData: () => {
      try {
        return AsyncStorage.getItem('@storage_Key').then(jsonValue => {
          const creds = jsonValue != null ? JSON.parse(jsonValue) : null;

          if (creds === null) {
            console.log('creds are null');
            return creds;
          }
          dispatch({
            type: 'RETRIEVE_TOKEN',
            email: creds.email,
            publicKey: creds.publicKey,
          });
          console.log('[App.js] User Creds', creds);
          return creds;
        });
      } catch (e) {
        // error reading value
        console.log(e);
      }
    },
    signIn: navigation => {
      try {
        let epochTimeSeconds = Math.round(
          new Date().getTime() / 1000,
        ).toString();
        let payload = `payload${epochTimeSeconds}`;

        ReactNativeBiometrics.createSignature({
          promptMessage: 'Sign in',
          payload: payload,
        }).then(resultObject => {
          const {success, signature} = resultObject;
          console.log('signature', resultObject);
          if (success) {
            const {email} = loginState;

            // sending signature to backend to check with publickey.
            postUserSignin({email, signature, payload}).then(res => {
              console.log('signIn API response', res);
              if (res.result) {
                navigation.navigate('Home');
              }
            });
          }
        });
      } catch (e) {
        console.log(e);
      }
    },
    signOut: navigation => {
      try {
        AsyncStorage.removeItem('@storage_Key').then(() => {
          navigation.navigate('SplashScreen');
          console.log('user signed out');
        });
      } catch (e) {
        // remove error
      }
      dispatch({type: 'SIGNOUT'});
    },
    signUp: (userName, email, publicKey, navigation) => {
      storeData({email, publicKey});
      // send creds to backend
      postUserSignup({
        userName,
        email,
        publicKey,
      }).then(res => {
        console.log('signUp API response', res);
        navigation.navigate('SignInScreen');
      });
      dispatch({type: 'SIGNUP', userName, email, publicKey});
    },
  };

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
        {/* <RootStackScreen /> */}
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="RootStackScreen" component={RootStackScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="DetailsScreen" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default App;
