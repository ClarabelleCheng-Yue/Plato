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
          <Col s={3} className="light-blue darken-4 base-col-height left-panel" id="notelist">
            <h7 className="h7">{this.props.username}'s Notes</h7>
            <SearchBarContainer />
            <NoteListContainer />
            <ChatClientComponent id="chat" />
          </Col>
          <Col s={9} className="base-col-height">
            <SessionContainer />
          </Col>
        </Row>

        <Row>
          <Col s={9} className="base-col-height" id="canvas" offset="s3">
            <Canvas />
          </Col>
        </Row>

        <div
          className="fixed-action-btn vertical"
          style={{ bottom: 45, right: 24 }}
        >
          <a
            className="btn-floating btn-large"
            style={{ backgroundColor: '#696969' }}
          >
            <i className="large material-icons">mode_edit</i>
          </a>
          <ul className="dashboard-fab">
            <li>
              <a
                className="btn-floating btn-large yellow darken-1"
                onClick={() => toggleVisibility('notelist')}
              ><span>Notes</span></a></li>
            <li>
              <a
                className="btn-floating btn-large yellow darken-1"
                onClick={() => toggleVisibility('transcript')}
              ><span>Scribe</span></a></li>
            <li>
              <a
                className="btn-floating btn-large yellow darken-1"
                onClick={() => toggleVisibility('canvas')}
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
