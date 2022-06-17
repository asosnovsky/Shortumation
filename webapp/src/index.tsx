import React from "react";
import ReactDOM from "react-dom";
import "./styles/root.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.info))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.info);

// import { createRoot } from 'react-dom/client';
// const container = document.getElementById('root');
// const root = createRoot(container!);
// root.render(<React.StrictMode>
//     <App />
//   </React.StrictMode>);
