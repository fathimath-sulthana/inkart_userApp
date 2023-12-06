/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/no-unstable-nested-components */
import {useEffect, useState} from 'react';
import {
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import style from './style';
import {useNavigation} from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import Snackbar from 'react-native-snackbar';
import firestore from '@react-native-firebase/firestore';
import CommonHeaderLeft from '../../components/CommonHeaderLeft';
import {useDimensionContext} from '../../context';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import colors from '../../components/common/colors';
import {
  validateEmail,
  validatePhoneNumber,
} from '../../components/common/validations';
import {useDispatch, useSelector} from 'react-redux';
import {updateProfile} from '../../storage/action';
import {updateProfileImage} from './controller';

const Account = () => {
  const navigation = useNavigation();
  const dimensions = useDimensionContext();
  const responsiveStyle = style(
    dimensions.windowWidth,
    dimensions.windowHeight,
    dimensions.isPortrait,
  );
  const {userId, firstName, lastName, email, mobileNumber, profileImage} =
    useSelector(state => state);

  const dispatch = useDispatch();

  const [fName, setFName] = useState(firstName);
  const [lName, setLName] = useState(lastName);
  const [phone, setPhone] = useState(mobileNumber);
  const [modal, setModal] = useState(false);
  const [modalChoose, setModalChoose] = useState(false);
  const [userImage, setUserImage] = useState('');
  const [StateEmail, setEmail] = useState(email);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CommonHeaderLeft />,
    });
  }, []);

  const handleOpenImage = () => {
    setModal(!modal);
  };
  const handleEditImage = () => {
    setModalChoose(true);
  };

  const handlePickFromGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        setUserImage(image.sourceURL ?? '');
        setModalChoose(false);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        setModalChoose(false);
        console.log(image);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleUpdateProfile = async () => {
    if (validatePhoneNumber(phone.trim())) {
      if (validateEmail(StateEmail.trim())) {
        if (fName !== '' && lName !== '') {
          let newUrl = profileImage;
          if (userImage !== '') {
            newUrl = await updateProfileImage(userImage);
          }
          await firestore()
            .collection('Users')
            .doc(userId)
            .update({
              firstName: fName,
              lastName: lName,
              email: StateEmail,
              mobilenumber: phone,
              profileimage: newUrl,
            })
            .then(() => {
              dispatch(
                updateProfile({
                  firstName: fName,
                  lastName: lName,
                  email: StateEmail,
                  mobileNumber: phone,
                  profileImage: newUrl,
                }),
              );
              setUserImage('');
              Snackbar.show({
                text: 'Profile is updated',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: colors.primaryGreen,
                textColor: colors.white,
              });
            });
        } else {
          Snackbar.show({
            text: 'Fill up the all fields to continue',
            duration: Snackbar.LENGTH_SHORT,
            backgroundColor: colors.red,
            textColor: colors.white,
          });
        }
      } else {
        Snackbar.show({
          text: 'Given email address is not valid',
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: colors.red,
          textColor: colors.white,
        });
      }
    } else {
      Snackbar.show({
        text: 'Given phone number is not valid',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: colors.red,
        textColor: colors.white,
      });
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={responsiveStyle.container}>
      <Text style={responsiveStyle.head}>
        {firstName} {lastName}
      </Text>
      <View style={responsiveStyle.userImage}>
        <TouchableOpacity onPress={handleOpenImage}>
          <Image
            style={responsiveStyle.image}
            source={
              userImage === ''
                ? profileImage === ''
                  ? require('../../assets/images/dummy.png')
                  : {uri: profileImage}
                : {uri: userImage}
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={responsiveStyle.editTouch}
          onPress={handleEditImage}>
          <Image
            source={require('../../assets/images/edit-green.png')}
            style={responsiveStyle.edit}
          />
        </TouchableOpacity>
      </View>

      <CustomTextInput
        handleText={text => setFName(text)}
        value={fName}
        placeholder="First Name"
      />
      <CustomTextInput
        handleText={text => setLName(text)}
        value={lName}
        placeholder="Last Name"
      />
      <CustomTextInput
        type="email"
        handleText={text => setEmail(text)}
        value={StateEmail}
        placeholder="Email Address"
      />
      <CustomTextInput
        handleText={text => setPhone(text)}
        value={phone}
        placeholder="Mobile Number"
      />

      <CustomButton
        type="primary"
        handleButtonPress={handleUpdateProfile}
        buttonText={'Update Profile'}
      />

      <Modal visible={modal} onRequestClose={() => setModal(false)} transparent>
        <View style={responsiveStyle.modalBack}>
          <View>
            <TouchableOpacity
              onPress={() => setModal(false)}
              style={responsiveStyle.close}>
              <Image
                source={require('../../assets/images/close.png')}
                style={responsiveStyle.edit}
              />
            </TouchableOpacity>
            <Image
              style={responsiveStyle.bigImage}
              source={
                userImage === ''
                  ? require('../../assets/images/dummy.png')
                  : {uri: userImage}
              }
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={modalChoose}
        onRequestClose={() => setModalChoose(false)}
        transparent>
        <View style={responsiveStyle.modalBack}>
          <View style={responsiveStyle.selectBox}>
            <TouchableOpacity
              onPress={() => setModalChoose(false)}
              style={responsiveStyle.closeChoose}>
              <Image
                source={require('../../assets/images/close.png')}
                style={responsiveStyle.edit}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={responsiveStyle.touch}
              onPress={handlePickFromGallery}>
              <Text style={responsiveStyle.pickText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={responsiveStyle.touch}
              onPress={handleFromCamera}>
              <Text style={responsiveStyle.pickText}>Camera</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Account;
