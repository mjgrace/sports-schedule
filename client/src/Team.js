import logo from "./logo.svg";
import "./Team.css";

function Team() {
  return (
    <div className="Team">
      <header className="Team-header">
        <img src={logo} className="Team-logo" alt="logo" />
        <p>
          Edit <code>src/Team.js</code> and save to reload.
        </p>
        <a
          className="Team-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default Team;
