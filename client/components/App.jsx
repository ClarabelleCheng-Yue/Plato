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
    this.searchNotes = term => console.log('Search term: ', term);
    this.fetchNotes = (username) => {
      const urlUser = `api/${username}`;
      return request('GET', urlUser)
        .then((res) => {
          this.setState({ articles: JSON.parse(res.text) })
        }, (err) => {
          console.log('Error fetching user notes: ', err);
        });
    };
  }

  render() {
    return (
      <div className="plato-app">
        <LogIn fetchNotes={this.fetchNotes} />
        <h1>{this.state.username ?
          `Howdy ${this.state.username}!`
          : 'Howdy!'
          }
        </h1>
        <SearchBar onTermChange={this.searchNotes} />
        <h1>Your current Note:</h1>
        <MyEditor username={this.state.username} />
        <NoteList notes={this.state.articles} />
      </div>
    );
  }
}

export default App;
