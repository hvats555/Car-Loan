import axios from "axios";

const prepareCarSearchResults = (customerId, bankId, profitAmount) => {
    const url = process.env.REACT_APP_CLOUD_FUNCTIONS_URL + '/carSearch/cars/search';

    axios.post(url, {
        customerId: customerId,
        bankId: bankId,
        profitAmount: profitAmount
    }).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log(err);
    })
}

export default prepareCarSearchResults;