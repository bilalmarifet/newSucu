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
} from "react-native";
import { NavigationScreenProp, NavigationState, ScrollView } from "react-navigation";
import { connect } from "react-redux";
import { HeaderLeftRight } from "../components";
import styles from "./styles";
import { GetProducts } from "../redux/actions/productAction";
import { AppState } from "../redux/store";
import { IProductItem } from "../redux/models/productModel";
import Icon from "react-native-vector-icons/Ionicons";
import RBSheet from "react-native-raw-bottom-sheet";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  isLoading: boolean;
  products: IProductItem[];
  GetProducts: () => void;
}

interface State {
  modalVisible: boolean;
  refreshing: boolean;
  productId: number;
  productName: string;
  productCode: string;
  price: number;
  productStatus: boolean;
}

class Products extends Component<Props, State> {



  static navigationOptions = ({ navigation }: Props) => {
    return {

      title: 'Ürünler Listesi',
      headerRight: <TouchableOpacity style={{ marginRight: 20 }} onPress={() => navigation.navigate("AddProduct")}>
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


  };


  AmountSheet: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      modalVisible: false,
      refreshing: false,
      productId: 0,
      productCode: "",
      productName: "",
      price: 0,
      productStatus: false,
    };
  }

  componentWillMount() {
    this.props.GetProducts();
    this.setState({ refreshing: false });
  }


  openModal(productCode: string, productName: string, price: number, productId: number, productStatus: boolean) {
    this.setState({
      productId: productId,
      productCode: productCode,
      productName: productName,
      price: price,
      productStatus: productStatus
    });
    this.AmountSheet.open();
  }

  closeModal() {
    this.setState({ modalVisible: false });
  }

  _renderProductSheetContent() {
    return (<View style={styles.SheetContainer}>
      <TouchableOpacity style={styles.SheetItemContainer}
        onPress={() => {
          this.AmountSheet.close();
          this.editProduct();
        }}>
        <Icon name="ios-arrow-round-forward" size={30} style={styles.SheetItemIcon}></Icon>
        <Text style={styles.SheetItemText}
        >Düzenle</Text>
      </TouchableOpacity>
    </View>);

  }


  editProduct() {
    this.closeModal();
    this.props.navigation.navigate("EditProduct",
      {
        productId: this.state.productId,
        productName: this.state.productName,
        price: this.state.price,
        productCode: this.state.productCode,
        productStatus: this.state.productStatus
      })

  }

  onRefresh() {
    this.setState({ refreshing: true });
    this.componentWillMount();
  }

  _renderView() {
    const { products, isLoading, navigation } = this.props;
    if (isLoading) {
      return (<ActivityIndicator></ActivityIndicator>);
    }
    else {
      return (<FlatList
        refreshing={this.state.refreshing}
        onRefresh={() => this.onRefresh()}
        data={this.props.products}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.row_cell5}>
              <View style={styles.row_cell1}>
                <Text style={styles.musteri_adi}>{item.productName}</Text>
                <Text style={styles.alt_bilgi}>Ürün Kodu: {item.productCode}</Text>
              </View>
              <View style={styles.row_cell2}>
                <Text style={styles.productUrunfiyatText}>Birim Fiyat: {item.price} TL</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.iconButtonCustomer}

              onPress={() => this.openModal(item.productCode, item.productName, item.price, item.productId, item.productStatus)}>

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
        <StatusBar backgroundColor="#2B6EDC" />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
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
                  onPress={() => this.editProduct()}>
                  <Text style={styles.modalEditButtonText}
                  >Düzenle</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <RBSheet
            ref={ref => {
              this.AmountSheet = ref;
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
            {this._renderProductSheetContent()}
          </RBSheet>

          <View style={{ marginTop: 10 }}></View>
        </KeyboardAvoidingView>
        {this._renderView()}
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  isHomeLoading: state.home.isHomeLoading,
  products: state.products.products,
})
function bindToAction(dispatch: any) {
  return {
    GetProducts: () =>
      dispatch(GetProducts()),
  };
}

export default connect(
  mapStateToProps,
  bindToAction
)(Products);
