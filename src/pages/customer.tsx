import React, { Component } from "react";
import {
  View,
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert, Button,
} from "react-native";
import { NavigationScreenProp, NavigationState, ScrollView, SafeAreaView, NavigationEvents } from "react-navigation";
import { connect } from "react-redux";
import { Header } from "../components";
import styles from "./styles";
import { GetCustomers, GetCustomerMore } from "../redux/actions/homeAction";
import { AppState } from "../redux/store";
import { ICustomerItem } from "../redux/models/homeModel";
import { Formik } from "formik";
import * as Yup from "yup";
import Icon from "react-native-vector-icons/Ionicons";
import { customerDelete } from "../redux/actions/customerDeleteAction";
import RNPickerSelect from 'react-native-picker-select';
import { Input } from "react-native-elements";
import RBSheet from "react-native-raw-bottom-sheet";
import { stat } from "fs";


interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  isHomeLoading: boolean;
  customers: ICustomerItem[];

  GetCustomers: (orderType: number, searchText: string, dayOfWeek: number, pageIndex: number) => void;
  GetCustomerMore: (orderType: number, searchText: string, dayOfWeek: number, pageIndex: number) => void;

  customerDelete: (customerId: number) =>  void;
  CustomerDeleteIsSuccess: boolean;
  isLoadingCustomerDelete:boolean;
}

interface State {
  modalVisible: boolean;
  refreshing: boolean;
  customerId: number;
  nameSurname: string;
  companyName: string;
  orderType: number;
  dayOfWeek: number;
  searchText: string;
  dayOfWeekCustomer?: number;
  page: number;
  loading: boolean;
  loadingMore: boolean;
  error: boolean;
  customersData: ICustomerItem[];
  fountainCount?: number;
  dayOfWeeks?: string;

}

interface search {
  searchText: string;
}

const initialValues: search = {
  searchText: "",
}

const girdiler = Yup.object().shape({
  searchText: Yup.string()
    .matches(/./g)
    .min(1)
    .max(16)
    .required(),
});

class Customer extends Component<Props, State> {


  static navigationOptions = ({ navigation }: Props) => ({
    title: 'Müşteriler',
    headerRight: <TouchableOpacity style={{ marginRight: 20 }} onPress={() => navigation.navigate('CustomerAdd')}>
      <Icon name="ios-add" size={40} style={{ color: 'white' }} />
    </TouchableOpacity>,
    headerStyle: {
      backgroundColor: '#2B6EDC',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  });
  CustomerListSheet: any;
  // static navigationOptions = ({ navigation }) => {
  //   return {
  //     headerTitle: () => <Text>Müşteriler</Text>,
  //     headerRight: () => (
  //       <TouchableOpacity
  //         onPress={navigation.getParam('increaseCount')}

  //         // color="#fff"
  //       ><Text>sd</Text>a</TouchableOpacity>
  //     ),
  //     headerStyle : {
  //       backgroundColor: '#2B6EDC',
  //       color : 'white'
  //     },

  //     headerTintColor: '#fff',
  //     headerTitleStyle: {
  //       fontWeight: 'bold',
  //     },
  //   };
  // };




  constructor(props: Props) {
    super(props);
    this.state = {
      modalVisible: false,
      refreshing: false,
      customerId: 0,
      nameSurname: "",
      companyName: "",
      orderType: 1,
      dayOfWeek: 0,
      searchText: '',
      dayOfWeekCustomer: 0,
      page: 1,
      loading: true,
      loadingMore: false,
      error: false,
      customersData: [],
      fountainCount: 0,
      dayOfWeeks:"",
    };
  }
  search() {
    this._getCustomerList(this.state.orderType, this.state.searchText, this.state.dayOfWeek, 1);
  }
  componentWillMount() {
    this.setState({ refreshing: false });
    this._getCustomerList(this.state.orderType, this.state.searchText, this.state.dayOfWeek, this.state.page);
  }
  getMusteri(value: number) {
    // this.setState({
    //   productId: productId,
    // });
    // this.props.GetProduct(productId,this.props.navigation.getParam("customerId"));
    this.setState({
      orderType: value,
    });
    this.setState({ page: 1 });
    this._getCustomerList(value, this.state.searchText, this.state.dayOfWeek, 1);
  }
  getDayOfMusteri(value: number) {
    this.setState({
      dayOfWeek: value,
    });
    this.setState({ page: 1 });
    this._getCustomerList(this.state.orderType, this.state.searchText, value, 1);

  }

  openModal(customerId: number, nameSurname: string, companyName: string, dayOfWeek?: number, fountainCount?: number,dayOfWeeks?:string) {
    this.setState({
      customerId: customerId,
      nameSurname: nameSurname,
      companyName: companyName,
      dayOfWeekCustomer: dayOfWeek,
      fountainCount: fountainCount === null ? 0 : fountainCount,
      dayOfWeeks: dayOfWeeks,
    });
    this.CustomerListSheet.open();
  }

  closeModal() {
    this.setState({ modalVisible: false });
  }

  removePeople() {
    var array = [...this.state.customersData]; // make a separate copy of the array


    for (var i = 0; i < this.state.customersData.length; i++) {
      delete array[i];
    }
    this.setState({ customersData: array });

  }
  _getCustomerList(orderType: number, searchText: string, dayOfWeek: number, page: number) {
    this.props.GetCustomers(orderType, searchText, dayOfWeek, page);

  }
  _renderActivity() {
    if (this.props.isHomeLoading) {
      return (<ActivityIndicator></ActivityIndicator>);
    }
  }
  deleteSelectedCustomer() {
    const { customerDelete } = this.props;
     customerDelete(this.state.customerId);
    this.setState({ page: 1 });
    if(this.props.CustomerDeleteIsSuccess){
      this.props.GetCustomers(this.state.orderType, this.state.searchText, this.state.dayOfWeek, 1);
      
    }

  }

  deleteCustomerAlert() {
    //function to make three option alert
    Alert.alert(
      //title
      'Müşteri Silme İşlemi',
      //body
      'Müşteriyi silmek istiyor musunuz?',
      [
        { text: 'Geri Gel' },
        { text: 'Evet', onPress: () => this.deleteSelectedCustomer() },
      ],
      { cancelable: false }
    );

  }

  editCustomer() {
    this.closeModal();
    this.props.navigation.navigate("EditCustomer",
      {
        customerId: this.state.customerId,
        nameSurname: this.state.nameSurname,
        companyName: this.state.companyName,
        dayofWeekCustomer: this.state.dayOfWeekCustomer,
        fountainCount: this.state.fountainCount,
        dayOfWeeks: this.state.dayOfWeeks,
      })

  }
  _renderCustomerSheetContent() {
    return (<View style={styles.SheetContainer}>

      <TouchableOpacity style={styles.SheetItemContainer}
        onPress={() => {
          this.CustomerListSheet.close();
          this.editCustomer();
        }}>
        <Icon name="ios-arrow-round-forward" size={30} style={styles.SheetItemIcon}></Icon>

        <Text style={styles.SheetItemText}
        >Düzenle</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.SheetItemContainer}
        onPress={() => {
         
          this.deleteCustomerAlert();
        }}>
        <Icon name="ios-trash" size={30} style={styles.SheetItemIcon}></Icon>
        <Text style={styles.SheetItemText}
        >Sil</Text>
      </TouchableOpacity>

    </View>);
  }

  onRefresh() {
    this.setState({ page: 1 });
    this.setState({ refreshing: true });
    this._getCustomerList(this.state.orderType, this.state.searchText, this.state.dayOfWeek, 1);
    this.setState({ refreshing: false });
  }
  _renderView() {
    const { customers, isHomeLoading, navigation } = this.props;    
    if (this.props.isHomeLoading || this.props.isLoadingCustomerDelete) {
      return (<ActivityIndicator></ActivityIndicator>);
    }
    else {
      if ((this.props.customers.length > 0 || (this.props.isHomeLoading===false && this.state.page > 1) && this.props.isLoadingCustomerDelete===false)) {
        console.log(this.props.isLoadingCustomerDelete, "çek "); 
        return (
          <View>
            {this._renderActivity()}
            {/* <Header
          title="Müşteriler"
          rightButtonPress={() => this.props.navigation.navigate("CustomerAdd")}
        /> */}
            <FlatList

              style={{ marginTop: 10, marginBottom: 110 }}
              refreshing={this.state.refreshing}
              onRefresh={() => this.onRefresh()}
              data={this.props.customers}
              renderItem={({ item }) => (
                <View style={styles.row}>
                  <TouchableOpacity style={styles.row_cell5} onPress={
                    () => this.props.navigation.navigate("OrdersCustomer", { customerId: item.customerId, nameSurname: item.nameSurname, companyName: item.companyName, displayTookTotalAmount: item.displayTookTotalAmount, restTotalAmount: item.displayRestTotalAmount, totalAmount: item.displayTotalAmount })}>
                    <View style={styles.row_cell1}>
                      <Text style={styles.musteri_adi}>{item.nameSurname}</Text>
                      <Text style={styles.alt_bilgi}>{item.companyName}</Text>
                      <Icon name="md-pint"><Text> {item.fountainCount == null ? 0 : item.fountainCount}</Text></Icon>
                    </View>
                    <View style={styles.row_cell2}>
                      <Text style={styles.paratextalınan}>{item.displayTookTotalAmount} Alınan</Text>
                      <Text style={styles.paratextkalan} >{item.displayRestTotalAmount} Kalan</Text>
                      <Text style={styles.paratextToplam} >Toplam: {item.displayTotalAmount}</Text>
                    </View>

                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconButtonCustomer}

                    onPress={() => this.openModal(item.customerId, item.nameSurname, item.companyName, item.dayOfWeek, item.fountainCount,item.dayOfWeeks)}>

                    <Icon name="md-more" size={24} color={"#C4B47B"} />
                  </TouchableOpacity>
                </View>)}
              keyExtractor={(item, index) => String(index)}
              onEndReached={() => {
                var pagenew = this.state.page + 1;
                this.setState({ page: pagenew });
                if (pagenew == 1) {
                  pagenew = pagenew + 1;
                  this.setState({ page: pagenew });
                }
                this.props.GetCustomerMore(this.state.orderType, this.state.searchText, this.state.dayOfWeek, pagenew);
              }}
              onEndReachedThreshold={0.5}
              initialNumToRender={8}
              ListFooterComponent={
                this.state.loadingMore ? (
                  <View>
                    <ActivityIndicator />
                  </View>
                ) : null
              }
            />
          </View>
        );

      }
      else if (this.props.customers.length == 0 && this.state.page == 1 && this.props.isHomeLoading == false) {
        return (<View style={styles.musteribulunamadiContainer}><Text style={styles.musteribulunamadiText}>Arama sonucu bulunamadı.</Text></View>);
      }

    }
  }
  render() {
    const placeholder = {
      label: 'Tüm Müşteriler',
      value: 1,
      color: '#2B6EDC',
    };
    const placeHolderDay = {
      label: 'Tümü',
      value: 0,
      color: '#2B6EDC',
    }


    return (
      <SafeAreaView style={styles.container}>
        <NavigationEvents onWillFocus={() => this.props.GetCustomers(1, "", 0, 1)} />
        <RBSheet
          ref={ref => {
            this.CustomerListSheet = ref;
          }}
          height={250}
          duration={200}
          customStyles={{
            container: {
              justifyContent: "flex-start",
              alignItems: "flex-start",
              paddingLeft: 20
            }
          }}
        >
          {this._renderCustomerSheetContent()}
        </RBSheet>
        <StatusBar backgroundColor="#2B6EDC" />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* <Modal

            visible={this.state.modalVisible}
            animationType={'slide'}
            onRequestClose={() => this.closeModal()}
            transparent={true}
          >
            <View style={styles.modalContainer}>
              <View style={styles.innerContainer}>

              </View>
            </View>
          </Modal> */}
          <View style={{ marginTop: 10 }}></View>
          <ScrollView bounces={false}>

            <View>
              <View style={styles.search_row}>
                <View style={styles.searchInput}>
                  <Input
                    placeholder="Ara"
                    placeholderTextColor="#9A9A9A"
                    value={this.state.searchText}
                    autoCapitalize="none"
                    onChangeText={e =>
                      this.setState({ searchText: e })
                    }

                  />
                </View>
                <TouchableOpacity style={styles.searchButton}
                  onPress={() => this.search()}>
                  <Icon name="ios-arrow-round-forward" size={30} color={"#EBEDF1"} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.search_row}>
              <View style={[styles.rnpickerselect, styles.PickerColor]}>
                <RNPickerSelect
                  style={styles.pickerSelectStyles}
                  placeholder={placeholder}

                  onValueChange={(value) => (this.getMusteri(value))}
                  items={[
                    { label: 'Ödeme Alınacaklar', value: 2 },
                    { label: 'Bugünün Müşterileri', value: 3 }
                  ]}
                  textInputProps={{

                    underlineColor: 'yellow'
                  }}
                  Icon={() => {
                    return <Icon name="md-arrow-down" size={24} color="gray" style={{ top: Platform.OS == "ios" ? 0 : 15 }} />;
                  }}
                />
              </View>
              <View style={[styles.rnpickerselect, styles.PickerColor,{opacity : this.state.orderType === 3 ? 0 : 1}]}>
                <RNPickerSelect
                disabled = {this.state.orderType === 3}
                  style={styles.pickerSelectStyles}
                  placeholder={placeHolderDay}
                  onValueChange={(value) => (this.getDayOfMusteri(value))}
                  items={[
                    { label: 'Pazartesi', value: 1 },
                    { label: 'Salı', value: 2 },
                    { label: 'Çarşamba', value: 3 },
                    { label: 'Perşembe', value: 4 },
                    { label: 'Cuma', value: 5 },
                    { label: 'Cumartesi', value: 6 },
                    { label: 'Pazar', value: 7 },
                  ]}
                  textInputProps={{ underlineColor: 'yellow' }}
                  Icon={() => {
                    return <Icon name="md-arrow-down" size={24} color="gray" style={{ top: Platform.OS == "ios" ? 0 : 15 }} />;
                  }}
                />
              </View>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
        {this._renderView()}

      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  isHomeLoading: state.home.isHomeLoading,
  customers: state.home.customers,
  CustomerDeleteIsSuccess: state.customerDelete.isSuccessCustomerDelete,
  isLoadingCustomerDelete : state.customerDelete.isLoadingCustomerDelete
})
function bindToAction(dispatch: any) {
  return {
    GetCustomers: (orderType: number, searchText: string, dayOfWeek: number, pageIndex: number) =>
      dispatch(GetCustomers(orderType, searchText, dayOfWeek, pageIndex)),
    GetCustomerMore: (orderType: number, searchText: string, dayOfWeek: number, pageIndex: number) =>
      dispatch(GetCustomerMore(orderType, searchText, dayOfWeek, pageIndex)),

    customerDelete: (customerId: number) =>
      dispatch(customerDelete(customerId)),
  };
}

export default connect(
  mapStateToProps,
  bindToAction
)(Customer);
