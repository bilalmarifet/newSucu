import { ICustomerItem } from "./models/homeModel";
import { IOrderItem } from "./models/orderModel";
import { IProductItem} from "./models/productModel";
import {ICustomerPriceProductItem} from "./models/customerPriceProductModel"
import {IDefinedCustomerPriceItem} from "./models/customerDefinedPriceModel"
import {IProductForCustomerItem} from "./models/productForCustomerModel"
import {IEmployeeItem} from "./models/employeeModel"
import { IUserItem } from "./models/addUserModel";
import { IGetUserItem} from "./models/userModel";
import {IReportItem } from "./models/reportModel"
import {IEmployeeCostItem} from "./models/employeeCostModel"

export interface State {
    data: any[];
    loading: boolean;
  }

  export interface Action {
    type: string;
    payload: any;
  }

  export interface HomeState{
      customers:ICustomerItem[];
      isHomeLoading :boolean;
  }

  export interface UserState {
    isLoading: boolean;
    isFinished: boolean;
    isSucceed: boolean;
    loginErrorMessage : string;
  
  }

  export interface Orders
  {
    orders: IOrderItem[];
    isOrderLoading: boolean;
    takeTotalAmount:number;
    tookTotalAmount:number;
    restTotalAmount:number;
  }

  export interface CustomerAdd
  {
    isSuccess: boolean,
    CustomerAddMessage: string,
  }

  export interface CustomerDelete
  {
    isLoadingCustomerDelete:boolean;
    isSuccessCustomerDelete: boolean;
  }

  export interface CustomerEdit
  {
    isSuccess: boolean,
    CustomerEditMessage: string,
  }

  export interface ProductAdd
  {
    isSuccess: boolean,
    ProductAddMessage: string, 
  }

  export interface AddCash
  {
    isSuccess: boolean,
    AddCashMessage: string,
  }

  export interface ProductState{
    products:IProductItem[];
    isProductLoading :boolean;
}

export interface AddOrder
  {
    isSuccess: boolean,
    AddOrderMessage: string,
  }

  export interface ProductEdit
  {
    isSuccess: boolean,
    ProductEditMessage: string,
  }

  export interface CustomerPriceProductState{
    products:ICustomerPriceProductItem[];
    isProductLoading :boolean;
}

export interface AddCustomerPrice
  {
    isSuccess: boolean,
    AddCustomerPriceMessage: string,
  }

  export interface CustomerDefinedPriceState{
    products:IDefinedCustomerPriceItem[];
    isProductLoading :boolean;
}

export interface CustomerPriceEdit
{
  isSuccess: boolean,
  CustomerPriceEditMessage: string,
}

export interface ProductForCustomer{
  product:IProductForCustomerItem;
  isLoading :boolean;
}

export interface OrderDelete
  {
    isSuccess: boolean;
  }

  export interface EditOrder
  {
    isSuccess: boolean,
    EditOrderMessage: string,
  }

  
  export interface EmployeeState{
    employees:IEmployeeItem[];
    isLoading :boolean;
}

export interface EmployeeAdd
{
  isSuccess: boolean,
  EmployeeAddMessage: string,
}

export interface AddUser
  {
    isSuccess: boolean,
    AddUserMessage: string,
  }

  export interface EmployeeDelete
  {
    isSuccess: boolean;
  }

  export interface getUserState{
    user:IGetUserItem;
    isUserLoading :boolean;
}

export interface EmployeeCostAdd
{
  isSuccess: boolean,
  EmployeeCostAddMessage: string,
}

export interface ReportState{
  report:IReportItem;
  isReportLoading :boolean;
}

export interface GetEmployeeCostState{
  employees:IEmployeeCostItem[];
  isLoading :boolean;
}

export interface EmployeeCostEdit
{
  isSuccess: boolean,
  EmployeeCostAddMessage: string,
}

export interface EmployeeCostDelete
  {
    isSuccess: boolean;
  }