import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import { useState } from "react";

function App() {
  const [details, setDetails] = useState({
    access_token: "",
    master_password: "",
    salt: "",
  });
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage setDetails={setDetails} />} />
          <Route
            path="/passwords"
            element={<LandingPage details={details} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
