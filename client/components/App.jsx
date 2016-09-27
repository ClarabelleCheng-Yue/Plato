import React from 'react';
import request from 'superagent';

import LogIn from './LogIn.jsx';
import NoteList from './NoteList.jsx';
import SearchBar from './SearchBar.jsx';
import MyEditor from './MyEditor.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      articles: []
    };

    this.statics = {
      handleTermChange: term => console.log('Search term: ', term),
      fetchNotes: (username) => {
        this.setState({ username });
        const urlUser = `api/${username}`;
        request.get(urlUser, (err, res) => {
          this.setState({ articles: JSON.parse(res.text) });
        });
      }
    };
  }

  render() {
    return (
      <div>
        <LogIn fetchNotes={this.statics.fetchNotes} />
        <h1>{this.state.username ?
          `Howdy ${this.state.username}!`
          : 'Howdy!'
          }
        </h1>
        <SearchBar onTermChange={this.statics.handleTermChange} />
        <h1>Your current Note:</h1>
        <MyEditor notes={this.state.articles} />
        <NoteList notes={this.state.articles} />
      </div>
    );
  }
}

export default App;