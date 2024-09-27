import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress  } from '@mui/material';
import WebIcon from '@mui/icons-material/Web';
import axios from 'axios'; 

const UploadConfluenceAccount = ({ open, onClose }) => {

    const [confluenceAccount, setConfluenceAccount] = useState([]);
    const [confluenceAccountResponse, setconfluenceAccountResponse] = useState([]);
    const [loading, setLoading] = useState(false); // Add loading state


    const commonTextFieldStyles = {
        marginBottom: '12px',
        '& .MuiInputBase-input': {
          fontSize: '14px',
          padding: '8px 12px',
          height: '2em',
        },
        '& .MuiInputLabel-root': {
          fontSize: '12px',
        },
      };
      
    const [formValues, setFormValues] = useState({
      serverUrl: '',
      siteId: '',
      email: '',
      accessToken: ''
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true); // Set loading to true before starting the request
    try { 
        const formData = new FormData();
        formData.append('username', formValues.email);
        formData.append('api_token', formValues.accessToken);
        formData.append('space_key', formValues.siteId);
        formData.append('server_url', formValues.serverUrl);

        const response = await axios.post('http://127.0.0.1:5000/api/connection_creation', formData, {
        headers: {
            'Content-Type': 'multipart/form-data', // Set the content type
        },
        });
        setconfluenceAccountResponse(response);
        localStorage.setItem('confluenceAccountResponse', JSON.stringify((confluenceAccountResponse)));
        console.log('Response:', response.data);
      } catch (error) {
      }finally {
        setLoading(false); // Reset loading state
        onClose(); // Close the dialog
      }
  };

  useEffect(() => {
    if (confluenceAccountResponse) {
      localStorage.setItem('confluenceAccountResponse', JSON.stringify(confluenceAccountResponse));
    }
  }, [confluenceAccountResponse]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: '#f5f5f5', // Background color matching theme
          borderRadius: '8px', // Rounded corners
          padding: '16px', // Padding for spacing
          width:"500px"
        }
      }}
    >
       <DialogTitle
        sx={{display: 'flex',alignItems: 'center', fontWeight: 'bold',borderRadius: "7px", padding: "10px",margin: "10px", color: 'rgba(0, 0, 0, 0.38)'}}
      ><WebIcon sx={{ marginRight: '8px', fontSize: '28px' }} /> 
        <span className='confluenceTitle'>Connect your Confluence Account</span>
      </DialogTitle>
      
      <DialogContent>
        <form>
          <TextField
            margin="normal"
            fullWidth
            label="Server URL"
            name="serverUrl"
            value={formValues.serverUrl}
            onChange={handleChange}
            sx={commonTextFieldStyles}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Site ID"
            name="siteId"
            value={formValues.siteId}
            onChange={handleChange}
            sx={commonTextFieldStyles}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Email Address / Username"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            sx={commonTextFieldStyles}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Access Token"
            name="accessToken"
            type="password"
            value={formValues.accessToken}
            onChange={handleChange}
            sx={commonTextFieldStyles}
          />
        </form>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end', padding: '16px', paddingTop:'0px' }}>
        <Button onClick={onClose} color="secondary" sx={{textTransform:"none",  color: 'black' , border: '1px solid #6b2ed3'}}> 
          Cancel
        </Button>
        <Button onClick={handleSubmit} sx={{ backgroundColor: '#6b2ed3', color: 'white' , textTransform:"none"}}>
        {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadConfluenceAccount;
