import React from 'react'

function ConfirmationPrompt(props) {
    return (
        <div>
            {props.headline}
            <div>
                <button onClick={props.yesButtonHandler}>{props.yesButtonText}</button>
                <button onClick={props.noButtonHandler}>{props.noButtonText}</button>
            </div>
        </div>
    )
}

export default ConfirmationPrompt
