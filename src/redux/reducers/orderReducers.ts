import { IMAGE_DATA_FETCHED, DATA_LOADING, FETCH_MORE } from "../actions/fetch";
import { Orders, Action } from "../states";
import { ORDERS_GET, ORDER_LOADING,GET_REST_TOTAL_AMOUNT,GET_TAKE_TOTAL_AMOUNT,GET_TOOK_TOTAL_AMOUNT } from "../types";
import { act } from "react-test-renderer";
import customer from "../../pages/customer";


const initalState = {
    customerId: 0,
    orders: [],
    takeTotalAmount:0,
    tookTotalAmount: 0,
    restTotalAmount: 0,
    isOrderLoading: false,
  };

export default (state: Orders = initalState, action: Action) => {
  switch (action.type) {
    case ORDERS_GET:
      return {
        ...state,
        customerId: action.payload,
        orders: action.payload,
        isOrderLoading:false
      };
    case GET_TAKE_TOTAL_AMOUNT:
      return {
        ...state,
        customerId: action.payload,
        takeTotalAmount:action.payload,
        isOrderLoading:false
      };
    case GET_TOOK_TOTAL_AMOUNT:
      return {
        ...state,
        customerId: action.payload,
        tookTotalAmount: action.payload,
        isOrderLoading:false
      };
    case GET_REST_TOTAL_AMOUNT:
      return {
        ...state,
        customerId: action.payload,
        restTotalAmount: action.payload,
        isOrderLoading:false
      };      
    case ORDER_LOADING:
      return {
        ...state,
        customerId: action.payload,
        isOrderLoading: action.payload
      };
    default:
      return state;
  }
};