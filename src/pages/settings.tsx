import React, { Component } from "react";
import { View, StatusBar, TouchableOpacity, Text, AsyncStorage } from "react-native";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { connect } from "react-redux";
import { Header } from "../components";
import styles from "./styles";
import { logoutUserService } from "../redux/services/user";
import {
  fetchImageData,
  fetchMoreImageData
} from "../redux/actions/fetch";

interface Props {
  navigation: NavigationScreenProp<NavigationState>;
  fetchImageData: (page?: number, limit?: number) => void;
  fetchMoreImageData: (page?: number, limit?: number) => void;
  imageData: any;
  loading: boolean;
}

interface itemProp {
  item: any;
}

interface State {
  page: number;
  limit: number;
}

class Settings extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.state = {

    };
  }

  static navigationOptions = {
    title: 'Ayarlar',

    headerStyle: {
      backgroundColor: '#2B6EDC',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };




  handleLogout = () => {
    const { navigation } = this.props;

    logoutUserService().then(() => {
      navigation.navigate("LoginScreen");
    });
  };

  render() {
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#2B6EDC"/>
        {/* <Header
          title="Ayarlar"
        /> */}
        <View style={styles.settingsContainer}>
        <TouchableOpacity style={styles.addProductButtonContainer}
        onPress={()=>this.props.navigation.navigate("Products")}>
          <Text style={styles.addProductButtonText}>Ürünler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addProductButtonContainer}
        onPress={()=>this.props.navigation.navigate("Report")}>
          <Text style={styles.addProductButtonText}>Rapor</Text>
        </TouchableOpacity>
        </View>
          
        <TouchableOpacity style={styles.logoutButtonContainer}
        onPress={()=>this.handleLogout()}>
          <Text style={styles.logoutButtonText}>Çıkış</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state: any) => ({
  imageData: state.data,
  loading: state.loading
});

function bindToAction(dispatch: any) {
  return {
    fetchImageData: (page?: number, limit?: number) =>
      dispatch(fetchImageData(page, limit)),
    fetchMoreImageData: (page?: number, limit?: number) =>
      dispatch(fetchMoreImageData(page, limit))
  };
}

export default connect( mapStateToProps, bindToAction)(Settings);
