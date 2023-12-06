import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import style from './style';
import Snackbar from 'react-native-snackbar';
import colors from '../../components/common/colors';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useDimensionContext} from '../../context';
import {validateEmail} from '../../components/common/validations';
import {useDispatch} from 'react-redux';
import {login} from '../../storage/action';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

const Login = () => {
  const dimensions = useDimensionContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const responsiveStyle = style(
    dimensions.windowWidth,
    dimensions.windowHeight,
  );

  function onAuthStateChanged(user) {
    // console.warn('onAuthStateChanged', user);
  }

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '33515813402-k2ig39lld3nbqkmfo8q7snti1tb4uq33.apps.googleusercontent.com',
    });
  }, []);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  const handleLogin = async () => {
    if (email.trim() !== '' && password.trim() !== '') {
      if (validateEmail(email.trim())) {
        await firestore()
          .collection('Users')
          .where('email', '==', email.trim())
          .get()
          .then(async snapshot => {
            if (snapshot.empty) {
              Snackbar.show({
                text: 'This user is not registered with us, try creating a new account.',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: colors.red,
                textColor: colors.white,
              });
            } else {
              snapshot.forEach(documentSnapshot => {
                const respData = documentSnapshot.data();
                if (password.trim() === respData.password) {
                  Snackbar.show({
                    text: 'Login successful',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: colors.primaryGreen,
                    textColor: colors.white,
                  });
                  dispatch(
                    login({
                      userId: documentSnapshot.id,
                      firstName: respData.firstName,
                      lastName: respData.lastName,
                      email: respData.email,
                      mobileNumber: respData.mobilenumber,
                      profileImage: respData.profileimage,
                    }),
                  );
                  // navigation.navigate('MyDrawer');
                } else {
                  Snackbar.show({
                    text: 'The password you entered is wrong.',
                    duration: Snackbar.LENGTH_LONG,
                    backgroundColor: colors.red,
                    textColor: colors.white,
                  });
                }
              });
            }
          })
          .catch(err => console.warn(err));
      } else {
        Snackbar.show({
          text: 'Enter a valid email.',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: colors.red,
          textColor: colors.white,
        });
      }
    } else {
      Snackbar.show({
        text: 'Fill up the fields to continue.',
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: colors.red,
        textColor: colors.white,
      });
    }
  };

  const handleGoToSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleGoToLoginPhone = () => {
    navigation.navigate('LoginPhone');
  };

  const handleButtonPress = async () => {
    try {
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      const userInfo = await GoogleSignin.signIn();

      if (userInfo) {
        await firestore()
          .collection('Users')
          .where('isAdmin', '==', false)
          .where('email', '==', userInfo?.user?.email ?? '')
          .get()
          .then(async snapshot => {
            if (snapshot.empty) {
              Snackbar.show({
                text: 'Your Account is not registerd with our system.',
                duration: Snackbar.LENGTH_LONG,
                backgroundColor: '#ff6347',
                textColor: colors.white,
              });
            } else {
              snapshot?.docs.forEach(document => {
                if (document.exists) {
                  const result = document?.data();
                  if (!result.isAdmin) {
                    signInContext({
                      userId: document.id,
                      profileImage: result?.image,
                      firstname: result?.firstname ?? '',
                      lastname: result?.lastname ?? '',
                      email: result?.email ?? '',
                    });
                  }
                }
              });
            }
          });
      } else {
        Snackbar.show({
          text: 'Something went wrong try another method.',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: '#ff6347',
          textColor: colors.white,
        });
      }
    } catch (error) {
      await GoogleSignin.revokeAccess();
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Snackbar.show({
          text: 'In progress wait for some time.',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: colors.lightGreen,
          textColor: colors.white,
        });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Snackbar.show({
          text: 'Play services not available.',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: '#ff6347',
          textColor: colors.white,
        });
      } else {
        Snackbar.show({
          text: 'Something went wrong try another method.',
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: '#ff6347',
          textColor: colors.white,
        });
      }
    }
  };

  return (
    <View style={responsiveStyle.container}>
      <Image
        source={require('../../assets/images/topBg.png')}
        style={responsiveStyle.topBg}
      />
      <ScrollView
        style={responsiveStyle.ScrollView}
        contentContainerStyle={responsiveStyle.contentContainerStyle}
        showsVerticalScrollIndicator={false}>
        <Image
          source={require('../../assets/images/logo.jpeg')}
          style={responsiveStyle.logo}
        />
        <Text style={responsiveStyle.loginText}>Login Account</Text>

        <CustomTextInput
          type="email"
          handleText={text => setEmail(text)}
          placeholder="Email Address"
        />
        <CustomTextInput
          type="password"
          handleText={text => setPassword(text)}
          placeholder="Password"
        />

        <CustomButton
          type="primary"
          handleButtonPress={handleLogin}
          buttonText={'Sign In'}
        />

        <Text onPress={handleGoToSignUp} style={responsiveStyle.createNew}>
          If you are new, Create Here
        </Text>

        <View style={responsiveStyle.dottedLineContainer}>
          <View style={responsiveStyle.overflow}>
            <View style={responsiveStyle.dashedLine} />
          </View>
          <View style={responsiveStyle.textContainer}>
            <Text style={responsiveStyle.dashedText}>Or Login With</Text>
          </View>
        </View>

        <CustomButton
          type="secondary"
          handleButtonPress={handleGoToLoginPhone}
          buttonText={'Sign In with Phone'}
          icon={require('../../assets/images/smartphone.png')}
        />
        <CustomButton
          type="secondary"
          handleButtonPress={handleButtonPress}
          buttonText={'Sign In with Google'}
          icon={require('../../assets/images/google.png')}
        />
      </ScrollView>
      <View style={responsiveStyle.footer}>
        <Text style={responsiveStyle.footerText}>Login in as a Guest</Text>
      </View>
    </View>
  );
};

export default Login;
