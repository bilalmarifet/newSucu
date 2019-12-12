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
import DatePicker from 'react-native-date-picker';

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
    startDate: Date;
    endDate: Date;
}

class Report extends Component<Props, State> {

    static navigationOptions = ({ navigation }: Props) => {
        return {
            title: 'Rapor',
            headerStyle: {
                backgroundColor: '#2B6EDC',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
            },
        }
    };
    startDateSheet: any;
    endDateSheet: any;

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
            startDate: new Date(),
            endDate: new Date(),
        };
    }

    componentWillMount() {
        this.props.GetReport(this.state.startDate.toISOString().slice(8, 10) + "." +
        this.state.startDate.toISOString().slice(5, 7) + "." +
        this.state.startDate.toISOString().slice(0, 4), this.state.endDate.toISOString().slice(8, 10) + "." +
            this.state.endDate.toISOString().slice(5, 7) + "." +
            this.state.endDate.toISOString().slice(0, 4));
        this.setState({ refreshing: false });
    }

    onRefresh() {
        this.setState({ refreshing: true });
        this.componentWillMount();
    }

    search(){
        this.props.GetReport(this.state.startDate.toISOString().slice(8, 10) + "." +
            this.state.startDate.toISOString().slice(5, 7) + "." +
            this.state.startDate.toISOString().slice(0, 4),this.state.endDate.toISOString().slice(8, 10) + "." +
            this.state.endDate.toISOString().slice(5, 7) + "." +
            this.state.endDate.toISOString().slice(0, 4));
    }

    _renderView() {
        const { report, isLoading, navigation } = this.props;
        if (isLoading) {
            return (<ActivityIndicator></ActivityIndicator>);
        }
        else {
            return (
                <View style={styles.reportContainer}>
                    <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity
                            style={styles.dateContainer}
                            onPress={() => { this.startDateSheet.open() }}>
                            <Text style={styles.reportDateText1}>Başlangıç Tarihi:</Text>
                            <Text style={styles.reportDateText2}>
                                {this.state.startDate.toISOString().slice(8, 10) + "." +
                                    this.state.startDate.toISOString().slice(5, 7) + "." +
                                    this.state.startDate.toISOString().slice(0, 4)}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.dateContainer}
                            onPress={() => { this.endDateSheet.open() }}>
                            <Text style={styles.reportDateText1}>Bitiş Tarihi:</Text>
                            <Text style={styles.reportDateText2}>
                                {this.state.endDate.toISOString().slice(8, 10) + "." +
                                    this.state.endDate.toISOString().slice(5, 7) + "." +
                                    this.state.endDate.toISOString().slice(0, 4)}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.searchButtonDate}
                            onPress={() => this.search()}>
                            <Icon name="ios-arrow-round-forward" size={30} color={"#EBEDF1"} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.reportText}>Toplam Alınan Para: {this.props.report.totalPaidAmount} TL</Text>
                    <Text style={styles.reportText}>Toplam Kalan Para: {this.props.report.totalRestAmount} TL</Text>
                    <Text style={styles.reportText}>Toplam Maliyet: {this.props.report.totalCost} TL</Text>
                    <Text style={styles.reportText}>Çalışan Maaşları: {this.props.report.totalWorkerSalary} TL</Text>
                    <Text style={styles.reportText}>Çalışan Maaşları(Maliyet de Ekli): {this.props.report.totalWorkerSalary+this.props.report.totalCost} TL</Text>
                    <Text style={styles.reportTextTotalCost}>Toplam Gelir: {this.props.report.totalIncome} TL</Text>
                    <View style={{ margin: 7 }}><Text>Ürünler ve Satış Sayıları:</Text></View>
                    <FlatList
                        data={this.props.report.reportProductItems}
                        renderItem={({ item }) => (
                            <View style={styles.row}>
                                <View style={styles.row_cell5}>
                                    <Text style={styles.musteri_adi}>{item.productName}</Text>
                                    <View style={styles.row_cell2}>
                                        <Text style={styles.productUrunfiyatText}>Satış Sayısı: {item.count}</Text>
                                    </View>
                                </View>
                            </View>)}
                        keyExtractor={item => item.productId.toString()}
                    />
                </View>);
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

                <RBSheet
                    ref={ref => {
                        this.startDateSheet = ref;
                    }}
                    height={200}
                    duration={200}
                    customStyles={{
                        container: {
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            paddingLeft: 20
                        }
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <DatePicker
                            date={this.state.startDate}
                            onDateChange={startDate => this.setState({ startDate })}
                            locale='tr'
                            mode="date"

                        />
                    </View>
                </RBSheet>
                <RBSheet
                    ref={ref => {
                        this.endDateSheet = ref;
                    }}
                    height={200}
                    duration={200}
                    customStyles={{
                        container: {
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            paddingLeft: 20
                        }
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <DatePicker
                            date={this.state.endDate}
                            minimumDate = {this.state.startDate}
                            onDateChange={endDate => this.setState({ endDate })}
                            locale='tr'
                            mode="date"

                        />
                    </View>
                </RBSheet>
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
