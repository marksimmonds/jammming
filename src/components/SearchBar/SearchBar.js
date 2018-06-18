import React, { Component } from 'react';
import './SearchBar.css';

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {term: ''};

    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handlePressEnter = this.handlePressEnter.bind(this);
  }

  search() {
    this.props.onSearch(this.state.term);
  }

  handleTermChange(e) {
    this.setState({term: e.target.value});
  }

  handlePressEnter(e) {
    if(e.key === 'Enter') {
      this.search();
    }
  }

  render() {
    return (
      <form className="SearchBar" onSubmit={this.search}>
        <input  placeholder="Enter A Song, Album, or Artist"
                onChange={this.handleTermChange}/>
        <input id="searchButton" type="submit" value="SEARCH"/>
      </form>
    );
  }
}

export default SearchBar;
