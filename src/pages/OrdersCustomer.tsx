import React, { Component } from "react";
import { View, FlatList, ActivityIndicator, StatusBar, Text, TouchableOpacity, KeyboardAvoidingView, Platform, Modal, Alert, AsyncStorage } from "react-native";
import { NavigationScreenProp, NavigationState, ScrollView, NavigationEvents } from "react-navigation";
import { connect } from "react-redux";
import { HeaderLeftRight } from "../components";
import { Input } from "react-native-elements";
import styles from "./styles";
import { GetOrders, GetOrdersMore } from "../redux/actions/orderAction";
import { AppState } from "../redux/store";
import { IOrderItem } from "../redux/models/orderModel";
import Icon from "react-native-vector-icons/Ionicons";

import { Formik } from "formik";
import * as Yup from "yup";
import { AddCash } from "../redux/actions/addCashAction";
import { orderDelete } from "../redux/actions/deleteOrderAction"
import RBSheet from "react-native-raw-bottom-sheet";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  orders: IOrderItem[];
  takeTotalAmount: number;
  tookTotalAmount: number;
  restTotalAmount: number;
  isOrderLoading: boolean;
  loadingMore: boolean;
  isSuccess :boolean;
  GetOrders: (customerId: number, pageIndex: number, pageSize: number) => void;
  GetOrdersMore: (customerId: number, pageIndex: number, pageSize: number) => void;
  AddCash: (orderId: number, amount: string) => void;
  orderDelete: (orderId: number) => void;
  RbSheet: RBSheet;
}

interface amountData {
  amount: string
}

interface State {
  refreshing: boolean;
  modalVisible: boolean;
  orderId: number;
  amount: number;
  modalAmountVisible: boolean;
  modalPriceVisible: boolean;
  unitPrice: number;
  count: number;
  productId: number;
  productName: string;
  page: number;
  isPaid:boolean;
}

const girdiler = Yup.object().shape({

});

const initialValues: amountData = {
  amount: "",
}


class OrdersCustomer extends Component<Props, State> {
  static navigationOptions = ({ navigation }: Props) => {
    return {
      title: 'Müşteri Siparişleri',
      headerRight:
        <TouchableOpacity style={{ marginRight: 20 }} onPress={() => navigation.navigate("AddOrder", { customerId: navigation.getParam("customerId") })}>
          <Icon name="ios-add" size={40} style={{ color: 'white' }} />
        </TouchableOpacity>
      ,
      headerStyle: {
        backgroundColor: '#2B6EDC',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }
  };
  OrderSheet: any;
  CustomerSheet: any;
  AmountSheet: any;

  constructor(props: Props) {
    super(props);
    this.state = {
      refreshing: false,
      modalVisible: false,
      orderId: 0,
      amount: 0,
      modalAmountVisible: false,
      modalPriceVisible: false,
      unitPrice: 0,
      count: 0,
      productId: 0,
      productName: "",
      page: 0,
      isPaid:false,
    };
  }

  componentWillMount() {
    this.props.GetOrders(this.props.navigation.getParam("customerId"), 1, 10);
    this.setState({ refreshing: false });
  }

  onRefresh() {
    this.setState({ refreshing: true });
    this.setState({ page: 1 });
    this.props.GetOrders(this.props.navigation.getParam("customerId"), 1, 10);
    this.setState({ refreshing: false });
  }

  deleteOrderAlert() {
    //function to make three option alert
    AsyncStorage.getItem("UserType").then((value) => {
      if (value === "2") {

        Alert.alert(
          //title
          'Hata',
          //body
          'Sipariş silme yetkiniz bulunmamaktadır',
          [
            { text: 'Tamam' },
          ],
          { cancelable: false }
        );
        this.closeModal();


      }
      else {
        Alert.alert(
          //title
          'Sipariş Silme İşlemi',
          //body
          'Siparişi silmek istiyor musunuz?',
          [
            { text: 'Geri Gel' },
            { text: 'Evet', onPress: () => this.deleteSelectedOrder() },
          ],
          { cancelable: false }
        );
      }


    });


  }

  editOrder() {
    this.closeModal();
    this.props.navigation.navigate("EditOrder", {
      customerId: this.props.navigation.getParam("customerId")
      , orderId: this.state.orderId,
      unitPrice: this.state.unitPrice,
      count: this.state.count,
      productId: this.state.productId,
      productName: this.state.productName
    });
  }

  addCash() {
    this.OrderSheet.close();
    this.AmountSheet.open();

  }

  openModal(orderId: number, unitPrice: number, count: number, productId: number, productName: string,isPaid:boolean) {
    this.setState({
      orderId: orderId,
      unitPrice: unitPrice,
      count: count,
      productId: productId,
      productName: productName,
      isPaid: isPaid,
    });
    this.OrderSheet.open();
  }

  closeModal() {
    this.setState({ modalVisible: false });
  }

  openAmountModal() {
    this.setState({ modalAmountVisible: true });
  }

  closeAmountModal() {
    this.setState({ modalAmountVisible: false });
  }

  closePriceModal() {
    this.setState({ modalPriceVisible: false });
  }

  openPriceModal() {
    this.setState({ modalPriceVisible: true });
  }

  goToNewPricePage() {
    this.closePriceModal();
    this.props.navigation.navigate("NewPricePage", { customerId: this.props.navigation.getParam("customerId") });
  }

  goToDefinedPrice() {
    this.closePriceModal();
    this.props.navigation.navigate("CustomerDefinedPricePage", { customerId: this.props.navigation.getParam("customerId") });
  }

  odemeAl(values: amountData) {
    this.props.AddCash(this.state.orderId, values.amount.replace(",","."));
    this.AmountSheet.close();
    this.onRefresh();

  }

  deleteSelectedOrder() {
    const { orderDelete } = this.props;
    this.closeModal();
    orderDelete(this.state.orderId);
    this.props.GetOrders(this.props.navigation.getParam("customerId"), 1, 8);
    this.setState({ refreshing: false });
    this.onRefresh();
  }

  _renderView() {
    const { orders, isOrderLoading, navigation } = this.props;
    if (isOrderLoading) {
      return (<ActivityIndicator></ActivityIndicator>);
    }
    else {
      return (<FlatList
        refreshing={this.state.refreshing}
        onRefresh={() => this.onRefresh()}
        data={this.props.orders}
        renderItem={({ item }) =>
          <View style={styles.orderContainer}>
            <View style={styles.row_cell1}>
              <View style={styles.row_cell3}>
                <Text style={styles.urunAdiText}>{item.productName}</Text>
                <Text style={styles.tarihText}>{item.dateTime.slice(8, 10) + "/" + item.dateTime.slice(5, 7) + "/" + item.dateTime.slice(0, 4) + " " +
                  item.dateTime.slice(11, 16)}</Text>
                <TouchableOpacity
                  style={styles.iconButtonOrder}
                  onPress={() => this.openModal(item.orderId, item.unitPrice, item.count, item.productId, item.productName,item.isPaid)}>
                  <Icon name="md-more" size={24} color={"#C4B47B"} />
                </TouchableOpacity>
              </View>
              <View style={styles.row_cell3}>
                <Text style={styles.urunAdetText}>Adet: {item.count}</Text>
                <Text style={styles.birimFiyatText}>Birim Fiyat: {item.unitPrice} TL</Text>
                <Text style={styles.toplamFiyatText}>Toplam Fiyat:{item.totalPrice} TL</Text>
              </View>
              <View style={styles.row_cell3}>
                <Text style={styles.alınanParaText}>Alınan Para: {item.tookTotalPrice} TL</Text>
                <Text style={styles.kalanParaText}>Kalan Para: {item.restAmount} TL</Text>
              </View>
            </View>


          </View>}
        keyExtractor={(item, index) => String(index)}
        onEndReached={() => {
          var pagenew = this.state.page + 1;
          this.setState({ page: pagenew });
          if (pagenew == 1) {
            pagenew = pagenew + 1;
            this.setState({ page: pagenew });
          }
          this.props.GetOrdersMore(this.props.navigation.getParam("customerId"), pagenew, 3);

        }}
        onEndReachedThreshold={0.5}
        initialNumToRender={8}
        ListFooterComponent={
          this.props.loadingMore ? (
            <View>
              <ActivityIndicator />
            </View>
          ) : null
        }
      />);
    }
  }
  _renderCustomerSheetContent(){
    return ( <View style={styles.SheetContainer}>
      <TouchableOpacity style={styles.SheetItemContainer}    onPress={() => {
                this.CustomerSheet.close();
        this.goToNewPricePage();}}>
        <Icon name="ios-add" size={30} style={styles.SheetItemIcon}></Icon>
        <Text style={styles.SheetItemText}>
          Yeni Fiyat Ekle
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.SheetItemContainer}   onPress={() => {
        this.CustomerSheet.close();
        this.goToDefinedPrice();}}>
        <Icon name="ios-list" size={30} style={styles.SheetItemIcon}></Icon>
        <Text style={styles.SheetItemText}>
          Tanımlı Fiyatlar
        </Text>
      </TouchableOpacity>

    </View>);
  }

  _renderAddAmountSheetContent(){
    return(<View style={styles.SheetAmountContainer}>
          <Formik
            initialValues={initialValues}
            validationSchema={girdiler}
            onSubmit={values => this.odemeAl(values)}
          >
            {props => {
              return (
                <View style={{flexDirection:"row"}}>
                  <View style={styles.inputFiyatContainer}>
                    <Input
                      containerStyle={{ width: '80%' }}
                      style={styles.inputFiyat}
                      placeholder="Ürün Fiyatı"
                      placeholderTextColor="#9A9A9A"
                      value={props.values.amount + ""}
                      autoCapitalize="none"
                      keyboardType="numeric"
                      onChangeText={props.handleChange("amount")}
                      onBlur={props.handleBlur("amount")}
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

  _renderOrderSheetContent(){
    return ( <View style={styles.SheetContainer}>
                <TouchableOpacity style={styles.SheetItemContainer}
                  onPress={() => {
                    this.OrderSheet.close();
                    this.addCash();
                  }}>
                    <Icon name="ios-add" size={30} style={styles.SheetItemIcon}></Icon>
                  <Text style={styles.SheetItemText}
                  >Ödeme Ekle</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.SheetItemContainer}
                  onPress={() => {
                    this.OrderSheet.close();
                    this.editOrder();
                    }}>
                           <Icon name="ios-arrow-round-forward" size={30} style={styles.SheetItemIcon}></Icon>
                  <Text style={styles.SheetItemText}
                  >Düzenle</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.SheetItemContainer}
                  onPress={() => {
                    // this.OrderSheet.close();
                    this.deleteOrderAlert();
                  }}>
                         <Icon name="ios-trash" size={30} style={styles.SheetItemIcon}></Icon>
                  <Text style={styles.SheetItemText}
                  >Sil</Text>
                </TouchableOpacity>
    </View>);
  }

  render() {

    const { navigation } = this.props;

    var nameSurname: string = this.props.navigation.getParam("nameSurname");
    var companyName: string = this.props.navigation.getParam("companyName");

    return (
      <View style={styles.container}>
        <NavigationEvents onWillFocus={() => this.props.GetOrders(this.props.navigation.getParam("customerId"), 1, 10)} />
        <StatusBar backgroundColor="#2B6EDC" />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <RBSheet
          ref={ref => {
            this.CustomerSheet = ref;
          }}
            height={250}
            duration={200}
            customStyles={{
              container: {
                justifyContent: "flex-start",
                alignItems: "flex-start",
                paddingLeft:20
              }
            }}
          >
           {this._renderCustomerSheetContent()}
          </RBSheet>

          <RBSheet
          ref={ref => {
            this.OrderSheet = ref;
          }}
            height={250}
            duration={200}
            customStyles={{
              container: {
                justifyContent: "flex-start",
                alignItems: "flex-start",
                paddingLeft:20
              }
            }}
          >
           {this._renderOrderSheetContent()}
          </RBSheet>

          
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
                paddingLeft:20
              }
            }}
          >
           {this._renderAddAmountSheetContent()}
          </RBSheet>


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
                              containerStyle={{ width: '70%' }}
                              style={styles.inputFiyat}
                              placeholder="Ürün Fiyatı"
                              placeholderTextColor="#9A9A9A"
                              value={props.values.amount + ""}
                              autoCapitalize="none"
                              keyboardType="numeric"
                              onChangeText={props.handleChange("amount")}
                              onBlur={props.handleBlur("amount")}
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

   
          <View style={styles.order_ustbilgi_row}>
            <View style={styles.customerDetailHeader1}>
              <Text style={styles.musteri_adi}>{nameSurname}</Text>
              <Text style={styles.alt_bilgi}>{companyName}</Text>
            </View>
            <View style={styles.customerDetailHeader2}>
              <TouchableOpacity
                style={styles.iconButtonOrderCustomer}
                onPress={() => this.CustomerSheet.open()}
              >
                <Icon name="ios-more" size={40}></Icon>
              </TouchableOpacity>
            </View>
            <View style={styles.customerDetailHeader3}>
              <Text style={styles.paratextToplamDetail}><Icon name="ios-cash" style={{ fontSize: 20, color: "green" }}></Icon> {this.props.navigation.getParam("totalAmount")} </Text>

              <View style={styles.customerDetailHeader4}>

                <Text style={styles.paratextalınanDetail}>{this.props.navigation.getParam("displayTookTotalAmount")} Alınan</Text>
                <Text style={styles.paratextkalanDetail} >{this.props.navigation.getParam("restTotalAmount")}  Kalan</Text>
              </View>

            </View>

          </View>
          <View style={{ marginTop: 10 }}></View>
        </KeyboardAvoidingView>
        {this._renderView()}
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  isOrderLoading: state.orders.isOrderLoading,
  orders: state.orders.orders,
  takeTotalAmount: state.orders.takeTotalAmount,
  tookTotalAmount: state.orders.tookTotalAmount,
  restTotalAmount: state.orders.restTotalAmount,

});

function bindToAction(dispatch: any, ) {
  return {
    GetOrders: (customerId: number, pageIndex: number, pageSize: number) =>
      dispatch(GetOrders(customerId, pageIndex, pageSize)),
    GetOrdersMore: (customerId: number, pageIndex: number, pageSize: number) =>
      dispatch(GetOrdersMore(customerId, pageIndex, pageSize)),
    AddCash: (orderId: number, amount: string) =>
      dispatch(AddCash(orderId, Number(amount))),
    orderDelete: (orderId: number) =>
      dispatch(orderDelete(orderId)),
  };
}

export default connect(
  mapStateToProps,
  bindToAction
)(OrdersCustomer);