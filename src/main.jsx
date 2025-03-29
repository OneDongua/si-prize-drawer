import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PrizeDrawer from "./components/PrizeDrawer";
import "./index.css";
import AppBar from "./components/AppBar";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppBar title="抽奖器" />
    <div
      style={{
        display: "flex",
        gap: "1rem",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}>
      <PrizeDrawer />
    </div>
  </StrictMode>
);
