import React from 'react';
import { Editor, EditorState, Modifier } from 'draft-js';
import SpeechToText from './SpeechToText.jsx';
import request from 'superagent';

class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      title: ''
    };

    this.onChange = (editorState) => {
      this.setState({ editorState });
    };

    this.titleChange = (event) => {
      this.setState({ title: event.target.value });
    };

    this.submitNote = () => {
      const userNote = this.state.editorState
        .getCurrentContent().getPlainText();
      const userTitle = this.state.title;
      const username = this.props.username;
      const url = 'api/save-note';
      request
        .post(url)
        .send({
          user_id: username,
          text: userNote,
          title: userTitle
        })
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (err) {
            console.log('There is an error in submitNote: ', err);
          }
        });
    };
  }

  addText(string) {
    const editorState = this.state.editorState;
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    // string should equal the text that we are trying to insert
    const insert = Modifier.insertText(contentState, selection, string);
    const es = EditorState.push(editorState, insert, 'insert-fragment');
    this.setState({ editorState: es });
  }

  render() {
    return (
      <div>
        <div>
          <SpeechToText addText={string => this.addText(string)} />
          <input
            type="text"
            value={this.state.value}
            onChange={this.titleChange}
            placeholder="Title"
          />
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            placeholder="Type your note here... "
          />
        </div>
        <div>
          <input
            onClick={this.submitNote}
            type="button"
            value="Submit"
          />
        </div>
      </div>

    );
  }
}


MyEditor.propTypes = {
  username: React.PropTypes.string
};

export default MyEditor;
