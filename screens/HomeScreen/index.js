import React from 'react'
import {BackHandler, StyleSheet, View, Text} from 'react-native'

export default class HomeScreen extends React.Component {

    constructor(props) {
        super(props)
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton);
    }

    _handleBackButton() {
        console.log('HomeScreen _handleBackButton');
    }

    render() {
        return (
            <View style={styles.formContainer}>
                <Text>HomeScreen</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#82ccdd'
    }
})
