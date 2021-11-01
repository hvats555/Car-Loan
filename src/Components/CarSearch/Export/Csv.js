import { CSVLink} from "react-csv";
import React from 'react';
const _ = require('lodash');


function Csv(props) {
    const data =  props.searchResults.result && !_.isEmpty(props.searchResults) ?  props.searchResults.result.map(item => ({
        car_name: item.car.name,
        car_stock_number: item.car.stockNumber,
        car_mileage: item.car.mileage,
        car_vin: item.car.vin,
        car_price: item.car.price,
        car_features_found: item.car.featuresFound.map(f => f),
        car_features_not_found: item.car.featuresNotFound.map(f => f),
        number_of_accidents: item.car.numberOfAccidents,
        notes: item.car.notes,
        total_damage: item.car.totalDamage,
        car_calculated_emi: item.bank.map(bank => bank.calculatedEmi),
        bank_names: item.bank.map(bank => bank.bankName),
        bank_monthly_emi: item.bank.map(bank => bank.monthlyEmi),
        cbb_condition: item.bank.map(bank => bank.cbb.condition),
        cbb_value: item.bank.map(bank => bank.cbb.value)
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
