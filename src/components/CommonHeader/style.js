import {Platform, StyleSheet} from 'react-native';
import colors from '../common/colors';

const style = (width, height, isPortrait) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop:
        Platform.OS === 'ios' ? (isPortrait ? width * 0.12 : width * 0.05) : 0,
      height: isPortrait ? width * 0.175 : width * 0.1,
      backgroundColor: colors.white_level_1,
      paddingHorizontal: width * 0.03,
    },
    sideIcon: {
      resizeMode: 'contain',
      height: height * 0.1,
      width: width * 0.1,
    },
    logo: {
      resizeMode: 'contain',
      height: height * 0.15,
      width: width * 0.4,
    },
  });

export default style;
