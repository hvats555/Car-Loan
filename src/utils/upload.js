import axios from "axios"

const upload = (file, bankId) => {
    const url = process.env.REACT_APP_API_URL + `/upload/vehicalBookingGuide/${bankId}`;
    const fd = new FormData()
    fd.append("file" , file);

    axios.post(url, fd, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then((result) => {
        console.log("Upload result: ", result);
    }).catch((err) => {
        console.log(err);
    })
  }

  export default upload;