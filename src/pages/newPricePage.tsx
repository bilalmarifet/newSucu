//bu sayfa henüz oluşturulmadı.
import React, { Component } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { Formik } from "formik";
import * as Yup from "yup";
import styles from "./styles";
import { HeaderLeft } from "../components";
import RNPickerSelect from 'react-native-picker-select';
import Icon from "react-native-vector-icons/Ionicons";
import { connect } from "react-redux";
import { AppState } from "../redux/store";
import { GetCustomerProduct } from "../redux/actions/customerPriceGetProductAction";
import { ICustomerPriceProductItem } from "../redux/models/customerPriceProductModel";
import {customerPriceAdd} from "../redux/actions/customerpriceAddAction";
import {ICustomerPriceItem} from "../redux/models/addCustomerPriceModel";
import { Input } from "react-native-elements";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  isProductLoading : boolean;
  products : ICustomerPriceProductItem[];
  GetCustomerProduct : (customerId:number) => void;
  customerPriceAdd : (productId:number, customerId:number,price:number)=>void;
  isSuccees : boolean;
  AddOrderMessage: string;
}

interface State {
    productId:number,
    customerId:number;  
    price:string,
}

interface Item {
  label: string;
  value: number;
  key?: string | number;
  color?: string;
}

interface input{
  price:string,
}

const girdiler = Yup.object().shape({
  
});
class addOrder extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      productId:0,
      customerId:this.props.navigation.getParam("customerId"),
      price:"",
    };
  }

  static navigationOptions =  ({navigation}:Props) => {
    return {
  
      title: 'Yeni Fiyat',
 
  
  
    headerStyle: {
      backgroundColor: '#2B6EDC',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  
    }
  
    
  };



  yeniFiyat(values:input){
    const { customerPriceAdd } = this.props;
    console.log(Number(values.price.replace(",",".")))
    
      customerPriceAdd(this.state.productId, this.state.customerId, Number(values.price.replace(",",".")));
      this.props.navigation.navigate("OrdersCustomer");
      Alert.alert(
        //title
        'Yeni Fiyat Belirlendi!',
        //body
        '',
        [
          {text: 'Tamam'}
        ],
        { cancelable: false }
      );      
  }



  OrderInfo(productId:number){
    this.setState({
      productId: productId,
    })
  }
  
  PickerMenuCreate(){
    var PickerModel :Item[] = [];
      
      this.props.products.forEach((product:ICustomerPriceProductItem) => {
            var productItem : Item={
                label : product.productName,
                value :product.productId,
            }
            PickerModel.push(productItem);         
      });

      return PickerModel;
  }

  componentWillMount() {
    this.props.GetCustomerProduct(this.state.customerId);
    
  }

  render() {
    const initialValues:input={
      price:this.state.price,
    }

    const placeholder = {
      label: 'Ürün Seçiniz...',
      value: '',
      color: '#2B6EDC',

    };

    return (
      <View style={styles.addCustomerContainer}>
        <StatusBar backgroundColor="#2B6EDC"/>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView bounces={false}>      
            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={girdiler}
              onSubmit={values => this.yeniFiyat(values)}
            >
              {props => {
                return (
                  <View>
                    <View>
                    </View>
                    <View style={styles.inputContainer}>
                    <View style={styles.input}>
                    <RNPickerSelect

                      style={styles.pickerSelectStyles}
                      placeholder={placeholder}
                      onValueChange={(value) => this.OrderInfo(value)}
                      items={this.PickerMenuCreate()}
                      textInputProps={{ underlineColor: 'yellow' }}
                      Icon={() => {
                        return <Icon name="md-arrow-down" size={24} color="gray" style={{top:15}} />;
                      }}
                    />
                    </View>
                    <View style={styles.input}>
                      <Input
                        
                        placeholder="Ürün Fiyatı"
                        placeholderTextColor="#9A9A9A"
                        keyboardType="numeric"
                        value={props.values.price}
                        onChangeText={props.handleChange("price")}
                        onBlur={props.handleBlur("price")}
                      />
                      </View>
                      <TouchableOpacity style={styles.newPriceButtonContainer}>
                        <Text style={styles.amountButtonText}
                        onPress={props.handleSubmit}
                        >Yeni Fiyat Ekle</Text>
                      </TouchableOpacity>

                    </View>
                  </View>
                );
              }}
            </Formik>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const mapStateToProps = (state : AppState) => ({
  isProductLoading : state.products.isProductLoading,
  products : state.customerPriceGetProduct.products,
  isSuccees: state.addCustomerPrice.isSuccess,
})
function bindToAction(dispatch: any) {
  return {
    GetCustomerProduct: (customerId:number) =>
    dispatch(GetCustomerProduct(customerId)),
    customerPriceAdd: (productId:number, customerId:number,price:number) =>
    dispatch(customerPriceAdd(productId,customerId,price))
  };
}

export default connect(
  mapStateToProps,
  bindToAction
)(addOrder);