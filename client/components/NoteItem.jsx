import React from 'react';
import { Button } from 'react-materialize';
import { createEditorState } from 'medium-draft';
import { connect } from 'react-redux';
import request from 'superagent';

import * as a from './../actions.js';

const mapStateToProps = state => ({
  username: state.username
});
const mapDispatchToProps = dispatch => ({
  loadNote: (newEditorState, title) => {
    dispatch(a.onTextEditorChange(newEditorState));
    dispatch(a.onSessionTitleCreate(title));
  },
  loadTranscript: (newEditorState) => {
    dispatch(a.onSpeechEditorChange(newEditorState));
  },
  deleteNote: (noteId, username) => (
    dispatch(a.deleteSession(noteId, username))
  )
});

class NoteItem extends React.Component {
  constructor(props) {
    console.log(props);
    super(props);

    this.state = {
      displayShare: false,
      email: ''
    };

    this.toggleDisplayShare = () => {
      this.setState({
        displayShare: !this.state.displayShare
      });
    };

    // take noteId and e-mail, send post request to db to get
    // db to look up the noteId and create a new noteId under
    // that user's name
    this.shareNote = (e) => {
      e.preventDefault();
      this.toggleDisplayShare();
      request
        .post('/api/social/share-note')
        .send({
          noteId: this.props.noteId,
          email: this.state.email,
          originEmail: this.props.username
        })
        .end((err, res) => {
          if (err) {
            console.log(err);
            console.log('Error sharing notes ... ');
          } else {
            // success
            console.log('Shared the note!');
          }
        });
    };
  }

  render() {
    console.log('NOTE ITEM props: ', this.props);
    return (
      <li>
        <p>{this.props.title}</p>
        <Button
          onClick={() => {
            // get new store state for editors
            const newNoteState =
              createEditorState(JSON.parse(this.props.notesText));
            const newTranscriptState =
              createEditorState(JSON.parse(this.props.transcriptText));
            // load each editor onto page.
            this.props.loadNote(newNoteState, this.props.title);
            this.props.loadTranscript(newTranscriptState);
          }}
        > display </Button>
        <Button
          onClick={() => {
            this.props.deleteNote(this.props.noteId, this.props.username);
          }}
          waves="light"
        > deleteNote </Button>
        <Button onClick={this.toggleDisplayShare}>
          SHARE
        </Button>
        {this.state.displayShare ?
          <form onSubmit={this.shareNote}>
            <input
              type="email"
              placeholder="E-mail address"
              onChange={e => this.setState({ email: e.target.value })}
            />
            <input type="submit" value="share" />
          </form> : null
        }
      </li>
    );
  }
}

NoteItem.propTypes = {
  title: React.PropTypes.string,
  noteId: React.PropTypes.string,
  username: React.PropTypes.string,
  transcriptText: React.PropTypes.object,
  notesText: React.PropTypes.object,
  loadNote: React.PropTypes.func,
  loadTranscript: React.PropTypes.func,
  deleteNote: React.PropTypes.func
};

const NoteItemContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NoteItem);


export default NoteItemContainer;
