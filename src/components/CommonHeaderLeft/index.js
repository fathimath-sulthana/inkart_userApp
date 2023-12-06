/* eslint-disable react/react-in-jsx-scope */
import {Image, TouchableOpacity} from 'react-native';
import style from './style';
import {useNavigation} from '@react-navigation/native';
import {useDimensionContext} from '../../context';

const CommonHeaderLeft = props => {
  const navigation = useNavigation();
  const dimensions = useDimensionContext();
  const responsiveStyle = style(
    dimensions.windowWidth,
    dimensions.windowHeight,
  );

  const handleClick = () => {
    if (props.type === 'back') {
      if (props.action) {
        props.action();
      } else {
        navigation.goBack();
      }
    } else {
      navigation.toggleDrawer();
    }
  };

  return (
    <TouchableOpacity style={responsiveStyle.padding} onPress={handleClick}>
      <Image
        source={
          props.type === 'back'
            ? require('../../assets/images/left-arrow.png')
            : require('../../assets/images/drawer.png')
        }
        style={responsiveStyle.image}
      />
    </TouchableOpacity>
  );
};

export default CommonHeaderLeft;
