import React from 'react';
import {
  Editor,
  RichUtils,
  convertToRaw,
  getDefaultKeyBinding,
  KeyBindingUtil
 } from 'draft-js';
import { Button } from 'react-materialize';
import request from 'superagent';
import EditorToolbar from './EditorToolbar.jsx';


const { hasCommandModifier } = KeyBindingUtil;
class MyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: props.currentNote,
      title: props.currentNoteTitle
    };

    // updates the editorstate when there is a change in the editorstate
    this.onChange = (editorState) => {
      this.setState({ editorState });
    };

    // updates the title when there is a change in the title state
    this.titleChange = (event) => {
      this.setState({ title: event.target.value });
    };

    // sends ajax post request to the server to save the current note
    this.submitNote = () => {
      // this will let us save the current content as rich text
      const userNote = convertToRaw(this.state.editorState.getCurrentContent());
      const userTitle = this.state.title;
      const username = this.props.username;
      const url = 'api/save-note';
      
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
          console.log(res, 'new note submitted!!');
        });
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

  componentWillReceiveProps(newProps) {
    this.setState({
      editorState: newProps.currentNote,
      title: newProps.currentNoteTitle
    });
  }

  render() {
    return (
      <div>
        <div>
          <input
            type="text"
            value={this.state.title}
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
            placeholder="Type your note here... "
          />
        </div>
        <div>
          <Button
            onClick={() => this.submitNote()}
            waves="light"
          > Submit </Button>
        </div>
      </div>

    );
  }
}

MyEditor.propTypes = {
  username: React.PropTypes.string,
  currentNoteTitle: React.PropTypes.string,
  currentNote: () => null,
  fetchNotes: React.PropTypes.func
};

export default MyEditor;
