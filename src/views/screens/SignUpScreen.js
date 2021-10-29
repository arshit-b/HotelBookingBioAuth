import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import ReactNativeBiometrics from 'react-native-biometrics';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {postUserSignup} from './../../api/apiCalls';
import AuthContext from '../../context/context';

const SignInScreen = ({navigation}) => {
  const [data, setData] = useState({
    username: '',
    email: '',
    check_textInputChange: false,
  });
  const [keyAvailable, setKeyAvailable] = useState(false);
  const [isBioAvailable, setIsBioAvailable] = useState(null);
  const [isFingerprintRegistered, setIsFingerprintRegistered] = useState(false);
  const [publickey, setPublickey] = useState(null);
  const {signUp} = React.useContext(AuthContext);

  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  function validateUserName(userName) {
    const reg = /^[a-zA-Z0-9]+$/;
    return userName.length > 0 && reg.test(userName);
  }

  const textInputChange = val => {
    if (val.length !== 0) {
      setData({
        ...data,
        username: val,
        check_textInputChange: true,
      });
    } else {
      setData({
        ...data,
        username: val,
        check_textInputChange: false,
      });
    }
  };

  const handleEmailChange = val => {
    if (validateEmail(val)) {
      setData({
        ...data,
        email: val,
        check_textInputChange: true,
      });
    } else {
      setData({
        ...data,
        email: val,
        check_textInputChange: false,
      });
    }
  };

  const checkBioAvailable = async () => {
    ReactNativeBiometrics.isSensorAvailable().then(resultObject => {
      const {available} = resultObject;
      setIsBioAvailable(available);
    });
  };
  const createKey = async () =>
    ReactNativeBiometrics.createKeys('Confirm fingerprint').then(
      resultObject => {
        const {publicKey} = resultObject;
        console.log('public key', publicKey);
        return publicKey;
      },
    );

  const bioKeyExist = async () =>
    ReactNativeBiometrics.biometricKeysExist().then(resultObject => {
      const {keysExist} = resultObject;

      if (keysExist) {
        setKeyAvailable(true);
      } else {
        setKeyAvailable(false);
        console.log('Keys do not exist or were deleted');
      }
      return keysExist;
    });

  const deleteKey = async () => {
    ReactNativeBiometrics.deleteKeys().then(resultObject => {
      const {keysDeleted} = resultObject;

      if (keysDeleted) {
        console.log('Successful deletion');
      } else {
        console.log(
          'Unsuccessful deletion because there were no keys to delete',
        );
      }
    });
  };

  const simplePropmpt = async () =>
    ReactNativeBiometrics.simplePrompt({
      promptMessage: 'Register Your Fingerprint',
    })
      .then(resultObject => {
        const {success} = resultObject;
        if (success) {
          setIsFingerprintRegistered(true);
        } else {
          setIsFingerprintRegistered(false);
        }
        return success;
      })
      .catch(error => {
        console.log('biometrics failed');
        return error;
      });

  const registerFingerprint = async () => {
    if (isBioAvailable) {
      const success = await simplePropmpt();

      if (success) {
        if (keyAvailable) await deleteKey();
        const publicKey = await createKey();
        setPublickey(publicKey);
        setIsFingerprintRegistered(true);
      }
    }
  };

  const canSignUp = () =>
    isFingerprintRegistered &&
    validateEmail(data.email) &&
    validateUserName(data.username);

  const handleSignUp = () => {
    if (canSignUp()) {
      signUp(data.username, data.email, publickey, navigation);
    }
  };

  useEffect(() => {
    bioKeyExist();
    checkBioAvailable();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#009387" barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text_header}>Register Now!</Text>
      </View>
      <Animatable.View animation="fadeInUpBig" style={styles.footer}>
        <ScrollView>
          <Text style={styles.text_footer}>Username</Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color="#05375a" size={20} />
            <TextInput
              placeholder="Your Username"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={val => textInputChange(val)}
            />
            {data.username.length === 0 ? null : (
              <Animatable.View animation="bounceIn">
                <Feather
                  name="check-circle"
                  color={validateUserName(data.username) ? 'green' : 'red'}
                  size={20}
                />
              </Animatable.View>
            )}
          </View>

          <Text
            style={[
              styles.text_footer,
              {
                marginTop: 35,
              },
            ]}>
            Email ID
          </Text>
          <View style={styles.action}>
            <Feather name="mail" color="#05375a" size={20} />
            <TextInput
              placeholder="Your Email ID"
              style={styles.textInput}
              autoCapitalize="none"
              onChangeText={val => handleEmailChange(val)}
            />
            {data.username.length === 0 ? null : (
              <Animatable.View animation="bounceIn">
                <Feather
                  name="check-circle"
                  color={validateEmail(data.email) ? 'green' : 'red'}
                  size={20}
                />
              </Animatable.View>
            )}
          </View>
          <TouchableOpacity
            onPress={registerFingerprint}
            style={[
              styles.signIn,
              {
                borderColor: isBioAvailable ? '#009387' : '#db4d4d',
                borderWidth: 1,
                marginTop: 15,
                backgroundColor: isFingerprintRegistered ? '#84e8dd' : 'white',
              },
            ]}>
            <Text
              style={[
                styles.textSign,
                {
                  color: isBioAvailable ? '#009387' : '#db4d4d',
                },
              ]}>
              {isBioAvailable
                ? `Register Your Fingerprint`
                : `Biometric is Not Supported`}
            </Text>
            {isFingerprintRegistered ? (
              <Animatable.View animation="bounceIn">
                <Feather
                  name="check-circle"
                  color={validateUserName(data.username) ? 'green' : 'red'}
                  size={20}
                />
              </Animatable.View>
            ) : null}
          </TouchableOpacity>
          <View style={styles.button}>
            <TouchableOpacity style={styles.signIn} onPress={handleSignUp}>
              <LinearGradient
                colors={['#08d4c4', '#01ab9d']}
                style={styles.signIn}>
                <Text
                  style={[
                    styles.textSign,
                    {
                      color: '#fff',
                    },
                  ]}>
                  Sign Up
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('SignInScreen')}
              style={[
                styles.signIn,
                {
                  borderColor: '#009387',
                  borderWidth: 1,
                  marginTop: 15,
                },
              ]}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: '#009387',
                  },
                ]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animatable.View>
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#52c0b4',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: Platform.OS === 'ios' ? 3 : 5,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  color_textPrivate: {
    color: 'grey',
  },
});
