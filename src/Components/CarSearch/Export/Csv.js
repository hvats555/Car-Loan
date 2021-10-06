import { CSVLink} from "react-csv";
import React from 'react';
const _ = require('lodash');


function Csv(props) {
    const data =  props.searchResults.result && !_.isEmpty(props.searchResults) ?  props.searchResults.result.map(item => ({
        carName: item.car.name,
        carStockNumber: item.car.stockNumber,
        carMileage: item.car.mileage,
        carVin: item.car.vin,
        carPrice: item.car.price,
        numberOfAccidents: item.car.numberOfAccidents,
        notes: item.car.notes,
        totalDamage: item.car.totalDamage,
        carCalculatedEmi: item.bank.map(bank => bank.calculatedEmi),
        bankNames: item.bank.map(bank => bank.bankName),
        bankMonthlyEmi: item.bank.map(bank => bank.monthlyEmi),
    })) : null;

    return (
        <div>
            {
                props.searchResults.result && !_.isEmpty(props.searchResults) ? <CSVLink data={data} target="_blank">CSV</CSVLink> : null
            }
        </div>
    )
}

export default Csv
