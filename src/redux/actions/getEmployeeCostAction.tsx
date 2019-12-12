import axios from 'axios'
import { WATER_GETEMPLOYEECOST } from '../constants'
import { Dispatch } from "react";
import { EMPLOYEECOST_GET, EMPLOYEECOST_LOADING } from '../types'
import { Action } from '../states'
import { IEmployeeCostItem } from "../models/employeeCostModel";


export function GetEmployeeCost() {

    return (dispatch: Dispatch<Action>) => {

        dispatch(loading(true));
        axios.get(WATER_GETEMPLOYEECOST,

        )
            .then((response) => {
                if (response.data.isSuccess) {
                    var employeeCostModel: IEmployeeCostItem[] = [];

                    response.data.result.homeEmployeeCostItemModels.forEach((employeeCost: any) => {
                        var employeeCostItem: IEmployeeCostItem = {
                            cost: employeeCost.cost,
                            employeId: employeeCost.employeId,
                            employeName: employeeCost.employeName,
                            createdDate: employeeCost.createdDate,
                            id: employeeCost.id,
                        }
                        employeeCostModel.push(employeeCostItem);
                    });

                    dispatch(employeeCost(employeeCostModel));
                }
                else {

                }
            })
            .catch((err) => {
                // dispatch(loading(false));

            });


    }

}


export const loading = (loader: boolean) => ({
    type: EMPLOYEECOST_LOADING,
    payload: loader
})

export const employeeCost = (user: IEmployeeCostItem[]) => ({
    type: EMPLOYEECOST_GET,
    payload: user
})

