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
import { connect } from "react-redux";
import { AppState } from "../redux/store";
import { IProductItem } from "../redux/models/productAddModel";
import { IProductForCustomerItem } from "../redux/models/productForCustomerModel";
import { employeeCostEdit } from "../redux/actions/editEmployeeCostAction";
import { Input } from "react-native-elements";

interface Props {
    navigation: NavigationScreenProp<NavigationState>;
    isProductLoading: boolean;
    products: IProductItem[];
    GetProducts: () => void;
    AddOrder: (productId: number, customerId: number, unitPrice: number, count: number) => void;
    isSuccees: boolean;
    AddOrderMessage: string;
    GetProduct: (productId: number, customerId: number) => void;
    product: IProductForCustomerItem;
    employeeCostEdit: (id: number, employeId: number, cost: number) => void
}

interface State {
    productName: string,
    productCode: string,
    unitPrice: string,
    date: string,
    productId: number,
    count: string,
    isSuccess: boolean,
    isPaid: boolean,
}

interface input {
    cost: string
}

const girdiler = Yup.object().shape({
    cost: Yup.number()
        .positive()
        .required()
        .moreThan(0),
});
class editOrder extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            productId: 0,
            productName: "",
            productCode: "",
            unitPrice: "",
            date: "",
            count: "",
            isSuccess: false,
            isPaid: false
        };
    }


    static navigationOptions = ({ navigation }: Props) => {
        return {

            title: 'Maliyet Düzenle',
            headerStyle: {
                backgroundColor: '#2B6EDC',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },

        }


    };


    componentDidUpdate() { }

    handleAlert() {
        this.props.navigation.navigate("EmployeeCost");
        Alert.alert(
            //title
            'Maliyet Düzenlendi!',
            //body
            '',
            [
                { text: 'Tamam' }
            ],
            { cancelable: false }
        );
    }

    maliyetDüzenle(values: input) {
        const { navigation, employeeCostEdit } = this.props;
        employeeCostEdit(this.props.navigation.getParam("id"),this.props.navigation.getParam("employeId"), Number(values.cost))
        this.componentDidUpdate();
        this.componentDidUpdate();
        this.handleAlert()
    }
    render() {
        const initialValues: input = {
            cost: String(this.props.navigation.getParam("cost")),
        }

        return (
            <View style={styles.addCustomerContainer}>
                <StatusBar backgroundColor="#2B6EDC" />

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <ScrollView bounces={false}>
                        <Formik
                            enableReinitialize
                            initialValues={initialValues}
                            validationSchema={girdiler}
                            onSubmit={values => this.maliyetDüzenle(values)}
                        >
                            {props => {
                                return (
                                    <View>
                                        <View>
                                        </View>
                                        <View style={styles.inputContainer}>
                                            <View style={styles.input}>
                                                <Input

                                                    placeholder="Ürün Adedi"
                                                    placeholderTextColor="#9A9A9A"
                                                    keyboardType="numeric"
                                                    value={props.values.cost}
                                                    onChangeText={props.handleChange("cost")}
                                                    onBlur={props.handleBlur("cost")}
                                                />
                                            </View>

                                        </View>

                                        <TouchableOpacity style={styles.siparisButtonContainer}>
                                            <Text style={styles.amountButtonText}
                                                onPress={props.handleSubmit}
                                            >Düzenle</Text>
                                        </TouchableOpacity>

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

const mapStateToProps = (state: AppState) => ({
    isProductLoading: state.products.isProductLoading,
    products: state.products.products,
    isSuccees: state.editOrder.isSuccess,
    product: state.productForCustomer.product,
})
function bindToAction(dispatch: any) {
    return {
        employeeCostEdit: (id: number, employeId: number, cost: number) =>
            dispatch(employeeCostEdit(id, employeId, cost)),
    };
}

export default connect(
    mapStateToProps,
    bindToAction
)(editOrder);