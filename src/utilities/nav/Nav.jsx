import React from 'react'
import { Link } from 'react-router-dom'
import './nav.css'

function Nav() {

    return (<div className="navigation">
        <h1>See animation:</h1>
        <ul>
            <li><Link to="/gravity">Gravity</Link></li>
            <li><Link to="/planets">Planets</Link></li>
            <li><Link to="/cubes">Cubes</Link></li>
            <li><Link to="/spin">Spin</Link></li>
        </ul>

    </div>)

}

export default Nav