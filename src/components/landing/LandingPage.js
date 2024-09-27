import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { Stepper, Step, StepLabel, Button, Dialog, DialogActions, DialogContent, DialogContentText, CircularProgress } from '@mui/material';
import './LandingPage.css'; 
import UserGuide from '../userguid/userGuide'; 
import RefinedRequirements from '../refinedrequirements/RefinedRequirements';
import GeneratedScenarios from '../generatedscenario/GeneratedScenarios';
import axios from 'axios'; 
import UploadConfluenceAccount from './UploadConfluenceAccount';
import Sidebar from '../Sidebar';
import Loader from '../loader/Loader'; // Import the Loader component

const steps = [
  'Landing Page',
  'User Guide',
  'Refined Requirements',
  'Generate Scenario',
];

const LandingPage = () => {

  const [landingFileUploadResponse, setLandingFileUploadResponse] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null); 
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [openModal, setOpenModal] = useState(false);
  const [isFullPageLoading, setIsFullPageLoading] = useState(false); // New state for full page loader

  const handleOpenModal = () => {
    setLandingFileUploadResponse(null); // Clear the response when opening the modal
    setOpenModal(true); // Open the modal
  };
  const handleCloseModal = () => setOpenModal(false);

  const [activeStep, setActiveStep] = useState(() => {
    const savedStep = localStorage.getItem('activeStep');
    return savedStep ? Number(savedStep) : 0; 
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setUploadStatus('No files selected');
      return;
    }
    const formData = new FormData();
    formData.append('file', selectedFiles[0]); 
    setIsLoading(true); 
    setIsFullPageLoading(true); // Show full page loader
    localStorage.setItem('uploadedFileName', selectedFiles[0]?.name); 

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/connection_creation', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setLandingFileUploadResponse(response);
      setUploadStatus('File uploaded successfully');
      setSelectedFiles([]);
      setOpenDialog(true); 
      localStorage.setItem('landingFileUploadResponse', JSON.stringify(landingFileUploadResponse));

    } catch (error) {
      setUploadStatus('File upload failed');
      setOpenDialog(false); 
    } finally {
      setIsLoading(false); 
      setIsFullPageLoading(false); // Hide full page loader
    }
  };

  useEffect(() => {
    if (landingFileUploadResponse) {
      localStorage.setItem('landingFileUploadResponse', JSON.stringify(landingFileUploadResponse));
    }
  }, [landingFileUploadResponse]);

  useEffect(() => {
    localStorage.setItem('activeStep', activeStep);
  }, [activeStep]);

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div>
            <header className="header-text">
              <h1>Hi there, <br /> <span className='what'> Upload</span> <span>your Requirements</span></h1>
              <p>Submit your requirements file here</p>
            </header>
            <div className="upload-section">
              <div className="upload-box">
                <FontAwesomeIcon icon={faUpload} size="2x" />
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="file-input"
                  style={{ display: 'none' }}
                  id="file-upload"
                  accept="application/pdf"
                />
                <label htmlFor="file-upload" className="upload-label">
                  <p>Drag & Drop or <span>Browse</span></p>
                </label>
                {/* <small>Only JPEG, PNG, GIF, and PDF files with a max size of 15MB.</small> */}
                {selectedFiles.length > 0 && (
                <div className="file-list">
                  <ol>
                    {selectedFiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ol>
                  <button className="upload-button" onClick={handleUpload} disabled={isLoading}>
                    {isLoading ? 'Uploading...' : 'Upload Files'}
                  </button>
                </div>
              )}
              </div>
              <p className="or-text">OR</p>
              <button className="upload-button" onClick={handleOpenModal}>Upload from your Confluence account</button>
              <UploadConfluenceAccount open={openModal} onClose={handleCloseModal} />
            </div>
          </div>
        );

      case 1:
        return <UserGuide />; 

      case 2:
        return <RefinedRequirements setActiveStep={setActiveStep} landingFileUploadResponse={landingFileUploadResponse}  />; 

      case 3:
        return <GeneratedScenarios />;

      default:
        return null;
    }
  };

  return (
    <div className="landing-page">
      <Sidebar />
      <div className="content">
        <Stepper activeStep={activeStep} className="stepper">
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent()}

        <Dialog open={openDialog} onClose={handleCloseDialog} sx={{ '& .MuiDialog-paper': { borderRadius: '5px', width:"380px" } }}>
          <DialogContent>
            <DialogContentText sx={{ color: '#333', textAlign: 'center', fontSize: '16px' }}>
              <p>{uploadStatus} !</p>
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button onClick={handleCloseDialog} color="primary" sx={{ backgroundColor: '#5a1dbf', color: 'white', '&:hover': { backgroundColor: '#6b2ed342' } }}>
              OK
            </Button>
          </DialogActions>
        </Dialog>

        <footer className="footer">
  {activeStep > 0 && (
    <Button
      sx={{
        textTransform: 'none',
        border: '1px solid #6b2ed3',
        color: 'black',
        marginRight: '10px'
      }}
      className="backButton"
      onClick={() => {
        if (activeStep === steps.length - 1) {
          // Clear local storage when going back to the first page
          localStorage.clear();
          setActiveStep(0);
        } else {
          setActiveStep((prevActiveStep) => prevActiveStep - 1);
          localStorage.clear();
        }
      }}
    >
      {activeStep === steps.length - 1 ? 'Back to First Page' : 'Back'}
    </Button>
  )}
  {activeStep !== 2 && activeStep < steps.length - 1 && (
    <div className="button-group">
      <Button
        sx={{
          textTransform: 'none',
          backgroundColor: '#6b2ed3',
          color: '#fff'
        }}
        className="nextButton"
        onClick={handleNext}
      >
        Next
      </Button>
    </div>
  )}
</footer>

      </div>

      {isFullPageLoading &&  <Loader />  } {/* Show the loader when uploading */}
    </div>
  );
};

export default LandingPage;
