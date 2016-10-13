import React from 'react';
import { connect } from 'react-redux';
import { debounce } from 'throttle-debounce';

import * as a from './../actions.js';

const mapStateToProps = state => ({
  username: state.username
});

const mapDispatchToProps = dispatch => ({
  searchBounce: (user, value) => {
    if (value === '') {
      dispatch(a.fetchSessions(user));
    } else {
      dispatch(a.searchNotes(user, value));
    }
  }
});

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.username,
      searchBounce: debounce(750, props.searchBounce),
      searchActive: null
    };
    this.onInputChange = (e) => {
      this.state.searchBounce(this.props.username, e.target.value);
      this.setState({ searchActive: e.target.value });
    };
  }

  render() {
    return (
      <div className="search-container">
        <input
          type="text"
          className={
            // change class according to
            // if input has value and the value is not an empty string
            this.state.searchActive && this.state.searchActive.length > 0 ?
              'active-search' : 'search-input'
            }
          onChange={this.onInputChange}
        />
      </div>
    );
  }
}

SearchBar.propTypes = {
  username: React.PropTypes.string,
  searchBounce: React.PropTypes.Func
};

const SearchBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchBar);

export default SearchBarContainer;
