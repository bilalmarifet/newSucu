import React, { Component } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { CheckBox, Input } from 'react-native-elements'
import { NavigationScreenProp, NavigationState, } from "react-navigation";
import { Formik, setNestedObjectValues } from "formik";
import * as Yup from "yup";
import styles from "./styles";
import { HeaderLeft } from "../components";
import { productEdit } from "../redux/actions/productEditAction";
import { AppState } from '../redux/store'
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
// import { Icon } from "react-native-vector-icons/Icon";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  isSuccees : boolean;
  productEdit : (id:number ,status : boolean , productName : string, productCode: string,price:number ) => void;
  ProductEditMessage: string;
  product: productData;
}

interface productData {
    productName : string;
    productCode: string;
    price:string;
}

interface state{
  status:boolean
}

const girdiler = Yup.object().shape({
  productName: Yup.string()
  .matches(/./g)
  .min(1)
  .max(30)
  .required(),
  productCode: Yup.string()
  .matches(/./g)
  .min(1)
  .max(30)
  .required(),
  productStatus: Yup.boolean()
  .required(),
});



class editProduct extends Component<Props,state> {

  
  static navigationOptions =  ({navigation}:Props) => {
    return {

      title: 'Ürün Bilgilerini Düzenle',
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


  constructor(props: Props) {
    super(props);
    this.state = {
      status:false,
    };
  }

  componentWillMount(){
    this.setState({
      status:this.props.navigation.getParam("productStatus"),
    })
  }

  handleAlert(){
      this.props.navigation.navigate("Products");
      Alert.alert(
        //title
        'Ürün Düzenleme Başarılı!',
        //body
        '',
        [
          {text: 'Tamam'}
        ],
        { cancelable: false }
      );      
  }

  handleEditProduct(values: productData) {
    const { productEdit } = this.props;
    productEdit(
      this.props.navigation.getParam("productId"),
    this.state.status, 
    values.productName,
    values.productCode,
    Number(values.price.replace(",",".")));
    this.handleAlert();   
  };

  render() {
    const { navigation } = this.props;
    var productName:string=this.props.navigation.getParam("productName");
    var productCode:string=this.props.navigation.getParam("productCode");
    var price:string=this.props.navigation.getParam("price")+"";
    var productStatus:boolean=this.props.navigation.getParam("productStatus");
    return (
      <View style={styles.addCustomerContainer}>
        <StatusBar backgroundColor="#2B6EDC"/>


        <View style={{marginBottom:30}}></View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView bounces={false}>
            <Formik
              initialValues={{productName,productCode,price,productStatus}}
              validationSchema={girdiler}
              onSubmit={values => this.handleEditProduct(values)}
            >
              {props => {
                return (                
                  <View>
                    <View style={styles.inputContainer}> 
                    <Text>Ürün Adı</Text>
                      <Input
                        style={styles.input}
                        placeholder="Ürün Adı"
                        placeholderTextColor="#9A9A9A"
                        value={props.values.productName}
                        autoCapitalize="words"
                        onChangeText={props.handleChange("productName")}
                        onBlur={props.handleBlur("productName")}                   
                      />
                      <Text>Ürün Kodu</Text>
                      <Input
                        style={styles.input}
                        placeholder="Ürün Kodu"
                        placeholderTextColor="#9A9A9A"
                        value={props.values.productCode}
                        autoCapitalize="words"
                        onChangeText={props.handleChange("productCode")}
                        onBlur={props.handleBlur("productCode")}
                        
                      />
                      <Text>Fiyat</Text>
                      <View style={styles.inputFiyatContainer}>
                      <Input
                      containerStyle = {{width:'70%'}}
                        style={styles.inputFiyat}
                        placeholder="Ürün Fiyatı"
                        placeholderTextColor="#9A9A9A"
                        value={props.values.price}
                        autoCapitalize="none"
                        keyboardType= "numeric"
                        onChangeText={props.handleChange("price")}
                        onBlur={props.handleBlur("price")}      
                      />
                      <Text style={styles.inputFiyatText}>TL</Text>
                      </View>
                      <CheckBox
                      containerStyle={styles.chechBoxContainer}
                      center
                      iconRight
                      title='Ürün Kullanılmaya Devam Edecek'
                      checkedIcon='dot-circle-o'
                      uncheckedIcon='circle-o'
                      checked={this.state.status}
                      onPress={() => this.setState({status: !this.state.status})}
                    />
                      <TouchableOpacity 
                        style={styles.customerEditButton}
                        onPress={props.handleSubmit}>
                        <Text style={styles.CustomerEditButtonText}>Düzenle</Text>               
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
  isSuccees : state.productEdit.isSuccess,
  ProductEditMessage :state.productEdit.ProductEditMessage
})

function bindToAction(dispatch : any) {
  return {
    productEdit : (id:number ,status : boolean , productName : string, productCode: string,price:number ) =>
    dispatch(productEdit(id,status,productName,productCode,price))   
  };
}

export default connect(mapStateToProps,bindToAction)(editProduct);