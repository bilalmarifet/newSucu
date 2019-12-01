import axios from 'axios'
import {WATER_CUSTOMER_DELETE} from './../constants'
import { Dispatch } from "react";
import {CUSTOMER_DELETE_SUCCEED,CUSTOMER_DELETE_FAILED, CUSTOMER_DELETE_LOADING} from './../types'
import {Action} from '../states'


export  function  customerDelete(id:number) {

  return (dispatch : Dispatch<Action>) =>  {
    dispatch(customerDeleteLoading(true));

  axios.post(WATER_CUSTOMER_DELETE,
    {
        id: id,
    })
  .then((response) =>{
  if(response.data.isSuccess){
      if(response.data.result){
        dispatch(customerDeleteIsSucceed(true, "Müşteri Silindi!"));
        dispatch(customerDeleteLoading(false));
      }
    }
  })
  .catch(error => { 
    dispatch(customerDeleteIsSucceed(false,"Bir hata oluştu."));
    dispatch(customerDeleteLoading(false));
  });

  }

}

  
  export const customerDeleteIsSucceed = (isSuccess : boolean, message:string) => ({
    type : isSuccess ? CUSTOMER_DELETE_SUCCEED : CUSTOMER_DELETE_FAILED,
    payload : message
  })
  export const customerDeleteLoading = (isSuccess : boolean) => ({
    type : CUSTOMER_DELETE_LOADING,
    payload : isSuccess
  })
  
