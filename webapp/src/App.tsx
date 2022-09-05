import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { AutomationRoute } from "routes/automation";
import { useConnectedApiService } from "services/apiService";
import { ErrorBoundary } from "components/ErrorBoundary";
import { CookiesProvider } from "react-cookie";
import { Page } from "components/Page";

const ConnectedAutomationRoute = () => {
  const api = useConnectedApiService();
  return (
    <Page api={api}>
      <AutomationRoute api={api} />
    </Page>
  );
};

function App() {
  return (
    <div className="app">
      <ErrorBoundary>
        <CookiesProvider>
          <BrowserRouter>
            <Routes>
              <Route path="*" element={<ConnectedAutomationRoute />} />
            </Routes>
          </BrowserRouter>
        </CookiesProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;
