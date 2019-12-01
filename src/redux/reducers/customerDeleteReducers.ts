import { CustomerDelete, Action } from "../states";
import {CUSTOMER_DELETE_SUCCEED,CUSTOMER_DELETE_FAILED, CUSTOMER_DELETE_LOADING} from "../types";


const initalState = {
    isSuccessCustomerDelete: false,
    isLoadingCustomerDelete:false
  };

export default (state: CustomerDelete = initalState, action: Action) => {
  switch (action.type) {
    case CUSTOMER_DELETE_SUCCEED:    
      return {
        ...state,
        isSuccessCustomerDelete:true,
      };
      case CUSTOMER_DELETE_FAILED:     
      return {
        ...state,
        isSuccessCustomerDelete:false,
      };
      case CUSTOMER_DELETE_LOADING:
        return{
          ...state,
          isLoadingCustomerDelete:action.payload 
        }
    default:
      return state;
  }
};