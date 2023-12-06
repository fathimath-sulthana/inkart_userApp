/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/react-in-jsx-scope */
import {useEffect, useState} from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import style from './style';
import {useDimensionContext} from '../../context';
import CustomSearch from '../../components/CustomSearch';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import CommonHeaderLeft from '../../components/CommonHeaderLeft';
import firestore from '@react-native-firebase/firestore';
import {useSelector} from 'react-redux';
import colors from '../../components/common/colors';

const Orders = () => {
  const navigation = useNavigation();
  const dimension = useDimensionContext();
  const userId = useSelector(state => state.userId);
  const responsiveStyle = style(dimension.windowWidth, dimension.windowHeight);
  const [ordersArray, setOrdersArray] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      getOrders();
    }
  }, [isFocused]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <CommonHeaderLeft />,
    });
  }, []);

  const getOrders = async () => {
    await firestore()
      .collection('Orders')
      .where('userId', '==', userId)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          setOrdersArray([]);
        } else {
          const objArray = [];
          snapshot?.docs.forEach(document => {
            if (document.exists) {
              const result = {id: document.id, ...document?.data()};
              objArray.push(result);
            }
          });
          setOrdersArray(objArray);
        }
      });
  };

  const handleSearch = async text => {
    await firestore()
      .collection('Orders')
      .where('userId', '==', userId)
      .orderBy('orderId')
      .startAt(String(text))
      .endAt(String(text) + '\uf8ff')
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          setOrdersArray([]);
        } else {
          const objArray = [];
          snapshot?.docs.forEach(document => {
            if (document.exists) {
              const result = {id: document.id, ...document?.data()};
              objArray.push(result);
            }
          });
          setOrdersArray(objArray);
        }
      });
  };

  const navigateToDetails = item => {
    navigation.navigate('OrderDetails', {item: item});
  };

  return (
    <View style={responsiveStyle.container}>
      <CustomSearch
        filter={true}
        placeholder={'Search using order id'}
        mike={false}
        onChangeText={handleSearch}
      />
      <FlatList
        data={ordersArray}
        extraData={ordersArray}
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
                No data
              </Text>
            </View>
          );
        }}
        contentContainerStyle={{paddingBottom: 20}}
        renderItem={({item}) => {
          return (
            <TouchableOpacity
              onPress={() => navigateToDetails(item)}
              style={responsiveStyle.flatView}>
              <View style={responsiveStyle.innerView}>
                <View>
                  <Text style={responsiveStyle.orderId}>
                    ID: {item.orderId}
                  </Text>
                  <Text style={responsiveStyle.orderDate}>
                    Ordered on: {item.created}
                  </Text>
                  <Text style={responsiveStyle.address}>{item.address1}</Text>
                  <Text style={responsiveStyle.address}>{item.address2}</Text>
                  <Text style={responsiveStyle.paidText}>
                    Paid:{' '}
                    <Text style={responsiveStyle.greenText}>
                      {item.totalAmount}
                    </Text>
                    , Items:{' '}
                    <Text style={responsiveStyle.greenText}>
                      {item.cartItems.length}
                    </Text>
                  </Text>
                </View>
                <Image
                  source={require('../../assets/images/map.webp')}
                  style={responsiveStyle.mapImage}
                />
              </View>
              <View style={responsiveStyle.bottomView}>
                <Text style={responsiveStyle.bottomText}>Order Shipped</Text>
                <Text style={responsiveStyle.bottomText}>
                  Rate & Review Products
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item, index) => String(index)}
      />
    </View>
  );
};

export default Orders;
