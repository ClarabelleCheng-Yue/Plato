import React from 'react';
import { Link, browserHistory } from 'react-router';
import request from 'superagent';

const logoutfun = () => {
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
    <h3>Platonotes</h3>
    <ul>
      <li><Link to="/login">login</Link></li>
      <li><button onClick={logoutfun}>logout</button></li>
    </ul>
  </div>
);


export default NavBar;
