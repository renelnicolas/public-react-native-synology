import React from 'react';
import {AppState} from 'react-native';
import {Provider} from 'react-redux'
import Store from './Store/configureStore'
import Navigation from './navigation/Navigation'

export default class App extends React.Component {
    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        console.log('App has come to the foreground!');
    };

    render() {
        return (
            <Provider store={Store}>
                <Navigation/>
            </Provider>
        )
    }
}
