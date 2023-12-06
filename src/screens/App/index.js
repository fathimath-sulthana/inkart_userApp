/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useState, useEffect} from 'react';
import {enableLatestRenderer} from 'react-native-maps';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../Login';
import SignUp from '../SignUp';
import LoginPhone from '../LoginPhone';
import Home from '../Home';
import {DimensionContextProvider} from '../../context';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Categories from '../Categories';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Cart from '../Cart';
import CustomDrawer from '../../components/CustomDrawer';
import CustomFooter from '../../components/CustomFooter';
import Search from '../Search';
import Offers from '../Offers';
import Orders from '../Orders';
import Wishlist from '../Wishlist';
import Account from '../Account';
import style from './style';
import {Provider, useSelector} from 'react-redux';
import {store} from '../../storage/store';
import Splash from '../Splash';
import Shop from '../Shop';
import ProductDetails from '../ProductDetails';
import Review from '../Review';
import AddAddress from '../AddAddress';
import OrderDetails from '../OrderDetails';

const Drawer = createDrawerNavigator();
const AppDrawer = () => {
  return (
    <Drawer.Navigator
      initialRouteName="MyFooter"
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerTitleAlign: 'left',
        headerTitleStyle: style.title,
        headerStyle: {
          height: 70, // Adjust the height as needed
        },
      }}>
      <Drawer.Screen
        name="MyFooter"
        component={AppFooter}
        options={{headerShown: false}}
      />
      <Drawer.Screen name="Categories" component={Categories} />
      <Drawer.Screen name="Orders" component={Orders} />
      <Drawer.Screen name="OrderDetails" component={OrderDetails} />
      <Drawer.Screen name="Wishlist" component={Wishlist} />
      <Drawer.Screen name="Account" component={Account} />
      <Drawer.Screen name="Shop" component={Shop} />
      <Drawer.Screen name="ProductDetails" component={ProductDetails} />
      <Drawer.Screen name="Review" component={Review} />
      <Drawer.Screen name="AddAddress" component={AddAddress} />
    </Drawer.Navigator>
  );
};

const Footer = createBottomTabNavigator();
const AppFooter = () => {
  return (
    <Footer.Navigator
      tabBar={props => <CustomFooter {...props} />}
      screenOptions={{
        headerTitleAlign: 'left',
        headerTitleStyle: style.title,
        headerStyle: {
          height: 70, // Adjust the height as needed
        },
      }}>
      <Footer.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <Footer.Screen name="Categories" component={Categories} />
      <Footer.Screen name="Search" component={Search} />
      <Footer.Screen name="Offers" component={Offers} />
      <Footer.Screen name="Cart" component={Cart} />
    </Footer.Navigator>
  );
};

const Stack = createNativeStackNavigator();
const AppNavigation = () => {
  const [loading, setLoading] = useState(true);
  const isLoggedIn = useSelector(state => state.isLoggedIn);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [isLoggedIn]);

  return (
    <DimensionContextProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {loading ? (
            <Stack.Screen name="Splash" component={Splash} />
          ) : (
            <>
              {isLoggedIn ? (
                <Stack.Screen name="MyDrawer" component={AppDrawer} />
              ) : (
                <>
                  <Stack.Screen name="Login" component={Login} />
                  <Stack.Screen name="SignUp" component={SignUp} />
                  <Stack.Screen name="LoginPhone" component={LoginPhone} />
                </>
              )}
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </DimensionContextProvider>
  );
};

const App = () => {
  useEffect(() => {
    enableLatestRenderer();
  }, []);
  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  );
};

export default App;
