import React, { useState, useEffect, useContext } from 'react';
import ResultContext from "../context/ResultContext";
import { Form, Button, Container } from 'react-bootstrap';
import SignInButton from '../components/SignInButton';
import SingleFileUploadComponent from '../components/SingleFileUploadComponent';
import "./HomeResult.css"
import Navbar from "../components/NavBar"
import {Link } from 'react-router-dom';
import {Heading} from '@aws-amplify/ui-react';

const HomePage = ({user}) => {
    return (
      <div className='outer-container'>
        <Heading fontSize = '22px' style={{ fontFamily: 'Futura', fontWeight: 100 }} color={'white'} level={1}>Welcome {user.signInDetails.loginId}:</Heading>
        <Upload username={user.username}/>
        <Result />
      </div>
    );
  };

const Upload = (user) => {
  return (
      <div className="file-upload-container">
        <p className="uploadFileText">Upload File</p>
        <SingleFileUploadComponent username = {user.username}/>
      </div>
  )
};

const Result = () => {
  const { result } = useContext(ResultContext);
  
  const formatTimestamp = (seconds) => {
    seconds = Math.round(seconds);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  };
 
  if (!result || !result.titles || !result.summaries || !result.timestamps) {
    return (
      <div className="result-container">
        <h2>Result:</h2>
        <p style={{ fontSize: '28px', padding:'0px 0px 0px 10px' }}>{result === "Processing Upload" ? "Processing Upload..." : "No results"}</p>
      </div>
    );
  }
  return (
    <div>
      <div className="result-container">
        <h2>Results:</h2>
        {result.titles.map((title, index) => (
            <div key={index} style={{width: '400px'}}>
                <h3 style={{ fontSize: '28px', padding:'40px 0px 0px 10px' }}>Title: {title}</h3>
                <p style={{ fontSize: '22px', padding:'10px 0px 0px 10px' }}><strong>Summary:</strong> {result.summaries[index]}</p>
                <p style={{ fontSize: '22px', padding:'10px 0px 0px 10px' }}> <strong>Timestamps:</strong></p>
                <ul style={{ fontSize: '18px', padding:'0px 0px 0px 30px' }}>
                    {result.timestamps[index].map((timestamp, timestampIndex) => (
                        <li key={timestampIndex}>{formatTimestamp(timestamp)}</li>
                    ))}
                </ul>
            </div>
        ))}
      </div>
    </div>
  );
}
  
  export default HomePage;