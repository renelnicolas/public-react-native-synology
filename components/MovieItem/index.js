import React from 'react'
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native'
import {getImageFromApi} from "../../services/SynologyApi";

/**
 * TODO : find way to skip : You have a large list that is slow to update - make sure your renderItem function renders components that follow React performance best practices like PureComponent, shouldComponentUpdate
 */
export default class MovieItem extends React.Component {

    constructor(props) {
        super(props)
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

    render() {
        const {movie, displayMovieDetail} = this.props

        return (
            <TouchableOpacity
                style={styles.container}
                activeOpacity={.7}
                onPress={() => displayMovieDetail(movie)}
            >
                <View style={styles.subcontainer}>
                    <Image
                        style={styles.image}
                        source={{uri: getImageFromApi(movie)}}
                    />

                    <View style={styles.content}>
                        <View style={styles.header}>
                            <Text style={styles.title_text}>{movie.title}</Text>
                        </View>

                        <View style={styles.more}>
                            <View style={styles.duration_text}>
                                <Text
                                    style={[styles.textDate, {textAlign: 'left'}]}>{this._dateValdiator(movie.original_available)}</Text>
                            </View>

                            <View style={styles.date_text}>
                                <Text
                                    style={[styles.textDate, {textAlign: 'right'}]}>{this._durationFormator(movie.additional.file)}</Text>
                            </View>
                        </View>
                    </View>

                    <Image
                        style={styles.next}
                        source={require('../../assets/arrow_right.png')}
                    />
                </View>

                <View style={styles.separator}/>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 100,
        backgroundColor: '#22a6b3'
    },
    subcontainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        width: 60,
        height: 90,
        margin: 5
    },
    next: {
        width: 50,
        height: 50,
        alignItems: 'center'
    },
    content: {
        flex: 1,
        margin: 5
    },
    header: {
        flex: 3
    },
    separator: {
        borderBottomColor: '#7ed6df',
        borderBottomWidth: 1,
    },
    title_text: {
        fontSize: 16,
        flexWrap: 'wrap',
        paddingRight: 5,
        color: '#fff',
        fontWeight: '700'
    },
    more: {
        flex: 1,
        flexDirection: 'row'
    },
    date_text: {
        flex: 1,
    },
    duration_text: {
        flex: 1,
    },
    textDate: {
        fontSize: 15,
        color: '#fff',
        fontWeight: '500'
    },
});
