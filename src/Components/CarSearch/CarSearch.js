import React from 'react';
import SearchResultsTable from './SearchResultsTabls/SearchResultsTable';
import Csv from './Export/Csv';
import './CarSearch.css';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
const _ = require('lodash');
 
function CarSearch(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <form>
                <h3>Search options</h3>

                <div className="searchOptionsForm">
                    <div>
                        <TextField label="Profit Amount" fullWidth id="outlined-basic" size="small" type="number" name="profitAmount" placeholder="Profit Amount" value={props.carSearchOptions.profitAmount} onChange={(event) => {props.carSearchOptionsHandler("profitAmount", event.target.value)}} />
                    </div>

                    <div>
                        <TextField label="Admin Fee" fullWidth id="outlined-basic" size="small" type="number" name="adminFee" placeholder="Admin Fee" value={props.carSearchOptions.adminFee} onChange={(event) => {props.carSearchOptionsHandler("adminFee", event.target.value)}} />
                    </div>

                    <div>
                        <TextField label="Cash Down" fullWidth id="outlined-basic" size="small" type="number" name="downPayment" placeholder="Cash Down" value={props.carSearchOptions.downPayment} onChange={(event) => {props.carSearchOptionsHandler("downPayment", event.target.value)}} />
                    </div>

                    <div>
                        <TextField label="Trade in Allowance" fullWidth id="outlined-basic" size="small" type="number" name="tradeInAllowance" placeholder="Trade in Allowance" value={props.carSearchOptions.tradeInAllowance} onChange={(event) => {props.carSearchOptionsHandler("tradeInAllowance", event.target.value)}} />
                    </div>

                    <div>
                        <TextField label="Trade Lien Amount" fullWidth id="outlined-basic" size="small" type="number" name="tradeLienAmount" placeholder="Trade Lien Amount" value={props.carSearchOptions.tradeLienAmount} onChange={(event) => {props.carSearchOptionsHandler("tradeLienAmount", event.target.value)}} />
                    </div>

                    <div>
                        <TextField label="Docfee" fullWidth id="outlined-basic" size="small" type="number" name="docfee" placeholder="Docfee" value={props.carSearchOptions.docfee} onChange={(event) => {props.carSearchOptionsHandler("docfee", event.target.value)}} />
                    </div>

                    <div>
                        <TextField label="Warranty" fullWidth id="outlined-basic" size="small" type="number" name="warranty" placeholder="Warranty" value={props.carSearchOptions.warranty} onChange={(event) => {props.carSearchOptionsHandler("warranty", event.target.value)}} />
                    </div>

                    <div>
                        <TextField label="Term extenstion" fullWidth id="outlined-basic" size="small" type="number" name="termExtension" placeholder="Term extenstion" value={props.carSearchOptions.termExtension} onChange={(event) => {props.carSearchOptionsHandler("termExtension", event.target.value)}} />
                    </div>

                    <div>
                        <TextField label="Interest Break" fullWidth id="outlined-basic" size="small" type="number" name="interestBreak" placeholder="Interest break" value={props.carSearchOptions.interestBreak} onChange={(event) => {props.carSearchOptionsHandler("interestBreak", event.target.value)}} />
                    </div>
                    
                    <div>
                        <Button disabled={props.approvedBanks && !(props.approvedBanks.length !== 0) } endIcon={<SearchIcon />} variant="contained" size="medium" onClick={() => {props.searchResultsHandler();}}>Search</Button>
                    </div>

                    {props.searchResults && !_.isEmpty(props.searchResults) ? 
                    <div>
                            <Button
                            color="secondary"
                                variant="contained"
                                size="medium"
                                id="basic-button"
                                aria-controls="basic-menu"
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                            >
                            Export
                            </Button>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={() => {handleClose(); window.print();}}>Print</MenuItem>

                                <MenuItem>
                                    <Csv searchResults={props.searchResults} />
                                </MenuItem>

                                <MenuItem onClick={(event) => {props.sendEmail(event); handleClose();}}>Email</MenuItem>
                            </Menu>
                    </div> : null }
                </div>
            </form>

            <SearchResultsTable moreCarSearchLoading={props.moreCarSearchLoading} searchMoreResultsHandler={props.searchMoreResultsHandler} carSearchLoading={props.carSearchLoading} approvedBanks={props.approvedBanks} searchResults={props.searchResults} />
        </div>
    )
}

export default CarSearch
