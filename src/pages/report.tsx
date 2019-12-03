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
import { GetReport } from "../redux/actions/reportAction";
import { AppState } from "../redux/store";
import { IReportItem } from "../redux/models/reportModel";
import Icon from "react-native-vector-icons/Ionicons";
import RBSheet from "react-native-raw-bottom-sheet";

interface Props {
    navigation: NavigationScreenProp<NavigationState>;
    isLoading: boolean;
    report: IReportItem;
    GetReport: (startDate: string, endDate: string) => void;
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

class Report extends Component<Props, State> {

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
        this.props.GetReport("01.10,2019", "04.12.2019");
        this.setState({ refreshing: false });
        console.log(this.props.GetReport("01.11,2019", "04.12.2019"))
    }

    onRefresh() {
        this.setState({ refreshing: true });
        this.componentWillMount();
    }

    _renderView() {
        const { report, isLoading, navigation } = this.props;
        if (isLoading) {
            return (<ActivityIndicator></ActivityIndicator>);
        }
        else {
            return (<FlatList
                refreshing={this.state.refreshing}
                onRefresh={() => this.onRefresh()}
                data={this.props.report.reportProductItems}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <View style={styles.row_cell5}>
                            <View style={styles.row_cell1}>
                                <Text style={styles.musteri_adi}>{item.productName}</Text>
                                <Text style={styles.alt_bilgi}>Ürün Kodu: {item.count}</Text>
                            </View>
                            <View style={styles.row_cell2}>
                                <Text style={styles.productUrunfiyatText}>Birim Fiyat: {item.productName} TL</Text>
                            </View>
                        </View>
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
                    <View style={{ marginTop: 10 }}></View>
                </KeyboardAvoidingView>
                {this._renderView()}
            </View>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    isLoading: state.report.isReportLoading,
    report: state.report.report,

})
function bindToAction(dispatch: any) {
    return {
        GetReport: (startDate: string, endDate: string) =>
            dispatch(GetReport(startDate, endDate)),
    };
}

export default connect(
    mapStateToProps,
    bindToAction
)(Report);
