import './App.css';
import LandingPage from './components/landing/LandingPage';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

function App() {
  return (
    <BrowserRouter> {/* Wrap your app with BrowserRouter */}
      <div className="App">
        <LandingPage />
      </div>
    </BrowserRouter>
  );
}

export default App;
