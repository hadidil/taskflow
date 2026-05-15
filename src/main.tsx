import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { useEffect } from "react";
import { Provider, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { setAuthToken } from "./api/axios";
import { store, type RootState } from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function AuthTokenSync() {
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthTokenSync />
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
