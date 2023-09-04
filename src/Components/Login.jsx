import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PopUp from "./PopUp";


const Login = () => {
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [errors, setError] = useState(false);
  let nav = useNavigate();

  let handleLogin = async (e) => {
    try {
      e.preventDefault();
      const loginData = { userName: userName, userPassword: userPassword };
      let response = await fetch("http://localhost:9098/authenticate", {
        method: "POST",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      let data = await response.json();
      if (data.statusCode === 1) {
        localStorage.setItem("jwt", data.jwt);
        alert(data.msg);
        nav("/Home");
      
       
      } else {
        setError({ errorMsg: data.errorMsg, reasons: data.reasons });
      }
    } catch (error) {
      setError({ errorMsg: "server error", reasons: false });
    }
  };

  return (
    <>
      {errors && (
        <PopUp
          errorMsg={errors.errorMsg}
          reasons={errors.reasons}
          onClose={() => {
            setError(false);
          }}
        />
      )}
      <div className="Login">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Enter User Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter User Password"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          <Link to="/">
            <button>SignIn</button>
          </Link>
        </form>
      </div>
    </>
  );
};

export default Login;
