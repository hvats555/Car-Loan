import React from 'react'

import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import prepareCarSearchResults from '../../../utils/prepareCarSearchResults';

const store = require('store');
const _ = require('lodash');

function SearchResultsTable(props) {
    const func = (approvedBank, bank) => {
        for(let i=0; i<approvedBank.length; i++) {
            for(let j=0; j<bank.length; j++) {
                // less than login
                if(approvedBank[i].bankId == bank[j].bankId) {
                    approvedBank[i].foundCount = 1;
                    approvedBank[i].calculatedEmi = bank[j].calculatedEmi;
                    break;
                } else {
                    approvedBank[i].calculatedEmi = bank[j].calculatedEmi;
                    approvedBank[i].foundCount = 0;
                }
            }        
        }
        return approvedBank;
    }


    return (
        <div className="tableContainer">
             <Table size="small">
                 {
                     props.searchResults && !_.isEmpty(props.searchResults) ?
                     <TableHead>
                        <TableRow >
                                <TableCell align="center" colSpan={7}><strong>Car Details</strong></TableCell>
                                <TableCell align="center" colSpan={3}><strong>Banks</strong></TableCell>
                        </TableRow>
    
                        <TableRow>
                            <TableCell style={{textAlign: 'center'}}><strong>Image</strong></TableCell>
                            <TableCell style={{textAlign: 'center'}}><strong>Title</strong></TableCell>
                            <TableCell style={{textAlign: 'center'}}><strong>Stock Number</strong></TableCell>
                            <TableCell style={{textAlign: 'center'}}><strong>VIN</strong></TableCell>

                            <TableCell style={{textAlign: 'center'}}><strong>Mileage</strong></TableCell>

                            {/* <TableCell style={{textAlign: 'center'}}><strong>Age</strong></TableCell> */}

                            <TableCell style={{textAlign: 'center'}}><strong>Number of accidents</strong></TableCell>
                            <TableCell style={{textAlign: 'center'}}><strong>Carfax total damage</strong></TableCell>

                            {/* <TableCell style={{textAlign: 'center'}}><strong>Car fax Notes</strong></TableCell> */}

    
                            {props.approvedBanks ? props.approvedBanks.map((bank, index) => (
                                <TableCell key={bank.bankId}><strong>{bank.bankName} / {bank.monthlyEmi}</strong></TableCell>
                            )) : null }
    
                        </TableRow>
                    </TableHead> : <p>Search Results will be displayed here</p>
                 }
                
                {!props.carSearchLoading ? <TableBody>
                    { props.searchResults && !_.isEmpty(props.searchResults) ? props.searchResults.result.map((results, index) => (
                        <TableRow key={index}>
                            <TableCell style={{textAlign: 'center'}}>
                                <CardMedia
                                component="img"
                                sx={{ width: 70, height: 70, borderRadius:'50%', display: {sm: 'block' } }}
                                image={results.car.coverImage}/>
                            </TableCell>
                            <TableCell style={{textAlign: 'center'}}>
                                {results.car.name}
                                <div style={{color: "#808080"}}>
                                    {`${results.car.price + parseInt(results.car.profit)}, ${results.car.mileage}, ${results.car.age}, ${results.car.notes}`}
                                </div>
                            </TableCell>
                            <TableCell style={{textAlign: 'center'}}>{results.car.stockNumber}</TableCell>
                            <TableCell style={{textAlign: 'center'}}>{results.car.vin}</TableCell>

                            <TableCell style={{textAlign: 'center'}}>{results.car.mileage} Km</TableCell>

                            {/* <TableCell style={{textAlign: 'center'}}>{results.car.age}</TableCell> */}

                            <TableCell style={{textAlign: 'center'}}>{results.car.numberOfAccidents}</TableCell>

                            <TableCell style={{textAlign: 'center'}}>{results.car.totalDamage}</TableCell>

                            {/* <TableCell style={{textAlign: 'center'}}>{results.car.notes}</TableCell> */}
                        {
                            func(props.approvedBanks, results.bank).map((b) => {
                                if(b.foundCount) {
                                    return (
                                        <TableCell sx={{color: "green", textAlign: "center"}}><CheckCircleIcon /> {b.calculatedEmi}</TableCell>
                                    )
                                } else {
                                    return (
                                        <TableCell sx={{color: "red", textAlign: "center"}}><CancelIcon /> {b.calculatedEmi}</TableCell>
                                    )
                                }
                            })
                        }

                        </TableRow>
                    )) : null}
                </TableBody> : <Box sx={{ width: '100%', display: 'flex', justifyContent: "center", margin: '0 auto', marginTop: "1rem"}}>
                        <CircularProgress />
                    </Box> }
            </Table>

            {props.searchResults && !_.isEmpty(props.searchResults) ?
                !props.moreCarSearchLoading ?
                    <Button sx={{display: 'flex', justifyContent: "center", margin: '0 auto', marginTop: "1rem"}} variant="contained" size="medium"  onClick={props.searchMoreResultsHandler}>Load more</Button>:  <Box sx={{ width: '100%', display: 'flex', justifyContent: "center", margin: '0 auto', marginTop: "1rem"}}>
                    <CircularProgress />
                </Box> : null 
            }
        </div>
    )
}

export default SearchResultsTable
