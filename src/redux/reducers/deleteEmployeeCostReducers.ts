import { EmployeeCostDelete, Action } from "../states";
import {EMPLOYEECOST_DELETE_SUCCEED,EMPLOYEECOST_DELETE_FAILED} from "../types";


const initalState = {
    isSuccess: false,
  };

export default (state: EmployeeCostDelete = initalState, action: Action) => {
  switch (action.type) {
    case EMPLOYEECOST_DELETE_SUCCEED:    
      return {
        ...state,
        isSuccess:true,
      };
      case EMPLOYEECOST_DELETE_FAILED:     
      return {
        ...state,
        isSuccess:false,
      };
    default:
      return state;
  }
};