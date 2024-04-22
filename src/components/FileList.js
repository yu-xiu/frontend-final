const FileList = ({ files, onItemClick }) => {
    return (
      <div>
        <h2>File List</h2>
        <ul>
          {files.map((file, index) => (
            <li key={index} onClick={() => onItemClick(file)}>
              {file.name}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default FileList;