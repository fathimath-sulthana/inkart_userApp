/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/react-in-jsx-scope */
import {useState, useEffect} from 'react';
import {
  ScrollView,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ImageBackground,
  Text,
} from 'react-native';
import style from './style';
import CustomSearch from '../../components/CustomSearch';
import {useDimensionContext} from '../../context';
import firestore from '@react-native-firebase/firestore';
import colors from '../../components/common/colors';
import CommonHeaderLeft from '../../components/CommonHeaderLeft';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';

const Categories = () => {
  const dimension = useDimensionContext();
  const navigation = useNavigation();
  const route = useRoute();
  const responsiveStyle = style(dimension.windowWidth, dimension.windowHeight);
  const categories = useSelector(state => state.categories);
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState(0);
  const {catIndex = 0} = route?.params ?? {};

  useEffect(() => {
    if (catIndex) {
      setActive(catIndex);
    }
  }, [catIndex]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CommonHeaderLeft />,
    });
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
          setProducts(result);
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleCategoryTouch = index => {
    setActive(index);
  };

  const handleProduct = item => {
    navigation.navigate('ProductDetails', {product: item});
  };

  return (
    <View style={responsiveStyle.main}>
      <ScrollView
        style={responsiveStyle.container}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}>
        <CustomSearch />
        <View style={responsiveStyle.rowStyle}>
          {/* sidebar */}
          <View>
            <FlatList
              data={categories}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={responsiveStyle.catFlatStyle}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    style={[
                      responsiveStyle.catTouch,
                      {
                        backgroundColor:
                          index === active ? colors.white : 'transparent',
                      },
                    ]}
                    onPress={() => handleCategoryTouch(index)}>
                    <Image
                      source={{uri: item.image}}
                      style={responsiveStyle.catImage}
                    />
                  </TouchableOpacity>
                );
              }}
            />
          </View>
          {/* content */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <ImageBackground
              source={require('../../assets/images/home1bg.jpg')}
              style={responsiveStyle.backImage}>
              <Text style={responsiveStyle.catName} numberOfLines={1}>
                {categories[active]?.name}
              </Text>
              <Text style={responsiveStyle.catDesc} numberOfLines={3}>
                {categories[active]?.description}
              </Text>
            </ImageBackground>

            <FlatList
              numColumns={3}
              data={products}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={responsiveStyle.proStyle}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    style={responsiveStyle.proContainer}
                    onPress={() => handleProduct(item)}>
                    <View style={responsiveStyle.imageBg}>
                      <Image
                        source={{uri: item.image}}
                        style={responsiveStyle.proImage}
                      />
                    </View>
                    <Text style={responsiveStyle.proName}>{item.name}</Text>
                    <Text style={responsiveStyle.proDesc}>₹ {item.price}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

export default Categories;
