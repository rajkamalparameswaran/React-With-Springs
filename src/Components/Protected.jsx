import { Navigate } from "react-router-dom";
import NavBar from "./NavBar";
import { useState } from "react";

const Protected = ({ Child }) => {
  let jwt = null;

  async function fetchData(jwt) {
    let response = await fetch("http://localhost:9098/getCurrentUser", {
      method: "GET",
      headers: { Authorization: "Bearer " + jwt },
      redirect: "follow",
    });

    if (response.status === 200) {
      return true;
    } else {
      return false;
    }
  }

  let verify = () => {
    jwt = localStorage.getItem("jwt");
    if (jwt !== null && fetchData(jwt)) {
      return true;
    }
    return false;
  };

  return (
    <>
      {verify() ? (
        <>
          <NavBar></NavBar>
          <Child jwt={jwt}></Child>
        </>
      ) : (
        <Navigate to="/LogIn"></Navigate>
      )}
    </>
  );
};

export default Protected;
