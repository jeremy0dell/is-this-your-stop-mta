import arrowCircle from "../assets/images/arrowCircle.png";

const IntroScreen = ({ id, opacity, onClick, children }) => {
  return (
    <div
      id={id}
      style={{
        opacity,
        height: "calc(100vh - 60px)",
        position: "absolute",
        width: "33%",
        margin: "20px 30px 20px 0px",
        borderRadius: 20,
        backgroundColor: "white",
        color: "black",
        display: "flex",
        flexDirection: "column",
        zIndex: 10,
      }}
    >
      <div
        style={{ width: "100%", height: "12%", backgroundColor: "black" }}
      ></div>
      <div
        style={{
          height: "64%",
          padding: "5% 5%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
        }}
      >
        {children}
      </div>
      <div
        onClick={onClick}
        style={{
          width: "100%",
          height: "12%",
          backgroundColor: "#FF9C28",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <img style={{ height: "50%" }} src={arrowCircle} alt="Scroll down arrow" />
        <div style={{ fontWeight: "bold", marginLeft: 12, fontSize: 45 }}>
          Next Stop
        </div>
      </div>
      <div
        style={{
          width: "100%",
          height: "12%",
          backgroundColor: "#E5E6EB",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 14,
        }}
      >
        <div style={{ padding: "0px 5%" }}>
          <div>The New School</div>
          <div>Parsons School of Art & Design</div>
          <div>Masters of Science, Data Visualization</div>
        </div>
        <div style={{ padding: "0px 5%" }}>
          <div>Jeremy Odell</div>
          <div>MSDV Thesis</div>
          <div>Spring 2022</div>
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;
