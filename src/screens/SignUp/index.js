import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, Image} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import style from './style';
import {
  validateEmail,
  validatePhoneNumber,
} from '../../components/common/validations';
import Snackbar from 'react-native-snackbar';
import colors from '../../components/common/colors';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '1083192814346-b205oqm2klblhlsdppuno8ajto2q7d6n.apps.googleusercontent.com',
    });
  }, []);

  const handleButtonPress = async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    } catch (error) {
      console.warn(error);
    }
  };

  const handleGoToLogin = () => {
    navigation.goBack();
  };

  const handleSignUp = async () => {
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedMobile = mobile.trim();
    const trimmedCPassword = cpassword.trim();
    const trimmedPassword = password.trim();

    if (
      trimmedUsername &&
      trimmedEmail &&
      trimmedMobile &&
      trimmedCPassword &&
      trimmedPassword
    ) {
      if (validateEmail(trimmedEmail)) {
        if (validatePhoneNumber(trimmedMobile)) {
          if (trimmedPassword === trimmedCPassword) {
            const querySnapshot = await firestore()
              .collection('Users')
              .where('username', '==', trimmedUsername)
              .where('email', '==', trimmedEmail)
              .get();

            if (querySnapshot.empty) {
              const userData = {
                username: trimmedUsername,
                email: trimmedEmail,
                mobilenumber: trimmedMobile,
                password: trimmedPassword,
                created: String(new Date()),
                updated: String(new Date()),
              };

              await firestore()
                .collection('Users')
                .add(userData)
                .then(resp => {
                  Snackbar.show({
                    text: 'A new account is created for you.',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: colors.primaryGreen,
                    textColor: colors.white,
                  });
                  navigation.navigate('MyDrawer');
                })
                .catch(err => {
                  console.warn(err);
                });
            } else {
              Snackbar.show({
                text: 'This email is already existing on our system, try using another one or go to login.',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: colors.red,
                textColor: colors.white,
              });
            }
          } else {
            setError('Given passwords do not match');
          }
        } else {
          setError('Given mobile number is not valid');
        }
      } else {
        setError('Given email is not valid');
      }
    } else {
      setError('Fill up all the fields to continue');
    }
  };

  return (
    <View style={style.container}>
      <Image
        source={require('../../assets/images/topBg.png')}
        style={style.topBg}
      />
      <ScrollView style={style.ScrollView} showsVerticalScrollIndicator={false}>
        <Image
          source={require('../../assets/images/logo.jpeg')}
          style={style.logo}
        />
        <Text style={style.loginText}>Sign Up Account</Text>

        {error !== null ? (
          <View style={style.errorView}>
            <Text style={style.errorText}>{error}</Text>
          </View>
        ) : null}

        <CustomTextInput
          handleText={text => setUsername(text)}
          placeholder="Username"
        />

        <CustomTextInput
          type="email"
          handleText={text => setEmail(text)}
          placeholder="Email Address"
        />

        <CustomTextInput
          type="phone"
          handleText={text => setMobile(text)}
          placeholder="Mobile Number"
        />

        <CustomTextInput
          type="password"
          handleText={text => setPassword(text)}
          placeholder="Password"
        />

        <CustomTextInput
          type="password"
          handleText={text => setCpassword(text)}
          placeholder="Confirm Password"
        />

        <CustomButton
          type="primary"
          handleButtonPress={handleSignUp}
          buttonText={'Sign Up'}
        />

        <View style={style.dottedLineContainer}>
          <View style={style.overflow}>
            <View style={style.dashedLine} />
          </View>
          <View style={style.textContainer}>
            <Text style={style.dashedText}>Or Sign up With</Text>
          </View>
        </View>

        <CustomButton
          type="secondary"
          handleButtonPress={handleButtonPress}
          buttonText={'Sign Up with Google'}
          icon={require('../../assets/images/google.png')}
        />

        <Text onPress={handleGoToLogin} style={style.createNew}>
          Go to Login
        </Text>
      </ScrollView>
    </View>
  );
};

export default SignUp;
