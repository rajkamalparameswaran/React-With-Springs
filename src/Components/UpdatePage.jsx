import { useEffect, useState } from "react";
import PopUp from "./PopUp";

const UpdatePage = ({ jwt }) => {
  let [errors, setError] = useState(null);
  const originalCheckBoxRolesValue = ["ADMIN", "USER"];
  const originalCheckBoxPrivilegesValue = [
    "UPDATE",
    "DELETE",
    "FETCH",
    "NOACCESS",
  ];
  let [addresses, setAddresses] = useState("");
  let [anyChanges, setAnyChanges] = useState(false);
  let [validEmail, setValidEmail] = useState(true);
  let [validUserName, setValidUserName] = useState(true);

  let [user, SetUser] = useState({
    userId: "",
    userName: null,
    userFullName: null,
    userEmail: null,
    userAddresses: [],
    userRoles: [],
    privileges: [],
    accountNonExpired: null,
    accountNonLocked: null,
    credentialsNonExpired: null,
    enabled: null,
  });
  useEffect(() => {
    async function fetchCurrentUserName(jwt) {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + jwt);
      var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch("http://localhost:9098/getCurrentUser", requestOptions)
        .then((response) => {
          if (response.status === 200) {
            return response.text();
          }
          throw Error("Something wrong please Login again");
        })
        .then((result) => {
          fetchCurrentUser(result, requestOptions);
        })
        .catch((error) =>
          setError({ errorMsg: error.toString(), reasons: false })
        );
    }
    fetchCurrentUserName(jwt);
  }, [jwt]);

  async function fetchCurrentUser(userName, requestOptions) {
    fetch(`http://localhost:9098/getUserByName/${userName}`, requestOptions)
      .then((response) => {
        if (response.status === 302) {
          return response.json();
        }
        throw Error("User Data Not Fetched");
      })
      .then((result) => {
        SetUser({
          userId: result.userId,
          userName: result.userName,
          userFullName: result.userFullName,
          userEmail: result.userEmail,
          userRoles: result.userRoles,
          privileges: result.privileges,
          accountNonExpired: result.accountNonExpired,
          accountNonLocked: result.accountNonLocked,
          credentialsNonExpired: result.credentialsNonExpired,
          enabled: result.enabled,
        });
        setAddresses(result.userAddresses.join(","));
      })
      .catch((error) => {
        setError({ errorMsg: error.toString(), reasons: false });
      });
  }
  let handleChanges = (event) => {
    setAnyChanges(true);
    const { name, value } = event.target;
    if (name === "userRoles") {
      if (event.target.checked) {
        user.userRoles.push(value);
        SetUser({ ...user });
      } else {
        user.userRoles.splice(
          user.userRoles.findIndex((role) => {
            return role === value;
          }),
          1
        );
        SetUser({ ...user });
      }
    } else if (name === "privileges") {
      if (event.target.checked) {
        user.privileges.push(value);
        SetUser({ ...user });
      } else {
        user.privileges.splice(
          user.privileges.findIndex((privilege) => {
            return privilege === value;
          }),
          1
        );
        SetUser({ ...user });
      }
    } else if (name === "userAddresses") {
      setAddresses(value);
    } else {
      SetUser({
        ...user,
        [name]: value,
      });
    }
  };

  let handleUpdate = (event) => {
    event.preventDefault();
    user.userAddresses = addresses.split(",");
    SetUser({ ...user });
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + jwt);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: JSON.stringify(user),
      redirect: "follow",
    };

    fetch("http://localhost:9098/updateUser", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.statusCode === 1) {
          setError({ errorMsg: result.result, reasons: false });
        } else {
          setError({ errorMsg: result.errorMsg, reasons: result.reasons });
        }
      })
      .catch((error) => console.log("error", error));
  };

  let emailValidation = (userId, event) => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `http://localhost:9098/validEmail/${userId}/${event.target.value}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        return setValidEmail(result);
      })
      .catch((error) =>
        setError({ errorMsg: error.toString(), reasons: false })
      );
  };

  let userNameValidation = (userId, event) => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `http://localhost:9098/validUser/${userId}/${event.target.value}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        return setValidUserName(result);
      })
      .catch((error) =>
        setError({ errorMsg: error.toString(), reasons: false })
      );
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
      {user.userId ? (
        <div className="UpdatePage">
          <h1>Update</h1>
          <form onSubmit={handleUpdate}>
            <input
              type="text"
              name="userName"
              placeholder="Enter User Name"
              value={user.userName}
              onChange={handleChanges}
              onBlur={(e) => {
                userNameValidation(user.userId, e);
              }}
            />
            {!validUserName && (
              <label className="existPopUp">UserName Already Exist</label>
            )}
            <input
              type="text"
              name="userFullName"
              placeholder="Enter User FullName"
              value={user.userFullName}
              onChange={handleChanges}
            />

            <input
              type="email"
              name="userEmail"
              placeholder="Enter User Email"
              value={user.userEmail}
              onChange={handleChanges}
              onBlur={(e) => {
                emailValidation(user.userId, e);
              }}
            />
            {!validEmail && (
              <label className="existPopUp">Email Already Exist</label>
            )}

            <input
              type="text"
              name="accountNonExpired"
              placeholder="accountNonExpired"
              value={user.accountNonExpired}
              onChange={handleChanges}
            />
            <input
              type="text"
              name="accountNonLocked"
              placeholder="accountNonLocked"
              value={user.accountNonLocked}
              onChange={handleChanges}
            />
            <input
              type="text"
              placeholder="enabled"
              name="enabled"
              value={user.enabled}
              onChange={handleChanges}
            />
            <input
              type="text"
              name="credentialsNonExpired"
              placeholder="credentialsNonExpired"
              value={user.credentialsNonExpired}
              onChange={handleChanges}
            />
            <input
              type="text"
              name="userAddresses"
              placeholder="Enter UserAddress"
              value={addresses}
              onChange={handleChanges}
            />

            <div className="rolesAndPrivilContainer">
              <div className="roles">
                <h2>Select Roles</h2>
                <hr />
                {originalCheckBoxRolesValue.map((role) => (
                  <>
                    <input
                      type="checkbox"
                      name="userRoles"
                      id={role}
                      value={role}
                      checked={user.userRoles.includes(role)}
                      onChange={handleChanges}
                    />
                    <label htmlFor={role} key={role + 1}>
                      {role}
                    </label>
                  </>
                ))}
              </div>
              <div className="privilleges">
                <h2>Select Privilleges</h2>
                <hr />
                {originalCheckBoxPrivilegesValue.map((privilege) => (
                  <>
                    <input
                      type="checkbox"
                      name="privileges"
                      id={privilege}
                      value={privilege}
                      checked={user.privileges.includes(privilege)}
                      onChange={handleChanges}
                    />
                    <label htmlFor={privilege}>{privilege}</label>
                  </>
                ))}
              </div>
            </div>
            <button type="submit" disabled={!anyChanges || !(validEmail && validUserName)}>
              Update
            </button>
          </form>
        </div>
      ) : (
        <h1>loading....</h1>
      )}
    </>
  );
};

export default UpdatePage;
