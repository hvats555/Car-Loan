import axios from "axios";

const prepareCarSearchResults = (customerId, bankId, profitAmount) => {
    const endpoint = '/carSearch/cars/search';

    // const url = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_CLOUD_FUNCTIONS_URL_PROD + endpoint : process.env.REACT_APP_CLOUD_FUNCTIONS_URL_DEV + endpoint;

    const url = "https://us-central1-cars-development-1f062.cloudfunctions.net/carSearch/cars/search";

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