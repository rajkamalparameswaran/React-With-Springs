import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PopUp from "./PopUp";
import React from 'react';

const UserPage = ({ jwt, curentUser }) => {
  let { userId } = useParams();
  let [user, setUser] = useState(null);
  let [errors, setError] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    try {
      async function fetchUser() {
        let url;
        if (curentUser) {
          url = `http://localhost:9098/getUserByName/${curentUser}`;
        } else {
          url = `http://localhost:9098/getUserById/${userId}`;
        }
        let response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwt,
          },
        });
        let data = await response.json();
        if (response.status === 302) {
          if (curentUser === undefined && userId !== undefined) {
            setUser(data.user);
          } else {
            setUser(data);
          }
        } else if (response.status === 403) {
          alert("You dont Have access to view this page");
          window.history.go(-1);
        } else {
          setError({ errorMsg: data.errorMsg, reasons: [data.Reason] });
        }
      }
      fetchUser();
    } catch (error) {
      setError({ errorMsg: "server error", reasons: false });
    }
  }, [jwt, curentUser, userId]);

  let handleLogOut = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + jwt);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };
    fetch("http://localhost:9098/logOut", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        localStorage.removeItem("jwt");
        alert(result.Msg);
        nav("/LogIn");
      })
      .catch((error) => {
        setError({ errorMsg: error.errorMsg, reasons: error.Reason });
      });
  };
  let handleDeleteAccount = (userId) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + jwt);
    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };
    fetch(`http://localhost:9098/deleteUserById/${userId}`, requestOptions)
      .then((response) => {
        if (response.status === 403 || response.status === 400) {
          throw Error("You Dont Have Access to this page");
        }
        return response.json();
      })
      .then((result) => {
        localStorage.removeItem("jwt");
        alert(result.Message);
        nav("/");
      })
      .catch((error) => {
        setError({ errorMsg: error.toString(), reasons: null });
      });
  };
  return (
    <>
      {errors ? (
        <PopUp
          errorMsg={errors.errorMsg}
          reasons={errors.reasons}
          onClose={() => {
            setError(false);
          }}
        ></PopUp>
      ) : (
        <>
          {user === null ? (
            <h1>Loading.......</h1>
          ) : (
            <div className="UserPage">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD-km6iq3XJexHyKwaOBbtKnvamGuhqLEXjoUsegMIKv56jU9ZZkfaluGi9mPA6IJBTac&usqp=CAU"
                alt="NoImg"
              />
              <h1>UserName : {user.userName}</h1>
              <hr />
              <h3>UserFullName : {user.userFullName}</h3>
              <hr />
              <h3>UserEmail : {user.userEmail}</h3>
              <hr />
              <div className="OuterContainer">
                <div className="InlineContainer">
                  <label>UserAddresses :</label>
                  <ul>
                    {user.userAddresses.map((address) => (
                      <li key={address}>{address}</li>
                    ))}
                  </ul>
                </div>
                <hr />
                <div className="InlineContainer">
                  <label>UserRoles :</label>
                  <ul>
                    {user.userRoles.map((role) => (
                      <li key={role}>{role}</li>
                    ))}
                  </ul>
                </div>
                <hr />
                <div className="InlineContainer">
                  <label>Privileges :</label>
                  <ul>
                    {user.privileges.map((privilege) => (
                      <li key={privilege}>{privilege}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {curentUser && (
                <div className="LogoutAndDelete">
                  <button onClick={handleLogOut}>LogOut</button>
                  <button
                    onClick={() => {
                      handleDeleteAccount(user.userId);
                    }}
                  >
                    Delete Account
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default UserPage;
