import React, { Component } from "react";
import { View,
        FlatList, 
        StatusBar,  
        TouchableOpacity, 
        ActivityIndicator,  
        KeyboardAvoidingView, 
        Platform,
        Modal,
        Text,
        Alert,} from "react-native";
import { NavigationScreenProp, NavigationState, ScrollView } from "react-navigation";
import { connect } from "react-redux";
import { HeaderLeftRight } from "../components";
import styles from "./styles";
import { AppState } from "../redux/store";
import { IDefinedCustomerPriceItem } from "../redux/models/customerDefinedPriceModel";
import Icon from "react-native-vector-icons/Ionicons";
import {getCustomerPrice} from "../redux/actions/customerDefinedPriceAction"
import {Input} from "react-native-elements"
import { Formik } from "formik";
import * as Yup from "yup";
import {customerPriceEdit} from "../redux/actions/customerPriceEditAction"
import RBSheet from "react-native-raw-bottom-sheet";


interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  isLoading : boolean;
  products : IDefinedCustomerPriceItem[];
  getCustomerPrice : (customerId:number) => void;
  customerPriceEdit : (price:number,customerPriceId:number) => void;
}

interface State {
  modalVisible: boolean;
  refreshing:boolean;
  modalAmountVisible:boolean;
  customerPriceId:number;
  unitPrice:number;
}

const girdiler = Yup.object().shape({

  });

interface priceData {
    price: string
  }


  const initialValues:priceData = {
    price:"",
}
  

class Products extends Component<Props, State> {

  OrderSheet: any;
  AmountSheet: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      modalVisible: false,
      refreshing:false,
      unitPrice:0,
      modalAmountVisible:false,
      customerPriceId:0,
    };
  }

  addCash() {
    this.OrderSheet.close();
    this.AmountSheet.open();

  }



  _renderEmployeeCostSheetContent() {
    return (<View style={styles.SheetAmountContainer}>
      <Formik
        initialValues={{price : ""}}
        // validationSchema={girdiler}
        onSubmit={values => this.odemeAl(values)}
      >
        {props => {
          return (
            <View style={{ flexDirection: "row" }}>
              <View style={styles.inputFiyatContainer}>
                <Input
                  containerStyle={{ width: '80%' }}
                  style={styles.inputFiyat}
                  placeholder="Ürün Fiyatı"
                  placeholderTextColor="#9A9A9A"
                  value={props.values.price }
                  autoCapitalize="none"
                  keyboardType="numeric"
                  onChangeText={props.handleChange("price")}
                  onBlur={props.handleBlur("price")}
                />
              </View>
              <TouchableOpacity
                style={styles.SheetButtonContainer}
                onPress={props.handleSubmit}>
                <Text style={styles.amountButtonText}> Ekle </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      </Formik>
    </View>);

  }

  static navigationOptions =  ({navigation}:Props) => {
    return {
  
      title: 'Müşteriye Özel Ürün Fiyatları',
 
  
  
    headerStyle: {
      backgroundColor: '#2B6EDC',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  
    }
  
    
  };



  componentWillMount() {
    this.props.getCustomerPrice(this.props.navigation.getParam("customerId"));
    this.setState({ refreshing: false });  
  }


  openModal(customerPriceId:number,unitPrice:number) {
    this.setState({modalVisible:true,
                customerPriceId: customerPriceId,
                unitPrice:unitPrice,});

                this.AmountSheet.open();
  }

  closeModal() {
    this.setState({modalVisible:false});
  }

  openAmountModal() {
    this.setState({modalAmountVisible:true});
  }
  
  closeAmountModal() {
    this.setState({modalAmountVisible:false});
    this.componentWillMount();
  }


  editPrice(){
    this.closeModal();
    this.openAmountModal();
  }

  odemeAl(values: priceData){
    console.log(values.price)
      console.log(this.state.customerPriceId)
    this.props.customerPriceEdit(Number(values.price.replace(",",".")),this.state.customerPriceId);
    // this.closeAmountModal();
    this.AmountSheet.close();
    // this.onRefresh();
    // this.componentWillMount();
  }

  onRefresh() {
    this.setState({ refreshing: true });
    this.setState({ refreshing: false });
    // this.componentWillMount();
  }

_renderView(){
  const {products, isLoading,navigation} = this.props;
  if(isLoading){
    return (<ActivityIndicator></ActivityIndicator>);
  }
  else{
    return (<FlatList
      refreshing={this.state.refreshing}
      onRefresh={() => this.onRefresh()}
      data={this.props.products}
      renderItem={({ item })  => (
      <View style={styles.row}>
      <View style={styles.row_cell5}>
        <View style={styles.row_cell1}>
          <Text style={styles.musteri_adi}>{item.productName}</Text>
        </View>
        <View style={styles.row_cell2}>
          <Text style={styles.productUrunfiyatText}>Birim Fiyat: {item.displayUnitPrice}</Text>
        </View>
      </View>
      <TouchableOpacity
          style={styles.iconButtonCustomer}

          onPress={()=>this.openModal(item.customerPriceId,item.unitPrice)}>
          
      <Icon name="md-more" size={24} color={"#C4B47B"} />
      </TouchableOpacity>
      </View>)}
    keyExtractor={item => item.productId.toString()}
  />);
  }
}
  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#2B6EDC"/>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >


<RBSheet
              ref={ref => {
                this.AmountSheet = ref;
              }}
              height={100}
              duration={200}
              customStyles={{
                container: {
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  paddingLeft: 20
                }
              }}
            >
              {this._renderEmployeeCostSheetContent()}
            </RBSheet>


         <Modal            
              visible={this.state.modalVisible}
              animationType={'slide'}
              onRequestClose={() => this.closeModal()}
              transparent={true}
          >
            <View style={styles.modalContainer}>
              <View style={styles.innerContainer}>
                <TouchableOpacity style={styles.modalCancelButtonContainer}
                  onPress={() => this.closeModal()}>
                  <Icon name="md-close" size={30} color={"#6E6E6E"} />
                </TouchableOpacity>
              <TouchableOpacity style={styles.modalEditButtonContainer}
                  onPress={()=>this.editPrice()}>
                  <Text style={styles.modalEditButtonText}
                  >Düzenle</Text>
              </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal            
              visible={this.state.modalAmountVisible}
              animationType={'slide'}
              onRequestClose={() => this.closeAmountModal()}
              transparent={true}
          >
            <View style={styles.modalContainer}>
              <View style={styles.innerContainer}>
                <TouchableOpacity style={styles.modalCancelButtonContainer}
                  onPress={() => this.closeAmountModal()}>
                  <Icon name="md-close" size={30} color={"#6E6E6E"} />
                </TouchableOpacity>
                <ScrollView bounces={false}>
                <Formik
                  initialValues={initialValues}
                  validationSchema={girdiler}
                  onSubmit={values => this.odemeAl(values)}
                >
                  {props => {
                return (                
                  <View>
                      <View style={styles.inputFiyatContainer}>
                      <Input
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
                      <TouchableOpacity 
                        style={styles.amountButtonContainer}
                        onPress={props.handleSubmit}>
                        <Text style={styles.amountButtonText}> Ekle </Text>               
                      </TouchableOpacity>
                  </View>
                );
              }}
            </Formik>
            </ScrollView>
              </View>
            </View>
          </Modal>

        <View style={{marginTop:10}}></View>
        </KeyboardAvoidingView>
      {this._renderView()} 
      </View>
    );
  }
}

const mapStateToProps = (state : AppState) => ({
  isLoading : state.customerDefinedPrice.isProductLoading,
  products : state.customerDefinedPrice.products,
})
function bindToAction(dispatch: any) {
  return {
    getCustomerPrice: (customerId:number) =>
    dispatch(getCustomerPrice(customerId)),
    customerPriceEdit: (price:number,customerPriceId:number) =>
    dispatch(customerPriceEdit(price,customerPriceId)),
  };
}

export default connect(
  mapStateToProps,
  bindToAction
)(Products);
