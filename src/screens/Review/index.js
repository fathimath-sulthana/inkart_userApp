/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useRef, useState} from 'react';
import {View, Text, Image, ScrollView} from 'react-native';
import {useDimensionContext} from '../../context';
import style from './style';
import {useNavigation} from '@react-navigation/native';
import CommonHeaderLeft from '../../components/CommonHeaderLeft';
import CommonHeaderRight from '../../components/CommonHeaderRight';
import StarRating from 'react-native-star-rating-widget';
import ActionSheet from 'react-native-actions-sheet';
import colors from '../../components/common/colors';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';

const Review = () => {
  const dimensions = useDimensionContext();
  const navigation = useNavigation();
  const responsiveStyle = style(
    dimensions.windowWidth,
    dimensions.windowHeight,
    dimensions.isPortrait,
  );
  const [rating, setRating] = useState(5);
  const actionSheetRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CommonHeaderLeft type="back" />,
      headerRight: () => (
        <CommonHeaderRight plus={true} handlePlusIcon={openActionSheet} />
      ),
      title: 'Reviews',
    });
  }, []);

  const openActionSheet = () => {
    actionSheetRef.current.show();
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={responsiveStyle.container}>
      <View style={responsiveStyle.reviewBox}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <Image
            source={require('../../assets/images/dummy.png')}
            style={{
              width: 50,
              height: 50,
              resizeMode: 'contain',
              borderRadius: 25,
              overflow: 'hidden',
            }}
          />
          <View>
            <Text
              style={{
                color: colors.black,
                fontFamily: 'Lato-Bold',
                fontSize: 18,
                marginLeft: 10,
              }}>
              Rentric Henvork
            </Text>
            <StarRating starSize={20} rating={rating} onChange={setRating} />
          </View>
        </View>
        <Text
          style={{
            color: colors.black_level_3,
            fontFamily: 'Lato-Regular',
            fontSize: 16,
          }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </Text>
      </View>

      <ActionSheet ref={actionSheetRef}>
        <View style={{padding: 20}}>
          <Text
            style={{fontFamily: 'Lato-Black', fontSize: 22, lineHeight: 50}}>
            Write a Review.
          </Text>
          <StarRating starSize={40} rating={rating} onChange={setRating} />
          <CustomTextInput placeholder="Write here" multiline={true} />
          <CustomButton buttonText={'Submit Review'} type="primary" />
        </View>
      </ActionSheet>
    </ScrollView>
  );
};

export default Review;
