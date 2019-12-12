import React from "react";
import {
  createStackNavigator,
  createAppContainer,
  createSwitchNavigator,
  createDrawerNavigator,
  createBottomTabNavigator
} from "react-navigation";

import { Dimensions } from "react-native";

const { width } = Dimensions.get("window");

import Icon from "react-native-vector-icons/Ionicons";

import Home from "../screens/AppScreens/Home";
import Blank from "../screens/AppScreens/Blank";
import SideBar from "../screens/AppScreens/SideBar";
import Login from "../screens/AuthScreens/Login";
import AuthLoading from "../screens/AuthLoading";
import Customer from "../pages/customer";
import Employee from "../pages/employee";
import Settings from "../pages/settings";
import addCustomer from "../pages/addCustomer";
import OrdersCustomer from "../pages/OrdersCustomer";
import addOrder from "../pages/addOrder";
import editCustomer from "../pages/editCustomer";
import addProduct from "../pages/addProduct";
import products from "../pages/products";
import editProduct from "../pages/editProduct";
import newPricePage from "../pages/newPricePage";
import customerDefinedPricePage from "../pages/CustomerDefinedPrice"
import editOrder from "../pages/editOrder";
import employee from "../pages/employee";
import addEmployee from "../pages/addEmployee";
import editEmployee from "../pages/editEmployee";
import report from "../pages/report";
import employeeCost from "../pages/employeeCost";
import editEmployeeCost from "../pages/editEmployeeCost";

const EmployeeApp = createStackNavigator(
  {
    Employee: { screen: employee },
    AddEmployee: { screen: addEmployee },
    EditEmployee: { screen: editEmployee },
    EmployeeCost: { screen: employeeCost },
    EditEmployeeCost: { screen: editEmployeeCost },

  },
  {
    // headerMode:"none"
  })

const CustomerApp = createStackNavigator(
  {
    Customer: { screen: Customer },
    CustomerAdd: { screen: addCustomer },
    OrdersCustomer: { screen: OrdersCustomer },
    AddOrder: { screen: addOrder },
    EditCustomer: { screen: editCustomer },
    NewPricePage: { screen: newPricePage },
    CustomerDefinedPricePage: { screen: customerDefinedPricePage },
    EditOrder: { screen: editOrder }
  },
  {
    // headerMode: "none"
  }

);

const SettingsApp = createStackNavigator(
  {
    Settings: { screen: Settings },
    AddProduct: { screen: addProduct },
    EditProduct: { screen: editProduct },
    Products: { screen: products },
    Report: { screen: report },

  },
  {
    // headerMode: "none"
  }
)

const MainStack = createBottomTabNavigator(
  {
    Customer: {
      screen: CustomerApp,
      navigationOptions: {
        tabBarLabel: 'Müşteriler',
        tabBarIcon: () => (
          <Icon name="ios-contacts" size={25} />
        ),
      }
    },
    Employee: {
      screen: EmployeeApp,

      navigationOptions: {
        tabBarLabel: 'Çalışanlar',
        tabBarIcon: () => (
          <Icon name="ios-person" size={25} />
        ),
      },

    },
    Settings: {
      screen: SettingsApp,
      navigationOptions: {
        tabBarLabel: 'Ayarlar',
        tabBarIcon: () => (
          <Icon name="ios-settings" size={25} />
        )
      }
    },
  },
  {
    initialRouteName: "Customer",

  }
);

const LoginScreen = createStackNavigator(
  {
    Login: { screen: Login }
  },
  {
    initialRouteName: "Login",
    headerMode: "none"
  }
);


export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoading,
      LoginScreen: LoginScreen,
      MainStack: MainStack,
      AddCustomer: CustomerApp,
    },
    {
      initialRouteName: "AuthLoading" //createDrawernavigator içindeki bir sayfa buraya yazılamazmış!!!!
    }
  )
);
