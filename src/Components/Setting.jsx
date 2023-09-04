import { useEffect, useState } from "react";
import UserPage from "./UserPage";

const Setting = ({ jwt }) => {
    let [user,setUser]=useState(false);
  useEffect(() => {
    
    fetchCurrentUser(jwt);
  }, [jwt]);

  async function fetchCurrentUser(jwt) {
    let response = await fetch("http://localhost:9098/getCurrentUser", {
      method: "GET",
      headers: { Authorization: "Bearer " + jwt },
      redirect: "follow",
    });

    if (response.status === 200) {
     let data= await response.text();
     setUser(data);
    } else {
     setUser(false);
    }
  }
  
  return (
    <div className="settig">
     {user===false ?(<h1>Loading...</h1>):(<UserPage jwt={jwt} curentUser={user}></UserPage>)}
    </div>
  );
};

export default Setting;
