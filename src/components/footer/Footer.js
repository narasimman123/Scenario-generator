import React from 'react';
import { Button } from '@mui/material';

const Footer = ({ activeStep, steps = [], setActiveStep, handleNext }) => {
  return (
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
  );
};

export default Footer;
