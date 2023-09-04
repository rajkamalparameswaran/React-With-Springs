import { useNavigate } from "react-router-dom";
const SuccessMsg = ({ msg, navigateValue, onClose }) => {
    console.log(msg);
    console.log(navigateValue);
    let navs=useNavigate();
    let changePage=(navigateValue)=>{
        console.log(msg);
        console.log(navigateValue);
        navs(navigateValue);
        onClose();
    }
  return (
    <div className="PopUpInline">
      <button onClick={onClose}>X</button>
      {navigateValue ? (
        <>
          {<h1>{msg}</h1> && changePage(navigateValue)}
          
        </>
      ) : (
        <h1>{msg}</h1>
      )}
    </div>
  );
};

export default SuccessMsg;
