import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import SignInButton from '../components/SignInButton'
import "./NavBar.css"
import HistoryPage from "../pages/History"
import {Link } from 'react-router-dom';
import { Heading} from '@aws-amplify/ui-react';

const Navbar = ({user,signOut}) => {
    return (
      <nav className="nav">
        <a href="/" className="logo">Chop Chop</a>
        <ul>
            <li><Link to="/history" user={{user}}>History</Link></li>
            <li><a className="button" onClick={signOut}>Sign out</a></li>
        </ul>
      </nav>
    );
};

export default Navbar;