import React from 'react';
import { Row, Col } from 'react-materialize';
import { connect } from 'react-redux';
import ChatClientComponent from './ChatClient.jsx';
import SearchBarContainer from './SearchBar.jsx';
import NoteListContainer from './NoteList.jsx';
import SessionContainer from './Session.jsx';
import Canvas from './Canvas.jsx';

import * as a from './../actions';
// eslint-disable-next-line 
const mapStateToProps = state => ({
  username: state.username
});
const mapDispatchToProps = dispatch => ({
  onDashBoardLoad: () => dispatch(a.loadUserName())
});

class DashBoard extends React.Component {
// eslint-disable-next-line 
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.onDashBoardLoad();
  }
// eslint-disable-next-line 
  render() {
    return (
      <div>
        <Row>
          <Col s={3} className="teal lighten-3 base-col-height left-panel">
            <h7 className="h7">{this.props.username}'s Notes</h7>
            <SearchBarContainer />
            <NoteListContainer />
          </Col>
          <Col
            s={6}
            className="base-col-height center-panel"
          >
            <SessionContainer />
          </Col>
          <Col
            s={3}
            className="login right-panel"
          >
            <ChatClientComponent />
          </Col>
        </Row>
        <Row>
          <Col s={12}>
            <Canvas />
          </Col>
        </Row>
        <div
          className="fixed-action-btn vertical"
          style={{ bottom: 45, right: 24 }}
        >
          <a className="btn-floating btn-large red">
            <i className="large material-icons">mode_edit</i>
          </a>
          <ul>
            <li>
              <a
                className="btn-floating btn-large orange darken-1"
                style={{ 'font-size': 10 }}
              ><span>Note</span></a></li>
            <li>
              <a
                className="btn-floating btn-large"
                style={{ 'font-size': 10 }}
              ><span>Notes</span></a></li>
            <li>
              <a
                className="btn-floating btn-large red"
                style={{ 'font-size': 10 }}
              ><span>Scribe</span></a></li>
            <li>
              <a
                className="btn-floating btn-large"
                style={{ 'font-size': 10, 'background-color': '#696969' }}
              ><span>Chat</span></a></li>
            <li>
              <a
                className="btn-floating btn-large black"
                style={{ 'font-size': 10 }}
              ><span>Canvas</span></a></li>
          </ul>
        </div>
      </div>
    );
  }
}

DashBoard.propTypes = {
  username: React.PropTypes.string,
  onDashBoardLoad: React.PropTypes.func
};

const DashBoardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DashBoard);


export default DashBoardContainer;
