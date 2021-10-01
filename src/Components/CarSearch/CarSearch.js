import React from 'react';
import SearchResultsTable from './SearchResultsTabls/SearchResultsTable';

import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';

const store = require('store');

// Problem Statement -> Prepare car search results for that bank front end after adding the approved bank 

function CarSearch(props) {
    return (
        <div>
            <form>
                <Grid sx={{display: 'flex', marginTop: '1rem', justifyContent: 'space-between'}} container spacing={2} rowSpacing={1}>
                    <Grid item xs={2}>
                        <TextField label="Profit Amount" fullWidth id="outlined-basic" size="small" type="number" name="profitAmount" placeholder="Profit Amount" value={props.carSearchOptions.profitAmount} onChange={(event) => {props.carSearchOptionsHandler("profitAmount", event.target.value)}} />
                    </Grid>

                    <Grid item xs={2}>
                        <TextField label="Down payment" fullWidth id="outlined-basic" size="small" type="number" name="downPayment" placeholder="Down payment" value={props.carSearchOptions.downPayment} onChange={(event) => {props.carSearchOptionsHandler("downPayment", event.target.value)}} />
                    </Grid>

                    <Grid item xs={2}>
                        <TextField label="Trade in value" fullWidth id="outlined-basic" size="small" type="number" name="tradeInValue" placeholder="Trade in value" value={props.carSearchOptions.tradeInValue} onChange={(event) => {props.carSearchOptionsHandler("tradeInValue", event.target.value)}} />
                    </Grid>

                    <Grid item xs={2}>
                        <TextField label="Term extenstion" fullWidth id="outlined-basic" size="small" type="number" name="termExtension" placeholder="Term extenstion" value={props.carSearchOptions.termExtension} onChange={(event) => {props.carSearchOptionsHandler("termExtension", event.target.value)}} />
                    </Grid>

                    <Grid item xs={2}>
                        <TextField label="Interest Break" fullWidth id="outlined-basic" size="small" type="number" name="interestBreak" placeholder="Interest break" value={props.carSearchOptions.interestBreak} onChange={(event) => {props.carSearchOptionsHandler("interestBreak", event.target.value)}} />
                    </Grid>
                    <Grid item xs={2}>
                        <Button endIcon={<SearchIcon />} variant="contained" size="medium" onClick={props.searchResultsHandler}>Search</Button>
                    </Grid>
                </Grid>
            </form>

            <SearchResultsTable moreCarSearchLoading={props.moreCarSearchLoading} searchMoreResultsHandler={props.searchMoreResultsHandler} carSearchLoading={props.carSearchLoading} approvedBanks={props.approvedBanks} searchResults={props.searchResults} />
        </div>
    )
}

export default CarSearch
