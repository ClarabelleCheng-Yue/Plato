import React from 'react';
import {
  Editor,
  EditorState,
  Modifier,
  RichUtils,
  convertToRaw } from 'draft-js';
import { Button, Row, Col } from 'react-materialize';
import request from 'superagent';
import EditorToolbar from './EditorToolbar.jsx';

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
    // we are going to use these variables to determine whether or not we should
    // put the next phrase on a new line/sentence
    this.lastEventTime = undefined;
    this.currentTime = new Date();

    // function that we will fire every time an event happens, basically
    // everytime a phrase is transcribed
    this.recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        if (event.results[i].isFinal) {
          window.transcript += event.results[i][0].transcript;
        }
      }
      // the very first time we insert a phrase, we shouldn't be inserting
      // a period
      if (this.lastEventTime === undefined) {
        this.lastEventTime = new Date();
      }

      this.currentTime = new Date();
      if (this.currentTime - this.lastEventTime > 3500) {
        this.addText('. ');
      }
      // reset our lastEventTime to match our currentTime
      this.lastEventTime = new Date();
      this.addText(window.transcript);
      // reset transcript to nothing so that we aren't duplicating results
      window.transcript = '';
    };

    this.state = {
      // this will let us create an empty editor
      editorState: EditorState.createEmpty(),
      title: '',
    };

    // this method should mirror the MyEditor component
    this.onChange = (editorState) => {
      console.log(editorState, 'speech to text state');
      this.setState({ editorState });
      console.log(editorState, 'speech to text changed');
    };

    // this method should mirror the MyEditor component
    this.titleChange = (event) => {
      this.setState({ title: event.target.value });
    };

    // this method should mirror the MyEditor component
    this.submitNote = () => {
      // this will let us save the current content as rich text
      const userNote = convertToRaw(this.state.editorState.getCurrentContent());
      const userTitle = this.state.title;
      const username = this.props.username;
      const url = 'api/save-note';

      // submit the note to the server for storage in db
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
          } else {
            this.props.fetchNotes(this.props.username);
          }
          console.log(res, 'res');
        });
    };

    // add string to the editable portion of the editor
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

    // this will take a key binding command and put it through and see if the state changes
    // after applying the command
    this.handleKeyCommand = (command) => {
      const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
      if (newState) {
        this.onChange(newState);
        return 'handled';
      }
      return 'not-handled';
    };

    // this will take the current selection in the editor and apply/remove bold to it
    this.toggleBold = () => {
      this.setState({
        editorState: RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD')
      });
    };

    // this will take the current selection in the editor and apply/remove italics to it
    this.toggleItalic = () => {
      this.setState({
        editorState: RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC')
      });
    };

    // this will take the current selection in the editor and apply/remove underline to it
    this.toggleUnderline = () => {
      this.setState({
        editorState: RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE')
      });
    };

    // this will take the current selection in the editor and apply/remove code format to it
    this.toggleCode = () => {
      this.setState({
        editorState: RichUtils.toggleInlineStyle(this.state.editorState, 'CODE')
      });
    };

    // this will take the current selection in the editor and apply/remove strikethrough to it
    this.toggleStrikethrough = () => {
      this.setState({
        editorState: RichUtils.toggleInlineStyle(this.state.editorState, 'STRIKETHROUGH')
      });
    };

    // this lets us define custom styles by listing them here as well as the css that we
    // want applied
    this.styleMap = {
      STRIKETHROUGH: {
        textDecoration: 'line-through',
      },
    };

    // enables spellchecker
    this.spellCheck = true;
  }

  render() {
    return (
      <div>
        <Row>
          <input
            type="text"
            value={this.state.value}
            onChange={this.titleChange}
            placeholder="Title"
          />
          <EditorToolbar
            toggleBold={this.toggleBold}
            toggleItalic={this.toggleItalic}
            toggleUnderline={this.toggleUnderline}
            toggleCode={this.toggleCode}
            toggleStrikethrough={this.toggleStrikethrough}
          />
          <Editor
            customStyleMap={this.styleMap}
            editorState={this.state.editorState}
            onChange={e => this.onChange(e)}
            handleKeyCommand={this.handleKeyCommand}
            spellCheck={this.spellCheck}
            placeholder="This is your audio transcription... "
          />
        </Row>
        <Row>
          <Col s={12} className="center-align">
            <Button
              onClick={() => this.toggleRecordingState()}
              floating className="red" icon="voicemail"
            />
          </Col>
        </Row>
        <Row>
          <Col s={12} className="right-align">
            <Button onClick={this.submitNote} waves="light">Submit</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

SpeechToTextEditor.propTypes = {
  username: React.PropTypes.string,
  fetchNotes: React.PropTypes.func
};


export default SpeechToTextEditor;
