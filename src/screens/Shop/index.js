/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
import {View, Text, FlatList, TouchableOpacity, Image} from 'react-native';
import {useDimensionContext} from '../../context';
import style from './style';
import {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import CommonHeaderLeft from '../../components/CommonHeaderLeft';
import CommonHeaderRight from '../../components/CommonHeaderRight';
import CustomSearch from '../../components/CustomSearch';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import CommonEmpty from '../../components/CommonEmpty';

const Shop = () => {
  const dimensions = useDimensionContext();
  const responsiveStyle = style(
    dimensions.windowWidth,
    dimensions.windowHeight,
    dimensions.isPortrait,
  );
  const navigation = useNavigation();
  const route = useRoute();
  const {type} = route.params;
  const categories = useSelector(state => state.categories);
  const [selectedCategory, setSelectedCategory] = useState('');
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

  useEffect(() => {
    if (type === 'all') {
      setSelectedCategory('Shop');
    }
  }, [type]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CommonHeaderLeft type="back" />,
      headerRight: () => <CommonHeaderRight cart={true} />,
      title: selectedCategory,
    });
  }, [selectedCategory]);

  const handleCategories = async item => {
    setSelectedCategory(item.name);
    await firestore()
      .collection('Products')
      .where('categoryId', '==', item.id)
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
          setProducts(result.length > 0 ? result : []);
        } else {
          setProducts([]);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleRenderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => handleCategories(item)}
        style={responsiveStyle.catItemView}>
        <Text style={responsiveStyle.catItem}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const emptyComponent = () => {
    return <CommonEmpty title={'No Products Available'} />;
  };

  const handleProduct = item => {
    navigation.navigate('ProductDetails', {product: item});
  };

  const handleProductsRender = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => handleProduct(item)}
        style={responsiveStyle.productView}>
        <Image
          source={{uri: item.image}}
          style={responsiveStyle.productImage}
        />
        <View style={responsiveStyle.nameView}>
          <Text style={responsiveStyle.name} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={responsiveStyle.des} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={responsiveStyle.priceView}>
            <View style={responsiveStyle.priceView2}>
              <Text style={responsiveStyle.price}>₹{item.price}</Text>
              <View style={responsiveStyle.offView}>
                <Text style={responsiveStyle.offText}>50%</Text>
              </View>
            </View>
            <View style={responsiveStyle.qunView}>
              <Text style={responsiveStyle.qunText1}>-</Text>
              <Text style={responsiveStyle.qunText2}>0</Text>
              <Text style={responsiveStyle.qunText1}>+</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={responsiveStyle.container}>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={handleRenderItem}
        style={responsiveStyle.categories}
        contentContainerStyle={responsiveStyle.contentStyle}
      />
      <CustomSearch filter={true} />
      <View style={responsiveStyle.commonPadding}>
        <FlatList
          data={products}
          showsVerticalScrollIndicator={false}
          renderItem={handleProductsRender}
          contentContainerStyle={responsiveStyle.products}
          ListEmptyComponent={emptyComponent}
        />
      </View>
    </View>
  );
};

export default Shop;
