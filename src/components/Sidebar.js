import React from 'react'
import AssistantIcon from '@mui/icons-material/Assistant';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMoon, faStar, faCog } from '@fortawesome/free-solid-svg-icons';

function Sidebar() {
  return (
    <div className="sidebar">
    <div className="sidebar-icon">
      <AssistantIcon size="5x" />
    </div>
    <div className="sidebar-options">
      <div className="icon"><FontAwesomeIcon icon={faPlus} /></div>
      <div className="icon"><FontAwesomeIcon icon={faMoon} /></div>
      <div className="icon"><FontAwesomeIcon icon={faStar} /></div>
      <div className="icon"><FontAwesomeIcon icon={faCog} /></div>
    </div>
  </div>
  )
}

export default Sidebar
