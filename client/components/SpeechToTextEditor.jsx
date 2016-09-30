import React from 'react';
import { Editor, EditorState, Modifier } from 'draft-js';
import request from 'superagent';

// travis, stop fucking shit up
class SpeechToTextEditor extends React.Component {
  constructor(props) {
    super(props);

    this.recording = false;
    // transcript will hold our audio transcript
    window.transcript = '';
    // this will prompt user for access to their microphone
    this.recognition = new webkitSpeechRecognition();
    // set language that we will be transcribing
    this.recognition.lang = 'en-US';
    // continuous = true means transcription wont stop when there's
    // an audio pause. ie, we keep transcribing until told not to
    this.recognition.continuous = true;
    // interim results = true will have the transcription process
    // return 'half-baked' results to us. ie, results that arent necessarily correct
    this.recognition.interimResults = false;

    // function that we will fire every time an event happens, basically
    // everytime a phrase is transcribed
    this.recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        if (event.results[i].isFinal) {
          window.transcript += event.results[i][0].transcript;
        }
      }
      this.addText(window.transcript);
      // reset transcript to nothing so that we aren't duplicating results
      window.transcript = '';
    };

    this.state = {
      // this will let us create an empty editor
      editorState: EditorState.createEmpty(),
      title: '',
    };

    this.onChange = (editorState) => {
      console.log(editorState, 'speech to text state');
      this.setState({ editorState });
      console.log(editorState, 'speech to text changed');
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
          console.log(res, 'res');
        });
    };

    this.addText = (string) => {
      // get state of the editor, move the selection to end
      // so that we are inserting text at the end
      const editorState = EditorState.moveSelectionToEnd(this.state.editorState);
      // get the area that we have selected
      const selection = editorState.getSelection();
      // get contentState so we can insertText
      const contentState = editorState.getCurrentContent();
      // string should equal the text that we are trying to insert
      const insert = Modifier.insertText(contentState, selection, string);
      const newEditorState = EditorState.push(editorState, insert, 'insert-fragment');
      this.setState({ editorState: newEditorState });
      console.log('new editor state: ', this.state.editorState);
    };

    this.toggleRecordingState = () => {
      // toggling state is NOT instantaneous!!
      this.recording = !this.recording;
      if (!this.recording) {
        window.transcript = '';
        this.recognition.stop();
        console.log('Stopped the recording!');
      } else {
        this.recognition.start();
        console.log('Started the recording!');
      }
    };
  }

  render() {
    return (
      <div className="SpeechToTextEditor">
        <div>
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
        <button onClick={() => this.toggleRecordingState()}>
        CLICK ME TO TOGGLE RECORDING STATE
        </button>
      </div>

    );
  }
}

SpeechToTextEditor.propTypes = {
  username: React.PropTypes.string
};


export default SpeechToTextEditor;
