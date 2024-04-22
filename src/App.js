import './App.css';

// import SingleFileUploadComponent from './components/SingleFileUploadComponent';
import HomePage from './pages/HomeResult';
import HistoryPage from './pages/History';
import SingleHistory from './pages/SingleHistory';
import Navbar from './components/NavBar';
import ResultContext from "./context/ResultContext";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';
import { Fragment } from 'react';
import { Amplify } from 'aws-amplify';
import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import config from './amplifyconfiguration.json';
Amplify.configure(config);


const App = ({signOut, user}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const files = [
    { name: 'File 1', /* additional file information */ },
    { name: 'File 2', /* additional file information */ },
  ];
  const handleItemClick = (file) => {
    setSelectedFile(file);
  };

  return (
    <Fragment>
      <ResultContext.Provider value={{ result, setResult }}>
        <Router>
          <Navbar signOut={signOut} user={user}/>
          <Routes>
            <Route exact path="/" element={<HomePage user={user}/>} />
            <Route exact path="/home" element={<HomePage />} />
            <Route path="/history" element={<HistoryPage user={user} />} />
            <Route path="/singleHistory/:title/:user" element={<SingleHistory />} />
          </Routes>
        </Router>
      </ResultContext.Provider>
    </Fragment>
  );
}

export default withAuthenticator(App);
