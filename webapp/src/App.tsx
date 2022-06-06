import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AutomationRoute } from 'routes/automation';
import { useConnectedApiService } from 'apiService';
import { ErrorBoundary } from 'components/ErrorBoundary';
import { CookiesProvider } from "react-cookie";

function App() {
  const api = useConnectedApiService();

  return (
    <div className="app">
      <ErrorBoundary>
        <CookiesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="*" element={<AutomationRoute api={api} />} />
            </Routes>
          </BrowserRouter>
        </CookiesProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
