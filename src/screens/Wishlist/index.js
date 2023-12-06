/* eslint-disable react/self-closing-comp */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unstable-nested-components */
import {useEffect, useState} from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import style from './style';
import {useDimensionContext} from '../../context';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import CommonHeaderLeft from '../../components/CommonHeaderLeft';
import {useDispatch, useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import colors from '../../components/common/colors';
import {updateCartCount} from '../../storage/action';
import CommonHeaderRight from '../../components/CommonHeaderRight';

const Wishlist = () => {
  const navigation = useNavigation();
  const userId = useSelector(state => state.userId);
  const cartCount = useSelector(state => state.cartCount);
  const dimensions = useDimensionContext();
  const responsiveStyle = style(
    dimensions.windowWidth,
    dimensions.windowHeight,
  );
  const [wishItems, setWishItems] = useState([]);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  useEffect(() => {
    getWishList();
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <CommonHeaderRight cart={true} />,
      headerLeft: () => <CommonHeaderLeft />,
    });
  }, []);

  const getWishList = async () => {
    console.warn('here');
    await firestore()
      .collection('Wishlist')
      .where('userId', '==', userId)
      .get()
      .then(snapShot => {
        if (snapShot.empty) {
          setWishItems([]);
        } else {
          const objArray = [];
          snapShot?.docs.forEach(document => {
            const result = {id: document.id, ...document?.data()};
            objArray.push(result);
          });
          setWishItems(objArray);
        }
      });
  };

  const addTocart = async itemToAdd => {
    await firestore()
      .collection('Cart')
      .where('userId', '==', userId)
      .where('productId', '==', itemToAdd.id)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          firestore().collection('Cart').add({
            created: Date.now(),
            description: itemToAdd.description,
            name: itemToAdd.name,
            price: itemToAdd.price,
            quantity: 1,
            userId: userId,
            productId: itemToAdd.id,
            image: itemToAdd.image,
          });
          dispatch(updateCartCount(cartCount + 1));
        } else {
          firestore()
            .collection('Cart')
            .doc(snapshot?.docs[0].id)
            .update({
              quantity: parseInt(snapshot?.docs[0].data().quantity, 10) + 1,
            });
        }
      });
  };

  const removeItem = async itemToRemove => {
    await firestore()
      .collection('Wishlist')
      .doc(itemToRemove.id)
      .delete()
      .then(() => {
        const filteredWishlist = wishItems.filter(
          ele => ele.id !== itemToRemove.id,
        );
        setWishItems(filteredWishlist);
      });
  };
  const navigateToShop = () => {
    navigation.navigate('Shop', {type: 'all'});
  };

  return (
    <View style={responsiveStyle.container}>
      <FlatList
        data={wishItems}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => {
          return (
            <View
              style={{
                padding: 15,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  fontSize: 18,
                  color: colors.primaryGreen,
                }}>
                Your Wishlist is Empty
              </Text>
              <TouchableOpacity style={{padding: 15}} onPress={navigateToShop}>
                <Text
                  style={{
                    fontFamily: 'Lato-Regular',
                    fontSize: 16,
                    color: colors.black,
                  }}>
                  Go To Shop
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
        renderItem={({item, index}) => {
          return (
            <View style={responsiveStyle.productView}>
              <Image
                source={{uri: item.image}}
                style={responsiveStyle.productImage}
              />
              <View style={responsiveStyle.secondView}>
                <Text style={responsiveStyle.title} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={responsiveStyle.desc} numberOfLines={2}>
                  {item.description}
                </Text>
                <View style={responsiveStyle.bottomView}>
                  <Text style={responsiveStyle.price}>₹ {item.price}</Text>
                  <TouchableOpacity
                    onPress={() => addTocart(item)}
                    style={responsiveStyle.cartView}>
                    <Text style={responsiveStyle.cartText}>Add To Cart</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => removeItem(item)}
                style={responsiveStyle.removeView}>
                <Image
                  source={require('../../assets/images/delete-white.png')}
                  style={responsiveStyle.remove}
                />
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Wishlist;
