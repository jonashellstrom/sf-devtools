import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Navbar, { ROUTES } from "./features/NavBar/Navbar";
import ApexEditor from "./features/ApexEditor";
import Dashboard from "./features/Dashboard";
import Debugging from "./features/Debugging";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path={ROUTES.root} element={<Dashboard />} />
        <Route path={ROUTES.apexConsole} element={<ApexEditor />} />
        <Route path={ROUTES.debugging} element={<Debugging />} />
      </Routes>
    </Router>
  );
}

export default App;
