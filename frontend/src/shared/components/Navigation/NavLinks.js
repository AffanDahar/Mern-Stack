import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

import './NavLinks.css';

const NavLinks = props => {

  const {isLogin , Logout} = useContext(AuthContext)
  return <ul className="nav-links">
    <li>
      <NavLink to="/" exact>ALL USERS</NavLink>
    </li>
    {isLogin && <li>
      <NavLink to="/u1/places">MY PLACES</NavLink>
    </li> }
    {isLogin && <li>
      <NavLink to="/places/new">ADD PLACE</NavLink>
    </li>}
    {!isLogin && <li>
      <NavLink to="/authentication">AUTHENTICATE</NavLink>
    </li> }
    {isLogin && 
    <li>
      <button onClick={Logout}>Logout</button>
    </li>
    }
  </ul>
};

export default NavLinks;