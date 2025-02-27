import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import './userGuide.css';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import CloudDoneTwoToneIcon from '@mui/icons-material/CloudDoneTwoTone';
import Loader from '../loader/Loader';

const UserGuide =  forwardRef((props, ref) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [existingFiles, setExistingFiles] = useState([]);
  const [checkedFiles, setCheckedFiles] = useState({});
  const [errorMessage, setErrorMessage] = useState(''); 
  const [selectAll, setSelectAll] = useState(false); 
  const [isFullPageLoading, setIsFullPageLoading] = useState(false); 

  // Fetch existing file names
  useEffect(() => {
    const fetchFileNames = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/get_filenames`);
        const uniqueFilenames = [...new Set(response.data.filenames)];
        setExistingFiles(uniqueFilenames); 
      } catch (error) {
        console.error('Error fetching file names:', error);
      }
    };
    fetchFileNames();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setUploadStatus(null); 
    setSelectedFiles([]);
    setErrorMessage('');
  };

  // Expose the upload function to the parent via ref
  useImperativeHandle(ref, () => ({
    uploadFiles: handleFileUpload,
  }));

  // Handle file upload
  const handleFileUpload = async () => {
    if (selectedFiles.length === 0) {
      // alert('Please select files to upload.');
      return;
    }
    // Check for duplicates
    const duplicateFiles = selectedFiles.filter(file => existingFiles.includes(file.name));
    if (duplicateFiles.length > 0) {
      setErrorMessage(`The following files already exist: ${duplicateFiles.map(file => file.name).join(', ')}`);
      setOpenDialog(true);
      return;
    }
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('file', file);
    });
    localStorage.setItem('userGuideFileName', selectedFiles[0]?.name); 
    try {
      setIsLoading(true);
      setIsFullPageLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/upload_user_guide`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadStatus('Files uploaded successfully!');
      setOpenDialog(true);
      setSelectedFiles([]);
      console.log('Response:', response.data);
    } catch (error) {
      if (error.response && error.response.data.error) {
        setUploadStatus(error.response.data.error);
      } else {
        setUploadStatus('Error uploading files.');
      }
      setOpenDialog(true);
      setSelectedFiles([]);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
      setIsFullPageLoading(false); 
    }
  };

  // Handle individual file selection
  const handleCheckboxChange = (filename) => {
    setCheckedFiles((prev) => ({
      ...prev,
      [filename]: !prev[filename], // Toggle selection
    }));
  };

  // Handle "select all" checkbox
  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    const newCheckedFiles = {};
    existingFiles.forEach((file) => {
      newCheckedFiles[file] = !selectAll; // Check or uncheck all based on the current state
    });
    setCheckedFiles(newCheckedFiles);
  };

  // Handle file drop via drag-and-drop
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(files);
  };

  // Prevent the default behavior for dragover to allow dropping
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  


  return (
    <div className="user-guide">
      <div className="container">
        {/* Upload Section */}
        <div className="upload-section">
          <header className="header-text"><h1>User Guide </h1></header>
          <div className="upload-box" onDragOver={handleDragOver} onDrop={handleDrop}>
            <FontAwesomeIcon icon={faUpload} size="2x" />
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="file-input"
              style={{ display: 'none' }}
              id="file-upload"
            />
            <label htmlFor="file-upload" className="upload-label">
              <p>Drag & Drop or <span>Browse</span></p>
            </label>

            {selectedFiles.length > 0 && (
              <div className="file-list">
                <p className="uploaded-text">Uploaded Files &nbsp; <CloudDoneTwoToneIcon /></p> 
                <ul>
                  {selectedFiles.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog} sx={{ '& .MuiDialog-paper': { borderRadius: '5px', width: "380px" } }}>
              <DialogContent>
                <DialogContentText sx={{ color: '#333', textAlign: 'center', fontSize: '16px' }}>
                  {uploadStatus && <p>{uploadStatus}</p>}
                  {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Show error message for duplicates */}
                </DialogContentText>
              </DialogContent>
              <DialogActions sx={{ justifyContent: 'center' }}>
                <Button onClick={handleCloseDialog} color="primary" sx={{ backgroundColor: '#5a1dbf', color: 'white', '&:hover': { backgroundColor: '#6b2ed342' } }}>
                  OK
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>

        {/* Existing Files Section */}
        <div className="existing-files-section">
          <h3 className='userGuidHeading'>Existing Files</h3>
          <table className="existing-files-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAllChange} // Select all files
                  />
                </th>
                <th>Filename</th>
              </tr>
            </thead>
            <tbody>
              {existingFiles.map((filename, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="checkbox"
                      checked={!!checkedFiles[filename]} // Check if the file is selected
                      onChange={() => handleCheckboxChange(filename)} // Handle individual selection
                    />
                  </td>
                  <td>{filename}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isFullPageLoading &&  <Loader />  } {/* Show the loader when uploading */}
    </div>
  );
});

export default UserGuide;
