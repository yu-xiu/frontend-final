import React from 'react';

const FileInfo = ({ file }) => {
  return (
    <div>
      <h2>File Information</h2>
      <p>Name: {file.name}</p>
    </div>
  );
};

export default FileInfo;