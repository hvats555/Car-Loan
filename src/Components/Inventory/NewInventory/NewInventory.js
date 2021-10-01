import React from 'react';

import { useState } from 'react';

import _ from 'lodash';
import uploadInventory from '../../../utils/uploadInventory';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import Dropzone from 'react-dropzone'

import './NewInventory.css';

function Newinventory(props) {
    const inventoryInitialState = {
        name: '',
        file: null
    }

    const [inventory, setinventory] = useState(inventoryInitialState);

    const inputChangeHandler = (key, value) => {
        setinventory({...inventory, [key]: value});
        console.log(inventory);
    }

    const saveinventoryInDb = async (event) => {
        event.preventDefault();

        uploadInventory(inventory.file)

        setinventory(inventoryInitialState);
        props.modalCloseHandler();
    }

    return (
        <div>
            Add to inventory

            <form onSubmit={saveinventoryInDb}>
                <Grid container rowSpacing={1}>
                    <Grid item xs={12}>
                        <Dropzone onDrop={(acceptedFiles) => {setinventory({"file": acceptedFiles[0]})}}>
                            
                        {({getRootProps, getInputProps, isDragActive}) => (
                            <section>
                                <div class="dropZoneBorder" {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    {
                                        inventory.file && !isDragActive ? <p>{inventory.file.name}</p> : <p>Drag 'n' drop some files here, or click to select files</p>
                                    }

                                    {isDragActive ? <p>Drop files here</p>: null}                                   
                                </div>
                            </section>
                        )}
                        </Dropzone>
                    </Grid>
                    <Button sx={{marginTop: '20px'}} type="submit" size="medium" variant="contained">Add to Inventory</Button>
                </Grid>
            </form>
        </div>
    )
}

export default Newinventory
