import React, { useState } from 'react';
import { useContext} from "react";
import ResultContext from "../context/ResultContext";
import { Pane, FileUploader, Card, Spinner } from 'evergreen-ui';
import "./SingleFileUploadComponent.css"
import AWS from 'aws-sdk'




function SingleFileUploadComponent(props) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const { setResult } = useContext(ResultContext);


  const ping_python = async (filename, username) => {
    console.log("in ping python")
    console.log(username);
    setResult("Processing Upload")
    //const response = await fetch('http://127.0.0.1/transcribe', {
    const response = await fetch('http://54.91.59.54/transcribe', {
        method: 'POST', // or 'PUT'
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "filename" : filename, "username": username }),
      });

    if (response.ok) {
        const data = await response.json();
        console.log(data);
        setResult(data);
    }
}

  const handleUploadFile = () => {
    if (file) {
      setIsUploading(true);

      // Perform file upload here, e.g., using an API call
      console.log('Uploading file:', file.name);
      console.log("Current User:", props.username)
      
      uploadFile(file, props.username).then(() => {
        setIsUploading(false);
      });
    }
  };

  const handleFileAccepted = (files) => {
    // Assuming you accept only the first file for upload
    const fileToUpload = files[0];
    setFile(fileToUpload);

    // Here, you would typically call your file upload function, passing the selected file
    console.log('Uploading file:', fileToUpload.name);
    // For example: uploadFile(fileToUpload);
  };
  
  // Function to upload file to s3; reference: https://medium.com/how-to-react/how-to-upload-files-on-an-s3-bucket-in-react-js-97a3ccd519d1
  const uploadFile = async (file, username) => {
    // S3 Bucket Name
    const S3_BUCKET ='chopfilebucket';
    const REGION ='us-east-1';

    console.log("in upload_file: ", username)
        
    // s3 credentials
    AWS.config.update({
      accessKeyId: process.env.REACT_APP_ACCESS_KEY_ID, 
      secretAccessKey: process.env.REACT_APP_SECRET_KEY
    })

    // create a s3 client
    const s3 = new AWS.S3({
        params: { Bucket: S3_BUCKET },
        region: REGION,
    });

    const file_name_w_id = (Math.floor(100000000 + Math.random() * 900000000).toString()) + "_" + file.name;

    // Files Parameters
    const params = {
      Bucket: S3_BUCKET,
      Key: file_name_w_id,
      Body: file,
    };

    // Uploading file to s3
    var upload = s3
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        // File uploading progress
        console.log(
          "Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%"
        );
      })
      .promise();

    await upload.then((err, data) => {
      console.log(err);
      // Fille successfully uploaded
      alert("File uploaded successfully.");
      ping_python(file_name_w_id, username)
    });
  };
  
  const handleFileRemoved = () => {
    // Reset file state if the user removes the file
    setFile(null);
  };

  return (
    <Pane style={{ width: '1000px', height: '300px'}}>
      <FileUploader
        description={<span style={{ color: '#D8D8D8' }}>Only one file can be uploaded</span>} 
        className="custom-file-uploader"
        onChange={handleFileAccepted} 
        onRemove={handleFileRemoved}
        maxSizeInBytes={300 * 1024 * 1024}
        maxFiles={1} 
     />
      <Card className='custom-card'>
        {isUploading ? (
          <div>
            <Spinner size={24} marginRight={8} /> Uploading...
          </div>
        ): file ? (
        <>
            <h5>File Details</h5>
            <p>File Name: {file.name}</p>
            <p>File Size: {file.size} bytes</p>
            <button onClick={handleUploadFile}>Upload</button>
        </>
        ) : (
            <div>
                <h5 className='no-file-selected-message'>No file selected</h5>
            </div>
        )}
      </Card>
    </Pane>
  );
}

export default SingleFileUploadComponent;
