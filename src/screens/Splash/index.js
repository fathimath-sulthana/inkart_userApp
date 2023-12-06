/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import {Image, View} from 'react-native';
import colors from '../../components/common/colors';

const Splash = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: colors.white,
        alignItems: 'center',
      }}>
      <Image
        source={require('../../assets/images/logo-icon.jpeg')}
        style={{width: 200, height: 200, resizeMode: 'contain'}}
      />
    </View>
  );
};

export default Splash;
