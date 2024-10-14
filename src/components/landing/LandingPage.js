import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { Stepper, Step, StepLabel, Button, Dialog, DialogContent, DialogContentText } from '@mui/material';
import './LandingPage.css'; 
import UserGuide from '../userguid/userGuide'; 
import RefinedRequirements from '../refinedrequirements/RefinedRequirements';
import GeneratedScenarios from '../generatedscenario/GeneratedScenarios';
import axios from 'axios'; 
import UploadConfluenceAccount from './UploadConfluenceAccount';
import Sidebar from '../Sidebar';
import Loader from '../loader/Loader';
import CloudDoneTwoToneIcon from '@mui/icons-material/CloudDoneTwoTone';
import Footer from '../footer/Footer';


const steps = [
  'Landing Page',
  'User Guide',
  'Refined Requirements',
  'Generate Scenario',
];

const LandingPage = () => {
  const userGuideRef = useRef();
  const [landingFileUploadResponse, setLandingFileUploadResponse] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(null); 
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  const [openModal, setOpenModal] = useState(false);
  const [isFullPageLoading, setIsFullPageLoading] = useState(false); // New state for full page loader
 
  const handleOpenModal = () => {
    setLandingFileUploadResponse(null);
    setOpenModal(true); 
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

  const handleFileUpload  = async () => {

    if (activeStep === 0 && selectedFiles.length > 0) {
      if (selectedFiles.length === 0) {
        setUploadStatus('No files selected');
        return;
      }
      const formData = new FormData();
      formData.append('file', selectedFiles[0]); 
      
      setIsLoading(true); 
      setIsFullPageLoading(true);
      localStorage.setItem('uploadedFileName', selectedFiles[0]?.name); 
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/connection_creation`, 
        formData, {
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
        setIsFullPageLoading(false); 
      }
    }else{
      if (userGuideRef.current) {
        console.log("reference",userGuideRef)
        await userGuideRef.current.uploadFiles(); // Call the method in UserGuide
      }
    }
    if (activeStep < steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
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
            <div
              className="upload-box"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
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
                   <p className="uploaded-text">Uploaded Files &nbsp; <CloudDoneTwoToneIcon /></p> 
                  <ul>
                    {selectedFiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
              </div>
              <p className="or-text">OR</p>
              <button className="upload-button" onClick={handleOpenModal}>Upload from your Confluence account</button>
              <UploadConfluenceAccount open={openModal} onClose={handleCloseModal}  />
            </div>
          </div>
        );

      case 1:
        return <UserGuide ref={userGuideRef}/>; 

      case 2:
        return <RefinedRequirements setActiveStep={setActiveStep} landingFileUploadResponse={landingFileUploadResponse}  />; 

      case 3:
        return <GeneratedScenarios />;

      default:
        return null;
    }
  };

  useEffect(() => {
    if (openDialog) {
      const timer = setTimeout(() => {
        setOpenDialog(false); 
      }, 3000);
      return () => clearTimeout(timer); 
    }
  }, [openDialog]);
  
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
        <Dialog open={openDialog} onClose={handleCloseDialog} sx={{ '& .MuiDialog-paper': { borderRadius: '5px', width: "380px" } }}>
          <DialogContent>
            <DialogContentText sx={{ color: '#333', textAlign: 'center', fontSize: '16px' }}>
              <p>{uploadStatus} !</p>
            </DialogContentText>
          </DialogContent>
        </Dialog>
          <Footer
            activeStep={activeStep}
            steps={steps}
            setActiveStep={setActiveStep}
            handleNext={handleFileUpload }
          />
      </div>
      {isFullPageLoading &&  <Loader />  } {/* Show the loader when uploading */}
    </div>
  );
};
export default LandingPage;
