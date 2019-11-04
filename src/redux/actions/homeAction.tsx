import { AsyncStorage } from "react-native";
import axios from 'axios'
import {WATER_CUSTOMERS_HOME_GET} from './../constants'
import { Dispatch } from "react";
import {CUSTOMER_GET,HOME_LOADING_CUSTOMERS } from './../types'
import {Action} from '../states'
import { ICustomerItem } from "../models/homeModel";


export function GetCustomers() {

  return (dispatch : Dispatch<Action>) =>  {
  
    dispatch(loading(true));

    const token:string = "asdada";

  axios.get(WATER_CUSTOMERS_HOME_GET,
    
    )
  .then((response) =>{
    
  if(response.data.isSuccess){
      var customersModel :ICustomerItem[] = [];
      
      response.data.result.homeCustomerItemModels.forEach((customer:any) => {
            var customerItem : ICustomerItem={
                    customerId : customer.customerId,
                    companyName :customer.companyName,
                    nameSurname :customer.nameSurname
            }
        customersModel.push(customerItem);         
      });
   
      dispatch(customers(customersModel));
      
    }
   
  
  else {

  }
  })
  .catch((err) => {
    console.log(err + "error axios") 
    // dispatch(loading(false));

  });


  }

}


export const loading = (loader : boolean) => ({
    type : HOME_LOADING_CUSTOMERS,
    payload : loader
  })

  export const customers = (customers :ICustomerItem[] ) => ({
    type : CUSTOMER_GET,
    payload : customers
  })

  