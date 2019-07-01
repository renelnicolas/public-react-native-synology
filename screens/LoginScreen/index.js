import React from 'react'
import {StyleSheet, View, Image, KeyboardAvoidingView} from 'react-native'
import LoginForm from '../../components/LoginForm';

export default class LoginScreen extends React.Component {

    constructor(props) {
        super(props)
    }

    _userValidate = (connectionStatus) => {
        if (connectionStatus) {
            this.props.navigation.navigate('Home');
        }
    }

    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image
                        style={styles.logo}
                        source={require('../../assets/nas.png')}
                    />
                </View>

                <View style={styles.formContainer}>
                    <LoginForm userValidate={this._userValidate}/>
                </View>
            </KeyboardAvoidingView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#82ccdd'
    },
    logoContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: 100,
        height: 100
    }
})
