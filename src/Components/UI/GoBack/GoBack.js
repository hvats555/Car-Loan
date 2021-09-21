import React from 'react'
import {useHistory} from 'react-router-dom';
import { useState, useEffect } from 'react';
function GoBack() {
    const history = useHistory();
    const [canGoBack, setCanGoBack] = useState(true);

    return (
        <div>
            { canGoBack ?
                <button onClick={() => {history.goBack();}}>Back</button> : null
            }
        </div>
    )
}

export default GoBack
