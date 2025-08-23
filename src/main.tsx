import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";

const local = window.location.host.includes("localhost");

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter basename={local ? "" : "/chess/"}>
            <App />
        </BrowserRouter>
    </StrictMode>
);
