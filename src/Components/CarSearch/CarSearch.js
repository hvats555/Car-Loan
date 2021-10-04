import React, { useState } from 'react';
import SearchResultsTable from './SearchResultsTabls/SearchResultsTable';
import Modal from '../UI/Modal/Modal';

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import Container from '@mui/material/Container';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Typography, IconButton } from '@mui/material';
import { stubFalse } from 'lodash';


// Problem Statement -> Prepare car search results for that bank front end after adding the approved bank 

function CarSearch(props) {
    const [searchOptionsModal, setSearchOptionsModal] = useState(false);

    return (
        <div>
            {
                searchOptionsModal ? 
                <Modal modalCloseHandler={() => {setSearchOptionsModal(false)}}>
                    <form>
                        <h2>Search options</h2>
                        <Grid sx={{display: 'flex', marginTop: '1rem', justifyContent: 'space-between'}} container spacing={2} rowSpacing={2}>
                            <Grid item md={6} xs={12}>
                                <TextField label="Profit Amount" fullWidth id="outlined-basic" size="small" type="number" name="profitAmount" placeholder="Profit Amount" value={props.carSearchOptions.profitAmount} onChange={(event) => {props.carSearchOptionsHandler("profitAmount", event.target.value)}} />
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <TextField label="Cash Down" fullWidth id="outlined-basic" size="small" type="number" name="downPayment" placeholder="Cash Down" value={props.carSearchOptions.downPayment} onChange={(event) => {props.carSearchOptionsHandler("downPayment", event.target.value)}} />
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <TextField label="Trade in Allowance" fullWidth id="outlined-basic" size="small" type="number" name="tradeInAllowance" placeholder="Trade in Allowance" value={props.carSearchOptions.tradeInAllowance} onChange={(event) => {props.carSearchOptionsHandler("tradeInAllowance", event.target.value)}} />
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <TextField label="Trade Lien Amount" fullWidth id="outlined-basic" size="small" type="number" name="tradeLienAmount" placeholder="Trade Lien Amount" value={props.carSearchOptions.tradeLienAmount} onChange={(event) => {props.carSearchOptionsHandler("tradeLienAmount", event.target.value)}} />
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <TextField label="Docfee" fullWidth id="outlined-basic" size="small" type="number" name="docfee" placeholder="Docfee" value={props.carSearchOptions.docfee} onChange={(event) => {props.carSearchOptionsHandler("docfee", event.target.value)}} />
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <TextField label="Warranty" fullWidth id="outlined-basic" size="small" type="number" name="warranty" placeholder="Warranty" value={props.carSearchOptions.warranty} onChange={(event) => {props.carSearchOptionsHandler("warranty", event.target.value)}} />
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <TextField label="Term extenstion" fullWidth id="outlined-basic" size="small" type="number" name="termExtension" placeholder="Term extenstion" value={props.carSearchOptions.termExtension} onChange={(event) => {props.carSearchOptionsHandler("termExtension", event.target.value)}} />
                            </Grid>

                            <Grid item md={6} xs={12}>
                                <TextField label="Interest Break" fullWidth id="outlined-basic" size="small" type="number" name="interestBreak" placeholder="Interest break" value={props.carSearchOptions.interestBreak} onChange={(event) => {props.carSearchOptionsHandler("interestBreak", event.target.value)}} />
                            </Grid>
                            
                            <Grid item xs={12}>
                                <Button fullWidth endIcon={<SearchIcon />} variant="contained" size="medium" onClick={() => {props.searchResultsHandler(); setSearchOptionsModal(false)}}>Search</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Modal>
                : null
                }

            <div className="appHeader">
                <h2>Search</h2>
                <Button variant="contained" size="small" onClick={() => {setSearchOptionsModal(true)}}><FilterAltIcon /></Button>
            </div>


            <SearchResultsTable moreCarSearchLoading={props.moreCarSearchLoading} searchMoreResultsHandler={props.searchMoreResultsHandler} carSearchLoading={props.carSearchLoading} approvedBanks={props.approvedBanks} searchResults={props.searchResults} />
        </div>
    )
}

export default CarSearch
