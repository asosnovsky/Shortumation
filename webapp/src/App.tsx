import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AutomationRoute } from 'routes/automation';
import { useConnectedApiService } from 'apiService';
import { ErrorBoundary } from 'components/ErrorBoundary';

function App() {
  const api = useConnectedApiService();

  return (
    <div className="app">
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<AutomationRoute api={api} />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </div>
  );
}

export default App;
