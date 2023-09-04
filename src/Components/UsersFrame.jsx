import { Link } from "react-router-dom";

const UsersFrame = ({ users, title }) => {
  return (
    <div className="UsersFrame">
      <h1>{title}</h1>
      {users.map((user) => (
       <Link to={`/User/${user.userId}`} key={user.userId} >
        <div className="UserFrame" >
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFHZsc3xwRGK_buY_o47OogoecMLL8W_dfjw&usqp=CAU"
            alt="NoImg"
          ></img>
          <hr />
          <h3>{user.userName}</h3>
        </div>
       </Link>
      ))}
    </div>
  );
};

export default UsersFrame;
