import { useState } from "react";
import { Link } from "react-router-dom";
import PopUp from "./PopUp";

const SignIn = () => {
  const [formData, setFormData] = useState({
    userName: ``,
    userFullName: ``,
    userEmail: ``,
    userPassword: ``,
    userAddresses: ``,
    userRoles: [],
  });
  const [addresses, setAddresses] = useState("");

  let [errors, setError] = useState(false);

  let handleChanges = (event) => {
    const { name, value } = event.target;
    if (name === "userRoles") {
      if (event.target.checked) {
        formData.userRoles.push(value);
      }
    } else if (name === "userAddresses") {
      setAddresses(value);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  let formSubmit = async (event) => {
    try {
      event.preventDefault();
      formData.userAddresses = addresses.split(",");
      setFormData({ ...formData });

      const response = await fetch("http://localhost:9098/addUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.statusCode == 1) {
        alert(data.result);
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
        <div className="SignIn">
          <h1>SIGN IN</h1>
          <form onSubmit={formSubmit}>
            <input
              type="text"
              placeholder="Enter User Name"
              name="userName"
              value={formData.userName}
              onChange={handleChanges}
            />
            <input
              type="text"
              placeholder="Enter User Full Name"
              name="userFullName"
              value={formData.userFullName}
              onChange={handleChanges}
            />
            <input
              type="email"
              placeholder="Enter User Email"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChanges}
            />
            <input
              type="password"
              placeholder="Enter User Password"
              name="userPassword"
              value={formData.userPassword}
              onChange={handleChanges}
            />
            <textarea
              name="userAddresses"
              cols="10"
              rows="3"
              value={addresses}
              onChange={handleChanges}
              placeholder="Enter Addresses"
            />

            <div className="userRoles">
              <h3>Select Roles</h3>
              <hr />
              <input
                type="checkbox"
                name="userRoles"
                id="admin"
                value="ADMIN"
                onChange={handleChanges}
              />
              <label htmlFor="admin">ADMIN</label>

              <input
                type="checkbox"
                name="userRoles"
                id="user"
                value="USER"
                onChange={handleChanges}
              />
              <label htmlFor="user">USER</label>
            </div>
            <button type="submit">Submit</button>
            <Link to="/LogIn">
              <button>LogIn</button>
            </Link>
          </form>
        </div>
   
    </>
  );
};

export default SignIn;
