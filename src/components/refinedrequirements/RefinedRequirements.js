import React, { useState, useEffect } from 'react';
import './RefinedRequirements.css';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Loader from '../loader/Loader';

const RefinedRequirements = ({ setActiveStep, landingFileUploadResponse }) => {

  const [responseData, setResponseData] = useState(null);
  const [regeneratedContent, setRegeneratedContent] = useState(''); 
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [isRegenerateLoading, setIsRegenerateLoading] = useState(false); 
  const [isFullPageLoading, setIsFullPageLoading] = useState(false); 

  const confluenceAccount = localStorage.getItem('confluenceAccountResponse'); 

  // console.log("Props Response", landingFileUploadResponse)
  // console.log("local Storage", JSON.parse(confluenceAccount));
  const confluenceAccountParsedData = JSON.parse(confluenceAccount);

  const responseText = landingFileUploadResponse?.data?.result 
  ? landingFileUploadResponse?.data?.result 
  : confluenceAccountParsedData?.data?.result || '';

  useEffect(() => {
    const storedResponse = localStorage.getItem('landingFileUploadResponse');
    if (landingFileUploadResponse) {
      setResponseData(landingFileUploadResponse);
    } else if (confluenceAccount) {
      setResponseData(confluenceAccount); 
    } else if (storedResponse) {
      setResponseData(JSON.parse(storedResponse));
    }
  }, [landingFileUploadResponse]);


  const renderContent = (content) => {
    if (!content) return null;
  const lines = content.split('\n').filter((line) => line.trim() !== '');
  
  return lines.map((line, index) => {
    if (line.match(/^Title: .*/)) {
      return <h2 key={index}>{line.replace('Title: ', '')}</h2>;
    } else if (line.match(/^Requirement:.*/)) {
      return <h3 key={index}>{line.replace('Requirement: ', '')}</h3>;
    } else if (line.match(/^Objective.*/)) {
      return <h3 key={index}>Objective</h3>;
    } else if (line.match(/^Functional Requirements.*/)) {
      return <h2 key={index}>Functional Requirements</h2>;
    } else if (line.match(/^New Location.*/)) {
      return <h3 key={index}>New Location (Shop)</h3>;
    } else if (line.match(/^Existing Location.*/)) {
      return <h3 key={index}>Existing Location (Shop)</h3>;
    } else if (line.match(/^Location Supervisor Role.*/)) {
      return <h3 key={index}>Location Supervisor Role</h3>;
    } else if (line.match(/^User Interface.*/)) {
      return <h3 key={index}>User Interface</h3>;
    } else if (line.match(/^User Roles\/Permissions.*/)) {
      return <h3 key={index}>User Roles/Permissions</h3>;
    } else if (line.match(/^Assumptions.*/)) {
      return <h3 key={index}>Assumptions</h3>;
    } else if (line.match(/^Prerequisites.*/)) {
      return <h3 key={index}>Prerequisites</h3>;
    } else if (line.match(/^Open Items.*/)) {
      return <h3 key={index}>Open Items</h3>;
    } else if (line.match(/^CR 01- Reporting Active Status management.*/)) {
      return <h3 key={index}>CR 01 - Reporting Active Status Management</h3>;
    } else if (line.match(/^\*\*(.*)\*\*:/)) {
      const title = line.match(/^\*\*(.*)\*\*:/)[1];
      return <h4 key={index}>{title}</h4>;
    } else if (line.match(/^Version Change Reason/)) {
      return <h4 key={index}>Version Change Reason</h4>;
    } else if (line.startsWith('- ')) {
      return <p key={index}>{line.replace('- ', '')}</p>;
    } else {
      return <p key={index}>{line}</p>;
    }
  });
};

// console.log("alignment_",renderContent(confluenceAccount))

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleValueChange = (e) => {
    setValue(e.target.value);
  };

  const handleNext = async () => {
    setIsFullPageLoading(true); // Show full page loader
    setIsNextLoading(true);
    
      const storedResponse = localStorage.getItem('landingFileUploadResponse');
      const landingFileUploadResponse = storedResponse ? JSON.parse(storedResponse) : {};
      
      const confluenceStoredResponse = localStorage.getItem('confluenceAccountResponse');
      const confluenceAccountParsedData = confluenceStoredResponse ? JSON.parse(confluenceStoredResponse) : {};
      
      const user_query = landingFileUploadResponse?.data?.result 
        ? landingFileUploadResponse.data.result 
        : confluenceAccountParsedData?.data?.result || '';
  
    const apiUrl = `${process.env.REACT_APP_API_URL}/api/generate_gherkin?user_feedback=yes&updated_response=&user_query=${encodeURIComponent(user_query)}&filename=`;
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      localStorage.setItem('generatedScenario', JSON.stringify(data));

      setActiveStep(3);
    } catch (error) {
      console.error("Error while calling the API:", error);
    } finally {
      setIsNextLoading(false);
      setIsFullPageLoading(false); // Hide full page loader
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerateLoading(true);
    // const storedResponse = localStorage.getItem('landingFileUploadResponse');
    // let user_query = '';

    // if (storedResponse) {
    //     try {
    //         const parsedResponse = JSON.parse(storedResponse); 
    //         user_query = parsedResponse?.data?.result || '';
    //     } catch (error) {
    //         console.error("Error parsing stored response:", error);
    //     }
    // }
    const storedResponse = localStorage.getItem('landingFileUploadResponse');
    const landingFileUploadResponse = storedResponse ? JSON.parse(storedResponse) : {};
    
    const confluenceStoredResponse = localStorage.getItem('confluenceAccountResponse');
    const confluenceAccountParsedData = confluenceStoredResponse ? JSON.parse(confluenceStoredResponse) : {};
    
    const user_query = landingFileUploadResponse?.data?.result 
      ? landingFileUploadResponse.data.result 
      : confluenceAccountParsedData?.data?.result || '';
    
    const updated_response = value;
    const apiUrl = `${process.env.REACT_APP_API_URL}/api/generate_gherkin?user_feedback=no&updated_response=${encodeURIComponent(updated_response)}&user_query=${encodeURIComponent(user_query)}&filename=`;

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      const data = await response.json();
      console.log("API response after regenerate:", data);
      setRegeneratedContent(data.updated_response); 
      handleClose();
    } catch (error) {
      console.error("Error while regenerating the response:", error);
    } finally {
      setIsRegenerateLoading(false);
    }
  };

  return (
    <div className="user-guide">
      <div className="card-container">
        <div className="card">
          <h2 className='userGuidHeading'>{responseText.includes('- **Purpose of the document:**') ? "Purpose of the Document" : "Purpose of the Document"}</h2>
          
          <div style={{ textAlign: "left", padding: "0 6%" }}>
          {regeneratedContent
            ? renderContent(regeneratedContent) 
            : responseText 
              ? renderContent(responseText) 
              : null 
          }
            {/* {renderContent(confluenceAccount)} */}
          </div>



          <div className="buttonGroup">
            <Button
              sx={{ textTransform: 'none', border: '1px solid #6b2ed3', backgroundColor: '#6b2ed3', color: 'white', marginRight: '10px' }}
              className="regenerate"
              onClick={handleOpen}
              disabled={isRegenerateLoading} // Disable while regenerating
            >
              {isRegenerateLoading ? (
                <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : (
                'Regenerate'
              )}
            </Button>
            
            <Button
              sx={{ textTransform: 'none', color: 'black', border: '1px solid #6b2ed3' }}
              className="generateScenario"
              onClick={handleNext}
              endIcon={!isNextLoading && <ArrowForwardIcon />}
              disabled={isNextLoading} // Disable while proceeding to the next step
            >
              {isNextLoading ? (
                <CircularProgress size={24} sx={{ color: 'black' }} />
              ) : (
                'Proceed with Generate Scenario'
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Add Comments Modal */}
      <Dialog open={open} onClose={handleClose} sx={{ "& .MuiDialog-paper": { width: '60%', maxWidth: '550px' } }}>
        <DialogTitle className='dialog-title'><h4 className='modelHeading'>Add Comments</h4></DialogTitle>
        <DialogContent className='dialog-content'>
          <TextField
            label="Enter Comments"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={value}
            onChange={handleValueChange}
            InputLabelProps={{
              style: { fontSize: '0.85rem' }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ textTransform: 'none', border: '1px solid #6b2ed3', color: 'black', marginRight: '10px' }}>Cancel</Button>
          <Button onClick={handleRegenerate} sx={{ textTransform: 'none', backgroundColor: '#6b2ed3', color: '#fff' }} disabled={isRegenerateLoading}>
            {isRegenerateLoading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Submit'
            )}
          </Button>
        </DialogActions>
      </Dialog>
      {isFullPageLoading &&  <Loader />  } {/* Show the loader when uploading */}
    </div>
  );
};

export default RefinedRequirements;
