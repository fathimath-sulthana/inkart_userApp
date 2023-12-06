import {StyleSheet, Dimensions} from 'react-native';
import colors from '../../components/common/colors';

const {width, height} = Dimensions.get('screen');
const style = StyleSheet.create({
  main: {
    flex: 1,
  },
  container: {
    backgroundColor: colors.white_level_2,
  },
});

export default style;
