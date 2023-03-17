import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import List from "./components/List";

function Home() {
  const [displayEmail, displayemailUpdate] = useState("");

  useEffect(() => {
    let email = sessionStorage.getItem("email");
    displayemailUpdate(email);
  }, []);
  return (
    <div>
      <div className="header">
        <Link to={"/"}>
          <strong>Home</strong>
        </Link>
        <span style={{ marginLeft: "75%" }}>
          Welcome: <b>{displayEmail}</b>
        </span>
        <Link style={{ float: "right" }} to={"/login"}>
          <strong>Logout</strong>
        </Link>
      </div>
      <div className="body">
        <div className="row">
          <List />
        </div>
      </div>
    </div>
  );
}
export default Home;
