/* eslint-disable react/react-in-jsx-scope */
import {useEffect, useState} from 'react';
import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useDimensionContext} from '../../../../context';
import style from './style';
import {useNavigation} from '@react-navigation/native';

const RecentBought = () => {
  const dimensions = useDimensionContext();
  const responsiveStyle = style(
    dimensions.windowWidth,
    dimensions.windowHeight,
  );
  const navigation = useNavigation();
  const [recentItems, setRecentItems] = useState([]);
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
              result.push(doc.data());
            }
          });
          setRecentItems(result);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleProduct = item => {
    navigation.navigate('ProductDetails', {product: item});
  };

  return (
    <View style={responsiveStyle.container}>
      <Text style={responsiveStyle.head}>Buy from Recently Bought</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={recentItems}
        keyExtractor={(item, index) => String(index)}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              onPress={() => handleProduct(item)}
              style={responsiveStyle.contentView}>
              <Image source={{uri: item.image}} style={responsiveStyle.image} />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

export default RecentBought;
