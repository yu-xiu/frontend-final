import React, { useState, useEffect } from 'react';
import Navbar from "../components/NavBar";
import { useParams, Link } from 'react-router-dom';
import AWS from 'aws-sdk';
import "./SingleHistory.css";
import config from '../amplifyconfiguration.json';

const SingleHistory = () => {
    return (
      <div>
        <Details />
      </div>
    );
  };

  const Details = () => {
    const { title, user } = useParams();
    const [data, setData] = useState([]);
  
    useEffect(() => {
      AWS.config.update({
        accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID, 
        secretAccessKey: process.env.REACT_APP_SECRET_KEY,
        region: 'us-east-1'
    })

  
      const dynamodb = new AWS.DynamoDB.DocumentClient();
      const params = {
        TableName: 'chopdata2',
        FilterExpression: '#user = :user AND contains (titles, :title)', // Filter expression for username and title
        ExpressionAttributeNames: {
          '#user': 'user', // Attribute name alias for username
        },
        ExpressionAttributeValues: {
          ':user': user, // Value for username
          ':title': title // Value for title
        }
      };
  
      dynamodb.scan(params, (err, data) => {
        if (err) {
          console.error('Error fetching titles:', err);
        } else {
          console.log('Details fetched successfully:', data.Items);
          setData(data.Items);
        }
      });
    }, [title, user]);

    const formatTimestamp = (seconds) => {
    seconds = Math.round(seconds);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  };
 
  
    return (
      <div className="info-list-container">
  <h1>Single History</h1>
  <div className="details-box">
    <div className="grid-container">
      {data.map((item, index) => (
        <div key={index} className="grid-item">
          {item.titles.map((title, i) => (
            <div key={i} className="grid-content">
              <p className="title">Title: {title}</p>
              <p style={{ fontSize: '26px'}}><strong>Summary</strong>: {item.summaries[i]}</p>
              {item.timestamps[i] && (
                <p style={{ fontSize: '26px'}}><strong>Timestamp</strong>: {formatTimestamp(item.timestamps[i][0])}, {formatTimestamp(item.timestamps[i][1])}</p>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
  <div style={{marginTop: '20px'}}>
  <Link to="/history">
        <button>Go Back</button>
      </Link>
  </div>
  </div>
    );
  };
// test
export default SingleHistory;