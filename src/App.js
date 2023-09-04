import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Components/Login";
import SignIn from "./Components/SignIn";
import Protected from "./Components/Protected";
import Home from "./Components/Home";
import UserPage from "./Components/UserPage";
import Setting from "./Components/Setting";
import UpdatePage from "./Components/UpdatePage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<SignIn></SignIn>} />
          <Route path="/LogIn" element={<Login></Login>} />
          <Route path="/Home" element={<Protected Child={Home}></Protected>} />
          <Route
            path="/User/:userId"
            element={<Protected Child={UserPage}></Protected>}
          ></Route>
          <Route
            path="/Setting"
            element={<Protected Child={Setting}></Protected>}
          ></Route>
          <Route
            path="/Update"
            element={<Protected Child={UpdatePage}></Protected>}
          ></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
