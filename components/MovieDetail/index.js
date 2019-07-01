import React from 'react'
import {StyleSheet, View, ActivityIndicator, Image, ScrollView, Text, BackHandler, TouchableOpacity} from 'react-native'
import {connect} from 'react-redux'
import {getImageFromApi, getInfos} from "../../services/SynologyApi";

//export default
class MovieDetail extends React.Component {

    constructor(props) {
        super(props)

        this.movieId = null;

        this.state = {
            details: undefined,
            isLoading: true
        }
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton);
    }

    _handleBackButton() {
        console.log('MovieDetail _handleBackButton');
    }

    componentDidMount() {
        this._getMovieDetails();
    }

    _getMovieDetails() {
        this.movieId = this.props.navigation.getParam('movieId', {})

        getInfos(this.movieId, (details) => {
            this.setState({
                details: details,
                isLoading: false
            });
        })
    }

    _displayLoading() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large'/>
                </View>
            )
        }
    }

    _dateValdiator(value) {
        if (0 == value) {
            return '????'
        } else {
            if (4 < value.length) {
                return (new Date(value)).getFullYear()
            }

            return value
        }
    }

    _durationFormator(value) {
        if (value && 0 < value.length) {
            return value[value.length - 1].duration
        }
    }

    _toggleWatchedUnwachted() {
        const action = {type: "TOGGLE_WATCHED_UNWATCHED", value: this.state.details}
        console.log('_toggleWatchedUnwachted');
        this.props.dispatch(action)
    }

    _displayIcon(details) {
        let sourceImage = require('../../assets/eye_close.png')

        if (0 < details.last_watched) {
            sourceImage = require('../../assets/eye.png')
        }

        return (
            <TouchableOpacity
                style={styles.container}
                activeOpacity={.7}
                onPress={() => this._toggleWatchedUnwachted()}
            >
                <Image
                    style={styles.eye}
                    source={sourceImage}
                />
            </TouchableOpacity>
        )
    }

    _displayMovieDetail() {
        const {details} = this.state

        if (undefined != details && details.hasOwnProperty('additional')) {
            console.log('_displayMovieDetail', details);

            let summury = '';
            let genres = [];

            if (details.hasOwnProperty('additional')) {
                summury = details.additional.hasOwnProperty('summary') ? details.additional.summary : '';
                genres = details.additional.hasOwnProperty('genre') ? details.additional.genre : [];
            }

            return (
                <ScrollView style={styles.scrollview_container}>
                    <View style={styles.infos}>
                        <Image
                            style={styles.image}
                            source={{uri: getImageFromApi(details)}}
                        />

                        <View style={styles.container_infos}>
                            {this._displayIcon(details)}

                            <View style={styles.infos}>
                                <View style={styles.duration_container}>
                                    <Image
                                        style={styles.clock}
                                        source={require('../../assets/clock.png')}
                                    />

                                    <Text
                                        style={styles.duration_text}>{this._durationFormator(details.additional.file)}</Text>
                                </View>

                                <View style={styles.date_container}>
                                    <Text
                                        style={styles.date_text}>{this._dateValdiator(details.original_available)}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.date_text}>
                        <Text style={styles.title_text}>{details.title}</Text>
                    </View>

                    <Text style={styles.default_text}>{genres.map(function (genre) {
                        return genre;
                    }).join(" | ")}
                    </Text>

                    <Text style={styles.description_text}>{summury}</Text>
                </ScrollView>
            )
        }
    }

    render() {
        return (
            <View style={styles.container}>
                {this._displayLoading()}
                {this._displayMovieDetail()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    scrollview_container: {
        flex: 1,
        backgroundColor: '#22a6b3',
        padding: 10
    },
    container: {
        flex: 1
    },
    image: {
        width: 80,
        height: 110,
        margin: 5
    },
    infos: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    container_infos: {
        flex: 1,
        alignItems: 'center'
    },
    clock: {
        width: 25,
        height: 25,
        alignItems: 'center'
    },
    eye: {
        width: 40,
        height: 40
    },
    duration_container: {
        flex: 1,
        flexDirection: 'row'
    },
    duration_text: {
        fontSize: 15,
        color: '#fff',
        fontWeight: '500',
        textAlign: 'left',
        paddingLeft: 10
    },
    date_container: {
        flex: 1
    },
    date_text: {
        fontSize: 15,
        color: '#fff',
        fontWeight: '500',
        textAlign: 'right'
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title_text: {
        fontWeight: 'bold',
        fontSize: 25,
        flex: 1,
        flexWrap: 'wrap',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        marginBottom: 10,
        color: '#fff',
        //textAlign: 'center'
    },
    default_text: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        color: '#fff'
    },
    description_text: {
        fontStyle: 'italic',
        color: '#666666',
        margin: 5,
        marginBottom: 15,
        fontSize: 14
    },
});


//export default FilmDetail

const mapStateToProps = (state) => {
    return {}
}

export default connect(mapStateToProps)(MovieDetail)
