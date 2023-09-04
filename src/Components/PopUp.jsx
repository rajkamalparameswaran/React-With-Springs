const PopUp = ({ errorMsg, reasons, onClose }) => {
  return (
    <>
      {/* <div className="PopUpOutLine"> */}
        <div className="PopUpInline">
          <button onClick={onClose}>X</button>
          <h1>{errorMsg}</h1>
          <ul>
            {reasons && reasons.map((data) => <li key={data}>{data}</li>)}
          </ul>
        </div>
      {/* </div> */}
    </>
  );
};

export default PopUp;
