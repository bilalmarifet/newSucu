import { ReportState, Action } from "../states";
import { REPORT_GET, REPORT_LOADING } from "../types";
import { IReportItem } from "../models/reportModel"

const initialReportItem: IReportItem = {
    totalIncome: 0,
    totalCost: 0,
    totalPaidAmount: 0,
    totalRestAmount: 0,
    totalWorkerSalary: 0,
    reportProductItems: [],
}

const intialState = {
    report: initialReportItem,
    isReportLoading: false
};

export default (state: ReportState = intialState, action: Action) => {
    switch (action.type) {
        case REPORT_GET:

            return {
                ...state,
                report: action.payload,
                isReportLoading: false
            };
        case REPORT_LOADING:
            return {
                ...state,
                isReportLoading: action.payload
            };
        default:
            return state;
    }
};
