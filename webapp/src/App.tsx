import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AutomationRoute } from 'routes/automation';
import { useConnectedApiService } from 'apiService';

function App() {
  const api = useConnectedApiService();
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<AutomationRoute api={api} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
