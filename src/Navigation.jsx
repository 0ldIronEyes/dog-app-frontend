import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import UserContext from "./UserContext";
import "./navigation.css";


/** Navigation bar for site. Shows up on every page.
 *
 * When user is logged in, shows links to main areas of site. When not,
 * shows link to Login and Signup forms.
 *
 */

function Navigation() {
  const { currentUser, logout } = useContext(UserContext);
  console.debug("Navigation", "currentUser=", currentUser);

  function loggedInNav() {
    return (
        <ul className="nav-ul">
          <li> 
                <div className="inline"><Link to={`/account/${currentUser.username}`}>{currentUser.username}</Link>  </div>
          </li>
        
          <li>
                <div className="inline" ><Link to={`/edit`}> Edit Profile </Link>  </div>
          </li>
          <li>
                <div className="inline"><Link to={`/`} onClick={logout}> Log Out </Link>  </div>
          </li>
        </ul>
    );
  }

  function loggedOutNav() {
    return (
        <ul className="nav-text">
          Please Log in or Sign up
        </ul>
    );
  }

  return (
      <nav className="nav-class">
        {currentUser ? loggedInNav() : loggedOutNav()}
      </nav>
  );
}

export default Navigation;
