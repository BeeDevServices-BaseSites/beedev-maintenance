import { Routes, Route, Navigate } from "react-router-dom";
import MaintenancePage from "./views/MaintenancePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/custom/default" replace />} />

      <Route path="/client/:slug" element={<MaintenancePage mode="client" />} />
      <Route path="/emergency/:slug" element={<MaintenancePage mode="emergency" />} />
      <Route path="/custom/:slug" element={<MaintenancePage mode="custom" />} />

      <Route
        path="/beedev"
        element={<MaintenancePage mode="beedev" slugOverride="beedev-services" />}
      />

      <Route
        path="*"
        element={<MaintenancePage mode="custom" slugOverride="custom-default" />}
      />
    </Routes>
  );
}