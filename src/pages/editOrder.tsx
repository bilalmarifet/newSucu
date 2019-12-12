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
import { GetProducts } from "../redux/actions/productAction";
import { IProductItem } from "../redux/models/productAddModel";
import { AddOrder } from "../redux/actions/addOrderAction";
import { IAddOrderItem } from "../redux/models/addOrderModel";
import {GetProduct} from "../redux/actions/productForCustomerAction";
import { IProductForCustomerItem } from "../redux/models/productForCustomerModel";
import {EditOrder} from "../redux/actions/editOrderAction";
import { Input, CheckBox } from "react-native-elements";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  isProductLoading : boolean;
  products : IProductItem[];
  GetProducts : () => void;
  AddOrder : (productId:number, customerId:number,unitPrice:number, count:number)=>void;
  isSuccees : boolean;
  AddOrderMessage: string;
  GetProduct : (productId:number,customerId:number) => void;
  product: IProductForCustomerItem;
  EditOrder : (orderId:number,productId:number, customerId:number,unitPrice:number, count:number,isPaid:boolean) => void
}

interface State {
  productName:string,
  productCode:string,
  unitPrice:string,
  date:string,
  productId:number,
  count:string,
  isSuccess: boolean,
  isPaid:boolean,
}

interface Item {
  label: string;
  value: any;
  key?: string | number;
  color?: string;
}

interface input{
  count:string,
  unitPrice:string,
}

const girdiler = Yup.object().shape({
  count: Yup.number()
  .positive()
  .required(),
  unitPrice: Yup.number()
  .positive()
  .required()
  .moreThan(0),
});
class editOrder extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      productId:0,
      productName:"",
      productCode:"",
      unitPrice:"",
      date:"",
      count:"",
      isSuccess:false,
      isPaid:false
    };
  }


  static navigationOptions =  ({navigation}:Props) => {
    return {

      title: 'Sipariş Düzenle',
//       headerRight: <TouchableOpacity style={{marginRight:20}}  onPress={()=> navigation.navigate('CustomerAdd')}>
// <Icon name="ios-add" size={40} style={{color:'white'}} />
//       </TouchableOpacity>,


    headerStyle: {
      backgroundColor: '#2B6EDC',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },

    }

    
  };

  
  componentDidUpdate(){}

  handleAlert(){
      this.props.navigation.navigate("OrdersCustomer");
      Alert.alert(
        //title
        'Sipariş Düzenlendi!',
        //body
        '',
        [
          {text: 'Tamam'}
        ],
        { cancelable: false }
      );      
  }

  siparisDüzenle(values:input){
    const { AddOrder, navigation, isSuccees, EditOrder} = this.props;
    var customerId = navigation.getParam("customerId");
    EditOrder(this.props.navigation.getParam("orderId"),this.state.productId,customerId,Number(values.unitPrice),Number(values.count),this.state.isPaid)
    this.componentDidUpdate();
    this.componentDidUpdate();
    this.handleAlert()
  }

  OrderInfo(productId:number){
    this.setState({
      productId: productId,
    });
    this.props.GetProduct(productId,this.props.navigation.getParam("customerId"));
  }
  
  PickerMenuCreate(){
    var PickerModel :Item[] = [];
      
      this.props.products.forEach((product:IProductItem) => {
            var productItem : Item={
                label : product.productName,
                value :product.productId,
            }
            PickerModel.push(productItem);         
      });

      return PickerModel;
  }

  componentWillMount() {
    this.props.GetProducts();
    var dateAta:string;
    var date = new Date();
    dateAta = date.toLocaleDateString()+" "+date.toLocaleTimeString();
    this.setState({date:dateAta});

    this.props.GetProduct(this.props.navigation.getParam("productId"),this.props.navigation.getParam("customerId"));
    this.setState({
      productId: this.props.navigation.getParam("productId"),
      isPaid: this.props.navigation.getParam("isPaid"),
    });
    
  }

  render() {
    const initialValues:input={
      count:String(this.props.navigation.getParam("count")),
      unitPrice:String(this.props.product.unitPrice),
    }

    const placeholder = {
      label: this.props.navigation.getParam("productName"),
      value: this.props.navigation.getParam("productId"),
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
              onSubmit={values => this.siparisDüzenle(values)}
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
                      <Text>Ürün Adedi:</Text>
                      <View style={styles.input}>
                      <Input
                        
                        placeholder="Ürün Adedi"
                        placeholderTextColor="#9A9A9A"
                        keyboardType="numeric"
                        value={props.values.count}
                        onChangeText={props.handleChange("count")}
                        onBlur={props.handleBlur("count")}
                      />
                      </View>
                      <Text>Ürün Kodu:</Text>
                      <View style={styles.input}>
                      <Input
                        editable={false}
                        placeholderTextColor="#313033"
                        value={this.props.product.productCode}       
                      />
                      </View>
                      <Text>Birim Fiyat:</Text>
                      <View style={styles.input}>
                      <Input
                        
                        placeholder="Ürün Adedi"
                        placeholderTextColor="#9A9A9A"
                        keyboardType="numeric"
                        value={String(props.values.unitPrice)}
                        onChangeText={props.handleChange("unitPrice")}
                        onBlur={props.handleBlur("unitPrice")}     
                      />
                      </View>
                      <View style={{margin:2}}></View>
                      <CheckBox
                        containerStyle={styles.chechBoxContainer}             
                        title='Peşin Ödeme'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checked={this.state.isPaid}
                        onPress={() => this.setState({ isPaid: !this.state.isPaid })}
                      />

                        <Text style={styles.odenecekText}>Toplam Fiyat: {(Number(props.values.unitPrice) * Number(props.values.count))} TL</Text>
                      <TouchableOpacity style={styles.siparisButtonContainer}>
                        <Text style={styles.amountButtonText}
                        onPress={props.handleSubmit}
                        >Siparişi Düzenle</Text>
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
  products : state.products.products,
  isSuccees: state.editOrder.isSuccess,
  product: state.productForCustomer.product,
})
function bindToAction(dispatch: any) {
  return {
    GetProducts: () =>
    dispatch(GetProducts()),
    EditOrder: (orderId:number,productId:number, customerId:number, unitPrice:number, count:number,isPaid:boolean) =>
    dispatch(EditOrder(orderId,productId, customerId, unitPrice,count,isPaid)),
    GetProduct: (productId:number,customerId:number) =>
    dispatch(GetProduct(productId,customerId)), 
  };
}

export default connect(
  mapStateToProps,
  bindToAction
)(editOrder);