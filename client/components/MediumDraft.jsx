import React from 'react';
import { Editor } from 'medium-draft';
import { connect } from 'react-redux';

import * as a from './../actions.js';

const mapStateToProps = state => ({
  currentNote: state.textEditor,
  title: state.sessionTitle
});

const mapDispatchToProps = dispatch => ({
  fetchNotes: username => dispatch(a.fetchNotes(username)),
  onNoteChange: newEditorState => dispatch(a.onTextEditorChange(newEditorState)),
  onTitleChange: e => (
    dispatch(a.onSessionTitleCreate(e.target.value))
  )
});

const MediumEditor = props => (
  <div>
    <input
      type="text"
      value={props.title}
      onChange={props.onTitleChange}
      placeholder="Title"
    />
    <Editor
      editorState={props.currentNote}
      onChange={props.onNoteChange}
      placeholder="Start typing here ..."
    />
  </div>
);


const MediumEditorContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MediumEditor);

export default MediumEditorContainer;

MediumEditor.propTypes = {
  title: React.PropTypes.string,
  onTitleChange: React.PropTypes.func,
  currentNote: React.PropTypes.func,
  onNoteChange: React.PropTypes.func
};
