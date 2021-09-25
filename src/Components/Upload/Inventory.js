import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone';
import * as csv from 'csvtojson';

function MyDropzone() {

    const parseCSV = async (csvFilePath) => {
        const jsonArray = await csv().fromFile(csvFilePath);
        console.log(jsonArray);
    }

  const onDrop = useCallback(acceptedFiles => {
    console.log(acceptedFiles[0]);
    parseCSV(acceptedFiles[0]);

    
  }, [])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}

export default MyDropzone;