import React, { useState } from 'react';
import SearchResultsTable from './SearchResultsTabls/SearchResultsTable';
import Modal from '../UI/Modal/Modal';
import Csv from './Export/Csv';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { CSVLink, CSVDownload } from "react-csv";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import Container from '@mui/material/Container';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import PrintIcon from '@mui/icons-material/Print';
import AttachEmailIcon from '@mui/icons-material/AttachEmail';
import { Typography, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { stubFalse } from 'lodash';
const _ = require('lodash');



// Problem Statement -> Prepare car search results for that bank front end after adding the approved bank 

function CarSearch(props) {
    const [searchOptionsModal, setSearchOptionsModal] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [emailModal, setEmailModal] = useState(true);

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

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
                <div style={{display: 'flex'}}>
                    <Button variant="contained" size="small" onClick={() => {setSearchOptionsModal(true)}}><FilterAltIcon /></Button>

                    {props.searchResults && !_.isEmpty(props.searchResults) ? 
                    <div>
                        <Button
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
                            <MenuItem onClick={() => {window.print(); handleClose()}}>Print</MenuItem>

                            <MenuItem>
                                <Csv searchResults={props.searchResults} />
                            </MenuItem>

                            <MenuItem onClick={() => {setEmailModal(true); handleClose();}}>Email</MenuItem>
                        </Menu>
                    </div> : null }
                </div>
            </div>


            <SearchResultsTable moreCarSearchLoading={props.moreCarSearchLoading} searchMoreResultsHandler={props.searchMoreResultsHandler} carSearchLoading={props.carSearchLoading} approvedBanks={props.approvedBanks} searchResults={props.searchResults} />

            {emailModal ?
                <Modal style={{ height: "min(50%, 500px)" }} modalCloseHandler={() => {setEmailModal(false)}}>
                    <h2 stype={{textAlign: 'center'}}>Enter reciepient's email</h2>
                    <form onSubmit={(event) => {props.sendEmail(event)}}>

                        <Grid container rowSpacing={2}>
                            <Grid item xs={12}>
                                <TextField label="Email" fullWidth id="outlined-basic" size="small" type="email" name="profitAmount" placeholder="Email" value={props.email} onChange={(event) => {props.setEmail(event.target.value)}} />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" disabled={!props.email} fullWidth variant="contained" size="medium" fullWidth>Send Email</Button>
                            </Grid>
                        </Grid>

                    </form>
                </Modal> : null}


        </div>
    )
}

export default CarSearch
