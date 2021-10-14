import axios from "axios";
import toast from 'react-hot-toast';

const uploadBankInterestFile = (file, bankId) => {
    const url = process.env.REACT_APP_API_URL + `/upload/bankInterestFile/${bankId}`;
    const fd = new FormData()
    fd.append("file" , file);

    axios.post(url, fd, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then((result) => {
        console.log("Upload result: ", result);
        toast('Bank Interest File uploaded successfully', {
            icon: '💰'
        });
    }).catch((err) => {
        console.log(err);
    })
  }

  export default uploadBankInterestFile;