/* eslint-disable react/react-in-jsx-scope */
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {useEffect} from 'react';
import {useDimensionContext} from '../../context';
import style from './style';
import {useDispatch, useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {updateCartCount} from '../../storage/action';

const CustomFooter = ({state, descriptors, navigation}) => {
  const dimensions = useDimensionContext();
  const responsiveStyle = style(
    dimensions.windowWidth,
    dimensions.windowHeight,
    dimensions.isPortrait,
  );
  const userId = useSelector(state => state.userId);
  const cartCount = useSelector(state => state.cartCount);

  const dispatch = useDispatch();

  useEffect(() => {
    getCartProducts();
  }, []);

  const getCartProducts = async () => {
    await firestore()
      .collection('Cart')
      .where('userId', '==', userId)
      .get()
      .then(snapshot => {
        dispatch(updateCartCount(snapshot.size));
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View style={responsiveStyle.mainContainer}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const icon =
          route.name === 'Home'
            ? require('../../assets/images/home-white.png')
            : route.name === 'Categories'
            ? require('../../assets/images/category-white.png')
            : route.name === 'Search'
            ? require('../../assets/images/search-white.png')
            : route.name === 'Offers'
            ? require('../../assets/images/offers-white.png')
            : require('../../assets/images/cart-white.png');
        return (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate(route.name)}
            style={responsiveStyle.touchContainer}>
            {isFocused ? <Text style={responsiveStyle.dot}>.</Text> : null}
            {route.name === 'Cart' ? (
              <View style={responsiveStyle.cartCount}>
                <Text style={responsiveStyle.count}>{cartCount}</Text>
              </View>
            ) : null}
            <Image source={icon} style={responsiveStyle.iconStyle} />
            <Text style={responsiveStyle.footerText}>{route.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomFooter;
