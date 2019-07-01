import React from 'react'
import {StyleSheet, View, Text, TouchableOpacity, CheckBox, TextInput, StatusBar, ActivityIndicator} from 'react-native'
import {login, checkRegisterCredential} from '../../services/SynologyApi'

export default class LoginForm extends React.Component {

    constructor(props) {
        super(props)

        this.formFields = {
            endpoint: "",
            username: "",
            password: "",
        }

        this.state = {
            checked: true,
            disabled: false,
            error: "",
            isLoading: false
        }
    }

    componentWillMount() {
        checkRegisterCredential((credentials) => {
            if (false !== credentials) {
                this.formFields = {
                    endpoint: credentials.endpoint,
                    username: credentials.username,
                    password: credentials.password,
                }

                this.setState({
                    checked: credentials.isHttps
                })

                this._connection()
            }
        });
    }

    _handleEndpointChange = (endpoint) => {
        this.formFields.endpoint = endpoint;

        this.setState({
            disabled: this._textinputValidator()
        })
    }

    _handleUsernameChange = (username) => {
        this.formFields.username = username;

        this.setState({
            disabled: this._textinputValidator()
        })
    }

    _handlePasswordChange = (password) => {
        this.formFields.password = password;

        this.setState({
            disabled: this._textinputValidator()
        })
    }

    _textinputValidator = () => {
        if (this.formFields.endpoint.length > 0 && this.formFields.username.length > 0 && this.formFields.password.length > 0) {
            return false
        }

        return true
    }

    _handleCheckboxChange() {
        this.setState({
            checked: !this.state.checked
        })
    }

    _connection = () => {
        this.setState({
            isLoading: true
        })

        let oAuth = {
            endpoint: this.formFields.endpoint.trim(),
            username: this.formFields.username.trim(),
            password: this.formFields.password.trim(),
            isHttps: this.state.checked
        }

        login(oAuth, (result) => {
            this.setState({
                isLoading: false
            })

            this.props.userValidate(result)
        })
    }

    _displayLoginButton() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large'/>
                </View>
            )
        } else {
            return (
                <TouchableOpacity
                    style={[this.state.disabled ? styles.buttonContainerDisable : styles.buttonContainer]}
                    disabled={this.state.disabled}
                    onPress={this._connection}
                >
                    <Text style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity>
            )
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                />

                <TextInput
                    placeholder="Endpoint"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    returnKeyTYpe="Next"
                    onSubmitEditing={() => this.usernameInput.focus()}
                    autoCapitalize="none"
                    autocorrect={false}
                    onChangeText={(text) => this._handleEndpointChange(text)}
                    style={styles.input}
                />

                <TextInput
                    placeholder="Username"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    returnKeyTYpe="Next"
                    onSubmitEditing={() => this.passwordInput.focus()}
                    autoCapitalize="none"
                    autocorrect={false}
                    onChangeText={(text) => this._handleUsernameChange(text)}
                    style={styles.input}
                    ref={(input) => this.usernameInput = input}
                />

                <TextInput
                    placeholder="Password"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    secureTextEntry
                    returnKeyTYpe="Login"
                    onChangeText={(text) => this._handlePasswordChange(text)}
                    onSubmitEditing={() => this._connection}
                    style={styles.input}
                    ref={(input) => this.passwordInput = input}
                />

                <View style={styles.checkbox}>
                    <CheckBox
                        /*checkedIcon={<Image source={require('../checked.png')} />}
                        uncheckedIcon={<Image source={require('../unchecked.png')} />}*/
                        title='Https?'
                        value={this.state.checked}
                        checked={this.state.checked}
                        onChange={() => this._handleCheckboxChange}
                        style={styles.checkbox}
                    />

                    <Text>Https?</Text>
                </View>

                {this._displayLoginButton()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    input: {
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginBottom: 10,
        color: '#fff',
        paddingHorizontal: 10,
        borderRadius: 2
    },
    checkbox: {
        color: '#fff',
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonContainer: {
        backgroundColor: '#60a3bc',
        paddingVertical: 15,
        opacity: 1
    },
    buttonContainerDisable: {
        backgroundColor: '#60a3bc',
        paddingVertical: 15,
        opacity: 0.2
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: '700'
    },
    loading_container: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});
