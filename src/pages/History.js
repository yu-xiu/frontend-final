import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import SignInButton from '../components/SignInButton';
import "./History.css";
import Navbar from "../components/NavBar";
import { Link } from 'react-router-dom';
import AWS from 'aws-sdk';
import config from '../amplifyconfiguration.json';

const HistoryPage = ({user}) => {
    return (
      <div>
        <FileList user={user}/>
      </div>
    );
  };

const FileList = (user) => {
  const [data, setData] = useState([]);
  console.log("In File List");
  const username = user.user.username;
  console.log(username);

  useEffect(() => {
    // Configure AWS credentials
    AWS.config.update({
      accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID, 
        secretAccessKey: process.env.REACT_APP_SECRET_KEY,
        region: 'us-east-1'
  })

    // Create a DynamoDB client
    const dynamodb = new AWS.DynamoDB.DocumentClient();

    // Define parameters for DynamoDB query
    const params = {
        TableName: 'chopdata2',
        FilterExpression: '#user = :user', // Filter expression for username
        ExpressionAttributeNames: {
          '#user': 'user' // Attribute name alias for username
        },
        ExpressionAttributeValues: {
          ':user': username // Value for username
        },
        ScanIndexForward: false,
        IndexName: 'filename-uploadTime-index'
      };

      
    // Fetch data from DynamoDB
    dynamodb.scan(params, (err, data) => {
      if (err) {
        console.error('Error fetching titles:', err);
      } else {
        console.log('Titles fetched successfully:', data.Items);
        const sortedItems = data.Items.sort((a, b) => {
          return new Date(b.uploadTime) - new Date(a.uploadTime);
      });
        console.log("Sorted: ")
        console.log(data.Items)
        setData(data.Items); // Extract titles from the data and update state
      }
    });
  }, [username]); // Empty dependency array ensures this effect runs only once

  return (
    <div className="file-list-container">
      <p className="fileList">History</p>
      <div className="content">
        <ul style={{listStyleType: 'none'}}>
          {data.map((item, index) => (
            <li key={index}>
              <Link to={`/singleHistory/${encodeURIComponent(item.titles[0])}/${encodeURIComponent(username)}`}><div>{item.titles[0].replace(/"/g, '')}</div></Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HistoryPage;