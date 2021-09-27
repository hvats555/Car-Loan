import React, {useEffect, useState} from 'react';
import db from '../../firebase';
import { collection, query, where, getDocs,FieldPath, documentId, getDoc, doc } from "firebase/firestore";

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const store = require('store');

// Problem Statement -> Prepare car search results for that bank front end after adding the approved bank 


function CarSearch(props) {
    const [cars, setCars] = useState([]);
    const [selectedBankId, setSelectedBankId] = useState();

    const fetchCarSearchResults = async (customerId, bankId) => {
        const tempCarIds = [];
        const q = query(collection(db, "selectedCars"), where('customer', '==', customerId), where('bank', '==', bankId));

        const querySnapshot = await getDocs(q);
        const carsArray = [];

        querySnapshot.forEach((d) => {
            tempCarIds.push({car: d.data().car, calculatedEmi: d.data().calculatedEmi});
        });

        for(const tempCarId of tempCarIds) {
            const docRef = doc(db, "carsInventory", tempCarId.car);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                carsArray.push({details: docSnap.data(), calculatedEmi: tempCarId.calculatedEmi});
            }
        }

        setCars(carsArray);

        if(store.get(bankId)) {
            store.remove(bankId);
        } 

        store.set(bankId, carsArray);

        console.log(cars);
    }
 
    const inputChangeHandler = (bankId) => {
        if(store.get(bankId)) {
            setCars(store.get(bankId));
        } else {
            fetchCarSearchResults(props.customerId, bankId)
        }
    }

    return (
        <div>
            <Grid sx={{alignItems: 'center', marginTop: "1rem"}} container spacing={2}>
                <Grid item xs={10}>   
                    <h3>Search Results</h3>
                </Grid>

                <Grid item xs={2}> 
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Banks</InputLabel>
                        <Select
                            size="small"
                            id="bankName"
                            label="Banks"
                            labelId="demo-simple-select-label"
                            name="bankName"
                            onChange={(event) => {
                                inputChangeHandler(event.target.value);
                                setSelectedBankId(event.target.value);
                            }}
                        >

                        {
                            props.approvedBanks ? props.approvedBanks.map((bank) => (
                                <MenuItem key={bank.bankId} value={bank.bankId}>{bank.bankName}</MenuItem>
                            )) : <MenuItem key='N/A' disabled value="N/A">No banks found</MenuItem>
                        }
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <button onClick={() => {fetchCarSearchResults(props.customerId, selectedBankId)}}>Refresh results</button>
            <Grid container>
                {cars ? cars.map((car, index) => (
                    <Grid key={index} item xs={12}>
                        <CardActionArea target="_blank" component="a" href={car.details.car_URL}>
                            <Card sx={{ display: 'flex'}}>
                                <CardMedia
                                    component="img"
                                    sx={{ width: 100, height: 100, borderRadius:'50%', display: { xs: 'none', sm: 'block' } }}
                                    image={car.details.cover_image}
                                />
                                <CardContent sx={{ flex: 1 }}>
                                    <Typography component="h2" variant="h6">
                                        {car.details.name}
                                    </Typography>

                                    <Grid container>
                                        <Grid item xs={4}>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Stock Number
                                            </Typography>

                                            <Typography variant="subtitle1" color="text.primary">
                                                {car.details['stock#']}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={4} >
                                            <Typography variant="subtitle2" color="text.secondary" paragraph>
                                                VIN Number
                                            </Typography>

                                            <Typography variant="subtitle1" color="text.primary" paragraph>
                                                {car.details.VIN}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={4}>
                                            <Typography variant="subtitle2" color="text.secondary" paragraph>
                                                Calculated EMI
                                            </Typography>

                                            <Typography variant="subtitle1" color="text.primary" paragraph>
                                                {car.calculatedEmi}
                                            </Typography>

                                        </Grid>

                                    </Grid>

                                </CardContent>
                            </Card>
                        </CardActionArea>
                    </Grid>             
                )): <p>Nothing to display</p>}
            </Grid>
        </div>
    )
}

export default CarSearch
