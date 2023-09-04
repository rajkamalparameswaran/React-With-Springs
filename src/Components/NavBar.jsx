import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="NavBarOutLet">
      <div className="NavBar">
       <Link to='/Home' id="Logo"> <img
          src="https://cloud.appsteer.io/assets/svg/appsteer_logo.svg"
          alt="NoIcon"
        /></Link>
        <div>
          <input type="text" placeholder="Enter User Name" />
          <button>search</button>
        </div>
        <Link to="/Update" className="Atag">UPDATE</Link>
        <Link to="/Setting">
          <span className="material-symbols-outlined">settings</span>
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
