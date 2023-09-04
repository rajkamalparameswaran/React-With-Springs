import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PopUp from "./PopUp";
import UsersFrame from "./UsersFrame";

const Home = ({ jwt }) => {
  let navs = useNavigate();
  let [users, setUsers] = useState(null);
  let [errors, setError] = useState(false);

  useEffect(() => {
    try {
      async function fetchData() {
        let response = await fetch("http://localhost:9098/getAllUsers", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + jwt,
          },
        });
        let data = await response.json();
        if (response.status === 302) {
          setUsers(data);
        } else {
      
          alert(data.errorMsg);
          navs("/LogIn");
        }
      }
      fetchData();
    } catch (error) {
      setError({ errorMsg: "server error", reasons: false });
    }
  }, []);
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
        <div >
          {users === null ? (
            <h1>Loading.......</h1>
          ) : (
            <>
            <UsersFrame users={users.filter((user)=>{return user.userRoles.some((role)=>{ return role==="ADMIN"})})} title="ADMIN"></UsersFrame>
            <UsersFrame users={users.filter((user)=>{return user.userRoles.some((role)=>{ return role==="USER"})})} title="USER"></UsersFrame>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Home;
