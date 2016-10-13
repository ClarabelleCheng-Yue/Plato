import React from 'react';
import { Link, browserHistory } from 'react-router';
import { Navbar, NavItem } from 'react-materialize';
import request from 'superagent';

const logout = () => {
  request
    .get('/api/auth/logout')
    .end((err, res) => {
      if (err) {
        // do something on error
        console.log('error logging out!');
      } else {
        // successful login
        console.log('It successfully logged out of the user');
        browserHistory.push('/login');
      }
    });
};


const NavBar = () => (
  <div>
    <Navbar brand="Plato" right>
      <NavItem><Link to="/login">Login</Link></NavItem>
      <NavItem onClick={logout}>Logout</NavItem>
    </Navbar>
  </div>
);

export default NavBar;
