import React, {useState} from 'react';
import {
  Image,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Platform,
} from 'react-native';
import style from './style';
import colors from '../common/colors';
import {useDimensionContext} from '../../context';

const CustomTextInput = props => {
  const {
    type,
    handleText,
    placeholder,
    value,
    check = false,
    multiline = false,
  } = props;
  const dimensions = useDimensionContext();
  const [show, setShow] = useState(false);
  const keyboardType =
    type === 'email'
      ? 'email-address'
      : type === 'password'
      ? 'default'
      : type === 'phone'
      ? 'phone-pad'
      : 'default';
  const secureTextEntry = type === 'password' ? (show ? false : true) : false;
  const icon =
    type === 'email'
      ? require('../../assets/images/email.png')
      : type === 'password'
      ? show
        ? require('../../assets/images/view.png')
        : require('../../assets/images/hide.png')
      : false;

  const handlePassword = () => {
    setShow(!show);
  };

  return (
    <View style={style.container}>
      <TextInput
        style={[
          style.textInput,
          {
            height:
              Platform.OS === 'ios'
                ? multiline
                  ? dimensions.windowHeight * 0.12
                  : dimensions.windowHeight * 0.04
                : multiline
                ? dimensions.windowHeight * 0.1
                : dimensions.windowHeight * 0.05,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.gery}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        selectionColor={colors.primaryGreen}
        onChangeText={handleText}
        value={value}
        multiline={multiline}
      />
      {check ? <Text style={style.checkText}>Check</Text> : null}
      {!icon ? null : (
        <TouchableOpacity
          onPress={handlePassword}
          disabled={type !== 'password' ? true : false}>
          <Image style={style.icon} source={icon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CustomTextInput;
