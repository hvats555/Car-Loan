import axios from "axios";

const prepareCarSearchResults = (customerId, bankId, profitAmount) => {
    const url = process.env.REACT_APP_API_URL + "/cars/search";

    axios.post(url, {
        customerId: customerId,
    }).then((result) => {
        console.log(result);
    }).catch((err) => {
        console.log(err);
    })
}

export default prepareCarSearchResults;