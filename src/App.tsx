import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Navbar, { ROUTES } from "./components/Navbar";
import ApexEditor from "./features/ApexEditor";
import Debugging from "./features/Debugging";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path={ROUTES.root} element={<h1>root</h1>} />
        <Route path={ROUTES.apexConsole} element={<ApexEditor />} />
        <Route path={ROUTES.debugging} element={<Debugging />} />
      </Routes>
    </Router>
  );
}

export default App;
