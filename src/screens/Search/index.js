/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
import {ScrollView, View} from 'react-native';
import style from './style';
import CustomSearch from '../../components/CustomSearch';
import OfferProducts from '../../components/OfferProducts';
import Trending from './components/Trending';
import {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import CommonHeaderLeft from '../../components/CommonHeaderLeft';

const Search = () => {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CommonHeaderLeft />,
    });
  }, []);

  return (
    <View style={style.main}>
      <ScrollView
        style={style.container}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}>
        <CustomSearch />
        <Trending />
        <OfferProducts />
      </ScrollView>
    </View>
  );
};

export default Search;
