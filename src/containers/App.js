import React, { Component } from 'react';
import { connect } from 'react-redux';
import CardList from '../components/CardList';
import SearchBox from '../components/SearchBox';
import Scroll from '../components/Scroll';
import ErrorBoundary from '../components/ErrorBoundary';
import './App.css';

import { setSearchField } from '../actions';

/// "What state do I need to listen to and send it off as props?"
/// Listens for state and sends it as props
const mapStateToProps = state => {
    return {
        searchField: state.searchField,
    }
}

/// "What props do I need to listen to, that are actions, that I need to dispatch?"
/// "Catches" actions/handlers and sends them to Reduxs' actions
/// returns an object that contains actions
const mapDispatchToProps = dispatch => {
    return {
        onSearchChange: (event) => dispatch(setSearchField(event.target.value)),
    }
}

class App extends Component {
    constructor() {
        super();
        this.state = {
            robots: [],
        }
    }

    componentDidMount() {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(res => res.json())
            .then(users => this.setState({ robots: users }));
    }

    render() {
        const { robots } = this.state;
        const { searchField, onSearchChange } = this.props;

        const filteredRobots = robots.filter(robot => {
            return robot.name.toLowerCase().includes(searchField.toLowerCase());
        });

        if (!robots.length) {
            return <h1 className='tc'>Loading</h1>
        } else {
            return (
                <div className='tc'>
                    <h1 className='f1'>RoboFriends</h1>
                    <SearchBox searchChange={onSearchChange} />
                    <Scroll>
                    <ErrorBoundary> {/** ONLY SHOWS IF THE APP IS IN PRODUCTION */}
                            <CardList robots={filteredRobots} />
                        </ErrorBoundary>
                    </Scroll>
                </div>
            );
        }
    }
}

/// mapStateToProps: what state am I interested in?
/// mapDispatchToProps: what actions am I interested in?
/// then give both as props to <App />
export default connect(mapStateToProps, mapDispatchToProps)(App); // connect is a higher order function. So it returns another function