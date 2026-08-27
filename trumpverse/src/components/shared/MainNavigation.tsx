import { Link } from "react-router-dom";
import "./MainNavigation.css";

const MainNavigation = () => {
  return (
    <nav className="navbar navbar-expand-sm justify-content-center navbar-dark">
      <ul className="navbar-nav navbar-light">
        <li className="nav-item px-3">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li className="nav-item px-3">
          <Link to="search" className="nav-link">
            Search
          </Link>
        </li>
        <li className="nav-item px-3">
          <Link to="create" className="nav-link">
            Create
          </Link>
        </li>
        <li className="nav-item  px-3">
          <Link to="edit" className="nav-link">
            Edit
          </Link>
        </li>
      </ul>
    </nav>
  );
};
export default MainNavigation;
