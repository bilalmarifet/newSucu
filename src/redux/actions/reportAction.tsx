import { AsyncStorage } from "react-native";
import axios from 'axios'
import { WATER_GET_REPORT } from './../constants'
import { Dispatch } from "react";
import { REPORT_GET, REPORT_LOADING } from './../types'
import { Action } from '../states'
import { IReportItem, IReportProductItems } from "../models/reportModel";


export function GetReport(startDate:string,endDate:string) {

    return (dispatch: Dispatch<Action>) => {

        dispatch(loading(true));

        var WATER_GET_REPORT_WITH_DATES = WATER_GET_REPORT + startDate + "&EndDate=" + endDate;

        axios.get(WATER_GET_REPORT_WITH_DATES,

        )
            .then((response) => {

                if (response.data.isSuccess) {
                    var productsReport: IReportProductItems[] = [];
                    response.data.result.reportProductItems.forEach((product: any) => {
                        var productReport: IReportProductItems = {
                            productId: product.productId,
                            productName: product.productName,
                            count: product.count,
                        }
                        productsReport.push(productReport)
                    });
                    var reportModel: IReportItem = {
                        totalIncome: response.data.result.totalIncome,
                        totalCost: response.data.result.totalCost,
                        totalPaidAmount: response.data.result.totalPaidAmount,
                        totalRestAmount: response.data.result.totalRestAmount,
                        totalWorkerSalary: response.data.result.totalWorkerSalary,
                        reportProductItems: productsReport,

                    }
                    dispatch(Report(reportModel));      
                }
                else {

                }
            })
            .catch((err) => {
                console.log(err)
            });
    }
}

export const loading = (loader: boolean) => ({
    type: REPORT_LOADING,
    payload: loader
})

export const Report = (report: IReportItem) => ({
    type: REPORT_GET,
    payload: report
})

