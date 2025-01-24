import logo from './logo.svg';
import './ListItem.css';

function ListItem() {
  return (
    <div className="ListItem">
      <header className="ListItem-header">
        <img src={logo} className="ListItem-logo" alt="logo" />
        <p>
          Edit <code>src/ListItem.js</code> and save to reload.
        </p>
        <a
          className="App-link"
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

export default ListItem;
