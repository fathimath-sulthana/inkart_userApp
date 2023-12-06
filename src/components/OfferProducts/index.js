/* eslint-disable react/react-in-jsx-scope */
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {useDimensionContext} from '../../context';
import style from './style';
import {FlatList} from 'react-native-gesture-handler';
import CommonSectionHeader from '../CommonSectionHeader';
import {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {updateCartCount} from '../../storage/action';

const OfferProducts = () => {
  const dimensions = useDimensionContext();
  const responsiveStyle = style(
    dimensions.windowWidth,
    dimensions.windowHeight,
  );
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    await firestore()
      .collection('Products')
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          const result = [];
          snapshot.docs.forEach(doc => {
            if (doc.exists) {
              const responseData = {id: doc.id, ...doc?.data()};
              result.push(responseData);
            }
          });
          setProducts(result);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View style={responsiveStyle.container}>
      <CommonSectionHeader
        head={'Say Hello to Offers!'}
        content={'Best price ever for all the time.'}
        rightText={'See All'}
      />
      <View>
        <FlatList
          data={products}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => String(index)}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} />
          )}
        />
      </View>
    </View>
  );
};

const RenderItem = ({item, index}) => {
  const navigation = useNavigation();
  const dimensions = useDimensionContext();
  const responsiveStyle = style(
    dimensions.windowWidth,
    dimensions.windowHeight,
  );
  const userId = useSelector(state => state.userId);
  const cartCount = useSelector(state => state.cartCount);
  const [qun, setQun] = useState(0);
  const dispatch = useDispatch();

  const handleProduct = () => {
    navigation.navigate('ProductDetails', {product: item});
  };

  const addToCart = async () => {
    await firestore()
      .collection('Cart')
      .where('userId', '==', userId)
      .where('productId', '==', item.id)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          firestore().collection('Cart').add({
            created: Date.now(),
            description: item.description,
            name: item.name,
            price: item.price,
            quantity: 1,
            userId: userId,
            productId: item.id,
            image: item.image,
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

  return (
    <TouchableOpacity
      onPress={handleProduct}
      style={responsiveStyle.productView}>
      <Image source={{uri: item.image}} style={responsiveStyle.productImage} />
      <View style={responsiveStyle.nameView}>
        <Text style={responsiveStyle.name} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={responsiveStyle.des} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={responsiveStyle.priceView}>
          <View style={responsiveStyle.priceView2}>
            <Text style={responsiveStyle.price}>₹ {item.price}</Text>
            <View style={responsiveStyle.offView}>
              <Text style={responsiveStyle.offText}>10%</Text>
            </View>
          </View>
          <View style={responsiveStyle.qunView}>
            <TouchableOpacity
              onPress={() => {
                setQun(qun <= 0 ? qun : qun - 1);
              }}>
              <Text style={responsiveStyle.qunText1}>-</Text>
            </TouchableOpacity>
            <Text style={responsiveStyle.qunText2}>{qun}</Text>
            <TouchableOpacity
              onPress={() => {
                setQun(qun + 1);
                addToCart();
              }}>
              <Text style={responsiveStyle.qunText1}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OfferProducts;
