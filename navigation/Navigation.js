import React from 'react';
import {StyleSheet, Image} from 'react-native'
import {
    createStackNavigator,
    createSwitchNavigator,
    createAppContainer,
    createBottomTabNavigator
} from 'react-navigation';
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import MovieDetail from "../components/MovieDetail";
import MovieList from "../components/MovieIList";


const AuthStack = createStackNavigator({
        SignIn: {
            screen: LoginScreen,
            navigationOptions: {
                title: 'Authentification'
            }
        }
    },
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    }
);

const ViewMovieNavigator = createStackNavigator({
    Watched: {
        screen: MovieList,
        navigationOptions: {
            title: 'Watched'
        }
    },
    MovieDetail: {
        screen: MovieDetail
    }
})

const UnViewMovieNavigator = createStackNavigator({
    UnWatched: {
        screen: MovieList,
        navigationOptions: {
            title: 'UnWatched'
        }
    },
    MovieDetail: {
        screen: MovieDetail
    }
})

const MoviesTabNavigator = createBottomTabNavigator(
    {
        Viewed: {
            screen: ViewMovieNavigator,
            navigationOptions: {
                tabBarIcon: () => {
                    return <Image
                        source={require('../assets/eye.png')}
                        style={styles.icon}/>
                }
            }
        },
        UnViewed: {
            screen: UnViewMovieNavigator,
            navigationOptions: {
                tabBarIcon: () => {
                    return <Image
                        source={require('../assets/eye_close.png')}
                        style={styles.icon}/>
                }
            }
        }
    },
    {
        tabBarOptions: {
            activeBackgroundColor: '#DDDDDD',
            inactiveBackgroundColor: '#FFFFFF',
            showLabel: false,
            showIcon: true
        }
    }
)

const HomeStack = createStackNavigator({
        Home: {
            screen: MoviesTabNavigator,
            navigationOptions: {
                title: 'HomeScreen'
            }
        }
    },
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    }
);

export default createAppContainer(createSwitchNavigator(
    {
        Home: HomeStack,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'Auth',
    }
));

const styles = StyleSheet.create({
    icon: {
        width: 40,
        height: 40
    }
})
