import React from 'react';
import Button from '@mui/material/Button';
import './confirmationPrompt.css';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';

function ConfirmationPrompt(props) {
    return (
        <div className="confirmationPrompt">
            <h3>{props.headline}</h3>
            <Container className="promptButtons">
                <Grid sx={{display: 'flex', justifyContent: 'center'}} container>
                    <Grid item xs={2}>
                        <Button variant="contained" onClick={props.yesButtonHandler}>{props.yesButtonText}</Button>
                    </Grid>

                    <Grid item xs={2}>
                        <Button variant="outlined" onClick={props.noButtonHandler}>{props.noButtonText}</Button>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default ConfirmationPrompt
