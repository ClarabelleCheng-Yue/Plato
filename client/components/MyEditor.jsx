import React from 'react';
import { Editor, EditorState, convertToRaw } from 'draft-js';
import request from 'superagent';

class MyEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: props.currentNote,
      title: props.currentNoteTitle
        // editorState: EditorState.createEmpty(),
        // title: ''
    };

    this.onChange = (editorState) => {
      this.setState({ editorState });
    };

    this.titleChange = (event) => {
      this.setState({ title: event.target.value });
    };

    this.submitNote = () => {
      // this will let us save the current content as rich text
      const userNote = convertToRaw(this.state.editorState.getCurrentContent());
      // console.log(convertToRaw(this.state.editorState.getCurrentContent()));
      // const userNote = this.state.editorState
      //   .getCurrentContent().getPlainText();
      const userTitle = this.state.title;
      const username = this.props.username;
      const url = 'api/save-note';

      console.log(userNote, 'user note'); // text is in here.
      
      request
        .post(url)
        .send({
          user_id: username,
          text: JSON.stringify(userNote),
          title: userTitle
        })
        .set('Accept', 'application/json')
        .end((err, res) => {
          if (err) {
            console.log('There is an error in submitNote: ', err);
          }
          console.log(res, 'new note submitted!!');
        });
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      editorState: newProps.currentNote,
      title: newProps.currentNoteTitle
    });

    console.log(this.state.editorState, 'new editor state');
    console.log(this.state.title, 'new title');
  }

  render() {
    return (
      <div className="editor">
        <div>
          <input
            type="text"
            value={this.state.title}
            onChange={this.titleChange}
            placeholder="Title"
          />
          <Editor
            editorState={this.state.editorState}
            onChange={e => this.onChange(e)}
            placeholder="Type your note here... "
          />
        </div>
        <div>
          <input
            onClick={() => this.submitNote()}
            type="button"
            value="Submit"
          />
        </div>
      </div>

    );
  }
}

MyEditor.propTypes = {
  username: React.PropTypes.string,
  currentNoteTitle: React.PropTypes.string,
  currentNote: () => null
};

export default MyEditor;
