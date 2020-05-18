import React from 'react';
import './loading.css'

function Loading(props) {
    return (<div className="load-container">
        <span>loading {props.data}...</span>
    </div>)
}

export default Loading