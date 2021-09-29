import axios from "axios"

const upload = (options) => {
    const url = process.env.REACT_APP_API_URL + "/upload";
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