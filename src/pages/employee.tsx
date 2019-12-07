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
  Alert,
  AsyncStorage,
} from "react-native";
import { NavigationScreenProp, NavigationState, ScrollView, } from "react-navigation";
import { connect } from "react-redux";
import { Header } from "../components";
import styles from "./styles";
import { AppState } from "../redux/store";
import { IEmployeeItem } from "../redux/models/employeeModel";
import Icon from "react-native-vector-icons/Ionicons";
import { employeeDelete } from "../redux/actions/deleteEmployeeAction";
import { GetEmployees } from "../redux/actions/employeeAction";
import { Formik } from "formik";
import * as Yup from "yup";
import { Input } from "react-native-elements";
import { employeeCost } from "../redux/actions/employeeCostAction"
import { timingSafeEqual } from "crypto";
import { type } from "os";
import RBSheet from "react-native-raw-bottom-sheet";


interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  isLoading: boolean;
  employees: IEmployeeItem[];
  employeeDelete: (employeeId: number) => void;
  employeeDeleteIsSuccess: boolean;
  GetEmployees: () => void;
  employeeCost: (employeId: number, cost: number) => void;
}

interface State {
  modalVisible: boolean;
  refreshing: boolean;
  nameSurname: string;
  employeeId: number;
  monthlySalary: number;
  active: boolean;
  UserType: string | null;
  modalAmountVisible: boolean;
}

interface amountData {
  amount: string
}

const initialValues: amountData = {
  amount: "",
}

const girdiler = Yup.object().shape({
  amount: Yup.number()
    .positive()
    .required(),
});

class Employee extends Component<Props, State> {
  OrderSheet: any;
  AmountSheet: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      modalVisible: false,
      refreshing: false,
      nameSurname: "",
      employeeId: 0,
      monthlySalary: 0,
      active: false,
      UserType: "",
      modalAmountVisible: false,
    };

    AsyncStorage.getItem("UserType").then((value) => {
      this.setState({
        UserType: value,
      })
      this.props.navigation.setParams({ Type: value });
    });
  }
  static navigationOptions = ({ navigation }: Props) => {
    if (navigation.getParam("Type") === "2") {
      return {
        title: 'Çalışanlar',
        headerStyle: {
          backgroundColor: '#2B6EDC',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }
    }
    else {
      return {
        title: 'Çalışanlar',
        headerRight: <TouchableOpacity style={{ marginRight: 20 }} onPress={() => navigation.navigate("AddEmployee")}>
          <Icon name="ios-add" size={40} style={{ color: 'white' }} />
        </TouchableOpacity>,
        headerStyle: {
          backgroundColor: '#2B6EDC',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }
    }
  };

  componentWillMount() {
    this.props.GetEmployees();
    this.setState({ refreshing: false });
    this.getUserType();
  }

  openModal(employeeId: number, nameSurname: string, monthlySalary: number, active: boolean) {
    this.setState({
      employeeId: employeeId,
      nameSurname: nameSurname,
      monthlySalary: monthlySalary,
      active: active,
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

  addCash() {
    this.OrderSheet.close();
    this.AmountSheet.open();

  }

  deleteSelectedEmployee() {
    console.log("fsafafsfas")
    const { employeeDelete } = this.props;
    employeeDelete(this.state.employeeId);
    this.OrderSheet.close();
    this.onRefresh();
    this.componentWillMount();
  }

  deleteEmployeeAlert() {
    //function to make three option alert
    Alert.alert(
      //title
      'Müşteri Silme İşlemi',
      //body
      'Müşteriyi silmek istiyor musunuz?',
      [
        { text: 'Geri Gel' },
        { text: 'Evet', onPress: () => this.deleteSelectedEmployee() },
      ],
      { cancelable: false }
    );

  }
  editEmployee() {
    this.closeModal();
    this.props.navigation.navigate("EditEmployee",
      {
        employeeId: this.state.employeeId,
        nameSurname: this.state.nameSurname,
        monthlySalary: this.state.monthlySalary,
        active: this.state.active,
      })

  }

  giderEkle(values: amountData) {
    this.props.employeeCost(this.state.employeeId, Number(values.amount));
    this.AmountSheet.close();
    this.onRefresh();

  }

  onRefresh() {
    this.setState({ refreshing: true });
    this.componentWillMount();
  }

  getUserType() {
    //function to make three option alert
    AsyncStorage.getItem("UserType").then((value) => {
      this.setState({
        UserType: value,
      })
      this.props.navigation.setParams({ Type: value });
    });
  }

  _renderEmployeeSheetContent() {
    return (

      <View style={styles.SheetContainer}>
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
            this.editEmployee();
          }}>
          <Icon name="ios-arrow-round-forward" size={30} style={styles.SheetItemIcon}></Icon>
          <Text style={styles.SheetItemText}
          >Düzenle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.SheetItemContainer}
          onPress={() => {
            this.OrderSheet.close();
            this.deleteEmployeeAlert();
          }}>
          <Icon name="ios-trash" size={30} style={styles.SheetItemIcon}></Icon>
          <Text style={styles.SheetItemText}
          >Sil</Text>
        </TouchableOpacity>
      </View>
    );
  }

  _renderEmployeeCostSheetContent() {
    return (<View style={styles.SheetAmountContainer}>
      <Formik
        initialValues={initialValues}
        validationSchema={girdiler}
        onSubmit={values => this.giderEkle(values)}
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

  _renderView() {
    const { isLoading, navigation } = this.props;
    if (isLoading) {
      return (<ActivityIndicator></ActivityIndicator>);
    }
    else {
      return (<View>
      <FlatList
        refreshing={this.state.refreshing}
        onRefresh={() => this.onRefresh()}
        data={this.props.employees}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.row_cell5}>
              <View style={styles.row_cell1}>
                <Text style={styles.musteri_adi}>{item.employeeName}</Text>
                <Text style={styles.alt_bilgi}>İşe Giriş: {item.createDate.slice(8, 10) + "/" + item.createDate.slice(5, 7) + "/" + item.createDate.slice(0, 4)}</Text>
              </View>
              <View style={styles.row_cell2}>
                <Text style={styles.maasText}> Maaş: {item.monthlySalary} TL</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.iconButtonCustomer}
              onPress={() => this.openModal(item.employeeId, item.employeeName, item.monthlySalary, item.active)}>
              <Icon name="md-more" size={24} color={"#C4B47B"} />
            </TouchableOpacity>
          </View>)}
        keyExtractor={item => item.employeeId.toString()}
      />
      </View>);
    }
  }
  render() {
    if (this.state.UserType === "2") {
      return (<View style={styles.musteribulunamadiContainer}>
        <Text style={styles.musteribulunamadiText}>Bu Sayfaya Erişim İzniniz Yok</Text>
      </View>);
    }
    else {
      return (
        <View style={styles.container}>
          <StatusBar backgroundColor="#2B6EDC" />
          {/* <Header
          title="Çalışanlar"
          rightButtonPress={() => this.props.navigation.navigate("AddEmployee")}
        /> */}
        
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={{margin:2}}></View>
            <TouchableOpacity style={styles.employeeCostContainer}
            onPress={() => this.props.navigation.navigate("EmployeeCost")}>
            <Text style={styles.employeeCostButtonText}>Çalışan Giderleri</Text>
          </TouchableOpacity>

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
                  paddingLeft: 20
                }
              }}
            >
              {this._renderEmployeeSheetContent()}
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
                  paddingLeft: 20
                }
              }}
            >
              {this._renderEmployeeCostSheetContent()}
            </RBSheet>
            <View style={{ marginTop: 10 }}></View>
          </KeyboardAvoidingView>
          {this._renderView()} 
        </View>
      );
    }
  }
}

const mapStateToProps = (state: AppState) => ({
  isLoading: state.employee.isLoading,
  employees: state.employee.employees,
  employeeDeleteIsSuccess: state.deleteEmployee.isSuccess,
})
function bindToAction(dispatch: any) {
  return {
    GetEmployees: () =>
      dispatch(GetEmployees()),
    employeeDelete: (employeeId: number) =>
      dispatch(employeeDelete(employeeId)),
    employeeCost: (employeeId: number, cost: number) =>
      dispatch(employeeCost(employeeId, cost)),
  };
}

export default connect(
  mapStateToProps,
  bindToAction
)(Employee);
