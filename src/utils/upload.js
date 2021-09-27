import axios from "axios"

const upload = (options) => {
    // const url = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_CLOUD_FUNCTIONS_URL_PROD + options.endpoint : process.env.REACT_APP_CLOUD_FUNCTIONS_URL_DEV + options.endpoint;

    const url = "https://us-central1-cars-development-1f062.cloudfunctions.net" + options.endpoint

    const fd = new FormData()
    fd.append("file" , options.file);

    axios.post(url, fd, {
        headers: options.headers
    }).then((result) => {
        console.log("Upload result: ", result);
    }).catch((err) => {
        console.log(err);
    })
}

  export default upload;