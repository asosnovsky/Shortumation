import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AutomationRoute } from 'routes/automation';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<AutomationRoute />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
