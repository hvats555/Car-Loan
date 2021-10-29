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
import commaNumber from 'comma-number';
import CancelIcon from '@mui/icons-material/Cancel';
import {useState} from 'react'

import {startCase, isEmpty} from 'lodash'

function SearchResultsTable(props) {
    const [tableStyle, setTableStyle] = useState({});
    const [tableRowStyle, setTableRowStyle] = useState({});

    const func = (approvedBank, bank) => {
        for(let i=0; i<approvedBank.length; i++) {
            for(let j=0; j<bank.length; j++) {
                if(approvedBank[i].bankId === bank[j].bankId) {
                    approvedBank[i].foundCount = 1;
                    approvedBank[i].calculatedEmi = bank[j].calculatedEmi;
                    approvedBank[i].interestRate = bank[j].interestRate;
                    approvedBank[i].term = bank[j].term;
                    break;
                } else {
                    approvedBank[i].calculatedEmi = bank[j].calculatedEmi;
                    approvedBank[i].foundCount = 0;
                    approvedBank[i].interestRate = bank[j].interestRate;
                    approvedBank[i].term = bank[j].term;
                }
            }        
        }

        return approvedBank;
    }

    return (
        <div className="tableContainer">
             <Table sx={{marginTop: '1rem'}} size="small">
                 {
                     props.searchResults && !isEmpty(props.searchResults) ?
                     <TableHead>    
                        <TableRow>
                            <TableCell><strong>Image</strong></TableCell>
                            <TableCell><strong>Vehical</strong></TableCell>
                            <TableCell><strong>Age</strong></TableCell>
                            <TableCell><strong>Location</strong></TableCell>
                            <TableCell><strong>Mileage</strong></TableCell>
                            <TableCell><strong>CBB</strong></TableCell>

                            {props.approvedBanks ? props.approvedBanks.map((bank, index) => (
                                <TableCell key={bank.bankId}><strong>{bank.bankName}</strong></TableCell>
                            )) : null }
    
                        </TableRow>
                    </TableHead> : <div style={{textAlign: 'center', marginTop: '1rem'}}>Search Results will be displayed here</div>
                 }
                
                {!props.carSearchLoading ? <TableBody>
                    { props.searchResults && !isEmpty(props.searchResults) ? props.searchResults.result.map((results, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <CardMedia
                                component="img"
                                sx={{ width: 70, height: 70, borderRadius:'50%', display: {sm: 'block' } }}
                                image={results.car.coverImage}/>
                            </TableCell>

                            <TableCell>
                                <div>
                                    <span>
                                        {results.car.name} Stock# {results.car.stockNumber}
                                    </span>
                                </div>

                                <div>
                                    {results.car.vin}
                                </div>

                                <div>
                                    cost: ${commaNumber(results.car.price + parseInt(results.car.profit))}
                                </div>

                                <a style={{color: results.car.totalDamage > 5000 ? 'red' : '#0645AD', textDecoration: 'underline'}} target="_blank" href={results.car.carFaxLink}>Carfax: ${commaNumber(results.car.totalDamage)} ({results.car.notes}) {results.car.numberOfAccidents} accidents</a>

                            </TableCell>

                            <TableCell>{results.car.age}</TableCell>

                            <TableCell>{results.car.location}</TableCell>

                            <TableCell>{commaNumber(results.car.mileage)}kms</TableCell>

                            <TableCell>
                                {results.bank.map(b => (
                                    <div>
                                        <strong>{b.bankName}</strong>: {startCase(b.cbb.condition)} ${commaNumber(b.cbb.value)}
                                        <br />
                                    </div>
                                ))}

                                <strong>Found :</strong> {results.car.featuresFound.join(", ")} <br/>

                                <strong>Not Found :</strong> {results.car.featuresNotFound.join(", ")}
                            </TableCell>

                            {/* {results.bank.map((b) => (
                                <TableCell sx={{textAlign: "center"}}>{b.calculatedEmi}</TableCell>  
                            ))} */}
                            
                        {
                            props.approvedBanks ?
                            func(props.approvedBanks, results.bank).map((b) => {
                                if(b.foundCount) {
                                    return (
                                        <TableCell sx={{color: "green"}}>
                                            ${Math.round(b.calculatedEmi)}/mo
                                            <br/>
                                            ${Math.round(b.calculatedEmi/2)}/bw
                                            <br/>

                                            <span style={{whiteSpace:'nowrap'}}>
                                                {b.interestRate.toFixed(2)}% {b.term}mo
                                            </span>
                                        </TableCell>
                                    )
                                } else {
                                    return (
                                        <TableCell sx={{color: "red"}}>
                                            <CancelIcon></CancelIcon>
                                        </TableCell>
                                    )
                                }
                            })
                            : null
                        }

                        </TableRow>
                    )) : null}
                </TableBody> : <Box sx={{ width: '100%', display: 'flex', justifyContent: "center", margin: '0 auto', marginTop: "1rem"}}>
                        <CircularProgress />
                    </Box> }
            </Table>

            {props.searchResults && !isEmpty(props.searchResults) && props.searchResults.hasMore ?
                !props.moreCarSearchLoading ?
                    <Button sx={{display: 'flex', justifyContent: "center", margin: '0 auto', marginTop: "1rem"}} variant="contained" size="medium"  onClick={props.searchMoreResultsHandler}>Load more</Button>:  <Box sx={{ width: '100%', display: 'flex', justifyContent: "center", margin: '0 auto', marginTop: "1rem"}}>
                    <CircularProgress />
                </Box> : null 
            }

            {props.searchResults.hasMore == false ? <p style={{textAlign: 'center', fontWeight:"bold", marginTop: '1rem'}}>*** End of results ***</p> : null}

        </div>
    )
}

export default SearchResultsTable
