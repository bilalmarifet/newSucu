import axios from 'axios'
import {WATER_CUSTOMER_EDIT} from './../constants'
import { Dispatch } from "react";
import {CUSTOMER_EDIT_FAILED,CUSTOMER_EDIT_SUCCEED} from './../types'
import {Action} from '../states'


export function customerEdit(id:number, nameSurname:string, companyName:string,dayOfWeek :number,fountainCount:number,dayOfWeeks:string) {
  return (dispatch : Dispatch<Action>) =>  {

  axios.post(WATER_CUSTOMER_EDIT,
    {
        id: id,
        nameSurname: nameSurname,
        companyName: companyName,
        dayOfWeek :dayOfWeek,
        fountainCount:fountainCount,
        dayOfWeeks: dayOfWeeks,
    })
  .then((response) =>{
  if(response.data.isSuccess){
      if(response.data.result){
        dispatch(customerEditIsSucceed(true, "Müşteri Düzenlendi!"));
      }
    }
  })
  .catch(error => {       
    dispatch(customerEditIsSucceed(false,"Bir hata oluştu."));
  });
  }
}

  
  export const customerEditIsSucceed = (isSuccess : boolean, message:string) => ({
    type : isSuccess ? CUSTOMER_EDIT_SUCCEED : CUSTOMER_EDIT_FAILED,
    payload : message
  })
  