import React, { useState, useEffect } from 'react';
import { Checkbox, Typography, Box, Paper, TextareaAutosize, Button, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import GetAppIcon from '@mui/icons-material/GetApp';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import * as XLSX from 'xlsx';
import './GeneratedScenarios.css'; // Import the CSS file
import CreateIcon from '@mui/icons-material/Create'; // Import a different edit icon


const GeneratedScenarios = () => {
  const [scenarioData, setScenarioData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [checkedScenarios, setCheckedScenarios] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [selectAll, setSelectAll] = useState(false);

  // Load scenarios from local storage on mount
  useEffect(() => {
    const storedScenario = localStorage.getItem('generatedScenario');
    const landingFileName = localStorage.getItem('uploadedFileName');
    let parsedData = [];

    try {
      const parsed = JSON.parse(storedScenario);
      parsedData = Array.isArray(parsed.scenarios) ? parsed.scenarios : [];
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
    }

    if (Array.isArray(parsedData)) {
      setScenarioData(parsedData);
    } else {
      console.warn("Stored scenario data is not an array:", parsedData);
      setScenarioData([]);
    }

    setIsLoading(false);
  }, []);

  // Initialize checked scenarios and descriptions when scenarioData changes
  useEffect(() => {
    if (Array.isArray(scenarioData) && scenarioData.length > 0) {
      setCheckedScenarios(new Array(scenarioData.length).fill(false));
      setDescriptions(scenarioData.map((scenario) => scenario.value));
    }
  }, [scenarioData]);

  const handleCheckboxChange = (index) => {
    const updatedChecked = [...checkedScenarios];
    updatedChecked[index] = !updatedChecked[index];
    setCheckedScenarios(updatedChecked);

    // Update selectAll state based on the current checked state
    setSelectAll(updatedChecked.every((checked) => checked));
  };

  const handleDescriptionChange = (index, newDescription) => {
    const updatedDescriptions = [...descriptions];
    updatedDescriptions[index] = newDescription;
    setDescriptions(updatedDescriptions);
  };

  const handleEditIconClick = (index) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (index) => {
    setEditingIndex(-1);
    const updatedScenarios = scenarioData.map((scenario, idx) => {
      return idx === index ? { ...scenario, value: descriptions[idx] } : scenario;
    });
    setScenarioData(updatedScenarios);
    localStorage.setItem('generatedScenario', JSON.stringify({ scenarios: updatedScenarios }));
  };

  const downloadExcel = () => {
    const selectedScenarios = scenarioData.filter((_, index) => checkedScenarios[index]);
    if (selectedScenarios.length === 0) {
      alert("No scenarios selected for download.");
      return;
    }
    const formattedScenarios = selectedScenarios.map(scenario => ({
      Scenario: scenario.name, // Change 'name' to 'Scenario'
      Description: scenario.value // Change 'value' to 'Description'
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedScenarios);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Scenarios');
  
    const uploadedFileName = localStorage.getItem('uploadedFileName');
    const fileName = uploadedFileName ? `${uploadedFileName.split('.')[0]}.xlsx` : 'default.xlsx';
    XLSX.writeFile(workbook, fileName);
  };
  

  const downloadFeatureFormat = () => {
    const selectedScenarios = scenarioData.filter((_, index) => checkedScenarios[index]);
    if (selectedScenarios.length === 0) {
      alert("No scenarios selected for download.");
      return;
    }
    const featureData = selectedScenarios.map((scenario) => 
      `SCENARIO : ${scenario.name}\nDESCRIPTION : ${scenario.value}`
    ).join('\n\n'); 
    const blob = new Blob([featureData], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const uploadedFileName = localStorage.getItem('uploadedFileName');
    const fileName = uploadedFileName ? `${uploadedFileName.split('.')[0]}.Feature` : 'default.Feature';
    link.download = fileName;
    link.click();
  };
  
  const handleSelectAllChange = () => {
    const newCheckedState = !selectAll;

    console.log("newCheckedState", newCheckedState)

    setCheckedScenarios(new Array(scenarioData.length).fill(newCheckedState));
    setSelectAll(newCheckedState);
  };

  if (isLoading) {
    return <Typography variant="body2" style={{ textAlign: 'center', color: '#555' }}>Loading...</Typography>;
  }

  return (
    <div className="generated-scenarios-container">
      <Paper elevation={3} className="scenarios-paper">
        <Typography variant="h6" className="scenarios-title">
          <span className="title-icon">✨</span> AI Generated Scenarios
        </Typography>

        <Box className="select-all-box">
          <Checkbox
            color="primary"
            checked={selectAll}
            onChange={handleSelectAllChange}
          />
          <Typography variant="body1" className="select-all-text">Select All</Typography>
        </Box>

        {scenarioData.length > 0 ? (
          scenarioData.map((scenario, index) => (
            <Box key={index} className="scenario-box">
              <Checkbox
                color="primary"
                className="scenario-checkbox"
                checked={checkedScenarios[index] || false} // Ensure this is based on state
                onChange={() => handleCheckboxChange(index)}
              />
              <div className="scenario-content">
                <Typography variant="body1" className="scenario-name"> <b> {scenario.name} </b > </Typography>

                {editingIndex === index ? (
                  <TextareaAutosize
                    minRows={3}
                    value={descriptions[index]}
                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    className="description-textarea"
                  />
                ) : (
                  <Typography className="description-text">{descriptions[index]}</Typography>
                )}
              </div>
              <IconButton onClick={() => editingIndex === index ? handleSaveEdit(index) : handleEditIconClick(index)} className="edit-icon">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {editingIndex === index ? <SaveIcon /> : <CreateIcon />} 
                  </Box>
              </IconButton>
            </Box>
          ))
        ) : (
          <Typography variant="body2" style={{ textAlign: 'center', color: '#555' }}>
            No scenarios available.
          </Typography>
        )}

        <Box className="button-container">
          <Button onClick={downloadExcel} className="download-button excel-button">
            <GetAppIcon />&nbsp; Excel
          </Button>

          <Button onClick={downloadFeatureFormat} className="download-button feature-button">
            <TextSnippetIcon />  &nbsp;  Feature
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default GeneratedScenarios;
