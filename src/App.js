import React, { Component } from "react";
import { Route } from "react-router-dom";
import "./App.css";
import ListShelves from "./Shelfs";
import SearchBooks from "./SearchBooks";
import * as BooksAPI from "./utils/BooksAPI";

// top-level class component that renders any
// one of the child component based on path/URL
class App extends Component {
  state = {
    books: []
  };

  componentDidMount() {
    this.fetchBooksList(); // moved API call to a separate function
  }


  filterBookByShelf = (books, shelfName) =>
    books.filter(b => b.shelf === shelfName);

  shelfChangeHandler = (currentBook, event) => {
    currentBook.shelf = event.target.value;
    const rollbackState = this.state.books;
    const updatedState = this.state.books.filter(function(el) {
      return el.id !== currentBook.id;
    });
    updatedState.push(currentBook);
    this.setState({ books: updatedState });

    BooksAPI.update(currentBook, event.target.value)
      .then(bookData => {})
      .catch(err => {
        this.setState({ books: rollbackState });
      });
  };

  fetchBooksList() {
    BooksAPI.getAll().then(books => {
      this.setState({ books });
    });
  }


  render() {
    return (
      <div className="app">
        <Route
          exact
          path="/"
          render={() => (
            <Shelfs
              onShelfChange={this.shelfChangeHandler}
              books={this.state.books}
            />
          )}
        />
        <Route
          path="/search"
          render={({ history }) => (
            <SearchBooks
              onShelfChange={this.shelfChangeHandler}
              mybooksList={this.state.books}
            />
          )}
        />
      </div>
    );
  }
}

export default App;
