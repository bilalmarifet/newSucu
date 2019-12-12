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
import DateTimePicker from '@react-native-community/datetimepicker';

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
    date: Date;
    mode: string;
    show:boolean;
    showSecond : boolean;
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
            date: new Date(),

            show: false,
            showSecond : false,
        };
    }

    
      setDate = (event, startDate) => {
        startDate = startDate || this.state.startDate;
    
        this.setState({
        //   show: Platform.OS === 'ios' ? true : false,
          startDate : startDate,
        });
      }

      setDateSecond = (event, endDate) => {
        endDate = endDate || this.state.endDate;
    
        this.setState({
        //   show: Platform.OS === 'ios' ? true : false,
          endDate : endDate,
        });
      }
    
      show = (mode : string) => {
        this.setState({
          show: true,
          mode,
        });
      }
    
    //   datepicker = () => {
    //     this.show('date');
    //   }
    
      timepicker = () => {
        this.show('time');
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
                            onPress={() => { this.setState({show:true,showSecond:false}) }}>
                            <Text style={styles.reportDateText1}>Başlangıç Tarihi:</Text>
                            <Text style={styles.reportDateText2}>
                                {this.state.startDate.toISOString().slice(8, 10) + "." +
                                    this.state.startDate.toISOString().slice(5, 7) + "." +
                                    this.state.startDate.toISOString().slice(0, 4)}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.dateContainer}
                            onPress={() => { this.setState({showSecond:true,show:false}) }}>
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
                {/* <StatusBar backgroundColor="#2B6EDC" /> */}
                <KeyboardAvoidingView style={{flex:1}}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    {/* <View style={{ marginTop: 10 }}></View> */}
                
                {this._renderView()}

                {/* <RBSheet
                    ref={ref => {
                        this.startDateSheet = ref;
                    }}
                    height={500}
                    duration={500}
                    customStyles={{
                        container: {
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            paddingLeft: 20
                        }
                    }}
                > */}
                    <View style={{ }}>
                     
                
                  {  this.state.show  && 
                        
                            <View style={{}}>
                                <TouchableOpacity style={{alignItems:'flex-end',marginRight:20,marginTop:10}} onPress={()=> this.setState({show:false})}><Icon name="md-close-circle" size={30} /></TouchableOpacity>
                                <DateTimePicker value={this.state.startDate}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    onChange={this.setDate} />
                                </View>

                      }
                    </View>
                {/* </RBSheet> */}
              
                    <View style={{ }}>


                        {/* <DateTimePicker
                            value={this.state.endDate}
                            minimumDate = {this.state.startDate}
                            onChange={endDate => this.setState({ endDate })}
                            locale='tr'
                            mode="date"

                        /> */}

{  this.state.showSecond  && 
                        
                        <View style={{}}>
                            <TouchableOpacity style={{alignItems:'flex-end',marginRight:20,marginTop:10}} onPress={()=> this.setState({showSecond:false})}><Icon name="md-close-circle" size={30} /></TouchableOpacity>
                            <DateTimePicker value={this.state.endDate}
                            minimumDate={this.state.startDate}
                mode="date"
                is24Hour={true}
                display="default"
                onChange={this.setDateSecond} />
                            </View>

                  }

                    </View>

                </KeyboardAvoidingView>
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
