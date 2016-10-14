import React from 'react';
import { connect } from 'react-redux';

import $ from 'jquery';

import socket from './../socket.js';
import { loadNewChatMessage, loadArchivedChatMessages } from './../actions';
import ChatMessagesDisplay from './ChatMessagesDisplay.jsx';

const mapStateToProps = state => ({
  messages: state.chatMessages,
  username: state.username
});

const mapDispatchToProps = dispatch => ({
  onMessageSubmit: (messageObj) => {
    dispatch(loadNewChatMessage(messageObj));
    socket.emit('new chat message', messageObj);
  },
  clearChatRoom: () => dispatch(loadArchivedChatMessages([]))
});

class ChatClient extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chatRoom: '',
      loadRoom: () => socket.emit('load chat room', this.state.chatRoom),
      message: '',
      ...props
    };
  }
  componentWillMount() {
    this.state.loadRoom();
  }
  componentWillReceiveProps(newProps) {
    if (this.props.username !== newProps.username) {
      this.setState({
        username: newProps.username
      });
    }
  }
  componentDidUpdate() {
    const main = $('#chat-messages-display')[0];
    if (main.scrollHeight > 450) {
      $(main).animate({ scrollTop: main.scrollHeight }, 2000);
    }
  }
  render() {
    return (
      <div className="chat-client-container card light-blue darken-3">
        <div className="card-content white-text center-align">
          <form
            className="chat-room-select"
            onSubmit={(e) => {
              e.preventDefault();
              this.state.clearChatRoom();
              this.state.loadRoom();
            }}
          >
            <span
              className="center-align card-title chat-room-header"
            >
              Room:
            </span>
            <input
              name="chat-room-select-input"
              type="text"
              placeholder="type room name"
              value={this.state.chatRoom}
              onChange={e => this.setState({ chatRoom: e.target.value })}
            />
          </form>
          <p>Chat:</p>
          <ChatMessagesDisplay
            messages={this.props.messages}
          />
          <form
            className="chat-client-input"
            onSubmit={(e) => {
              e.preventDefault();
              const messageObj = {
                room_id: this.state.chatRoom,
                user_id: this.state.username,
                text: this.state.message,
                timestamp: Date.now()
              };
              this.state.onMessageSubmit(messageObj);
              this.setState({ message: '' });
            }}
          >
            <input
              className="chat-message-input"
              name="chat-message-input"
              type="text"
              placeholder="start typing..."
              value={this.state.message}
              onChange={e => this.setState({ message: e.target.value })}
            />
          </form>
        </div>
      </div>
    );
  }
}

const ChatClientContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatClient);

ChatClient.propTypes = {
  username: React.PropTypes.String,
  messages: () => null
};

export default ChatClientContainer;
