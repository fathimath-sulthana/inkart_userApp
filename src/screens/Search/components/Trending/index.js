/* eslint-disable react/react-in-jsx-scope */
import {useEffect, useState} from 'react';
import {View, Text, FlatList, Image} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import style from './style';
import {useDimensionContext} from '../../../../context';
import colors from '../../../../components/common/colors';
import {useSelector} from 'react-redux';

const Trending = () => {
  const dimension = useDimensionContext();
  const responsiveStyle = style(dimension.windowWidth, dimension.windowHeight);
  const categories = useSelector(state => state.categories);
  return (
    <View style={responsiveStyle.main}>
      <Text style={responsiveStyle.title}>Trending Category</Text>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => String(index)}
        contentContainerStyle={responsiveStyle.flatList}
        renderItem={({item, index}) => {
          const categoriesColor =
            index % 4 === 0
              ? colors.category1
              : index % 4 === 1
              ? colors.category2
              : index % 4 === 2
              ? colors.category3
              : index % 4 === 3
              ? colors.category4
              : colors.category1;
          return (
            <View
              style={[
                responsiveStyle.imageCon,
                {backgroundColor: categoriesColor},
              ]}>
              <Image source={{uri: item.image}} style={responsiveStyle.image} />
            </View>
          );
        }}
      />
    </View>
  );
};

export default Trending;
