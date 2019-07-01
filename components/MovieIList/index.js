import React from 'react'
import {StyleSheet, View, FlatList, ActivityIndicator, BackHandler} from 'react-native'
import {getList} from "../../services/SynologyApi";
import MovieItem from "../MovieItem";

export default class MovieList extends React.Component {

    constructor(props) {
        super(props)

        this.watchedstatus = this.props.navigation.state.routeName.toLowerCase()
        this.limit = 50
        this.offset = 0
        this.total = 0

        this.state = {
            movies: [],
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
        console.log('MovieList _handleBackButton');
    }

    componentDidMount() {
        this._loadMovies(this.offset, this.limit, true);
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

    _loadMovies(offset, limit, isFistCall) {
        getList(offset, limit, this.watchedstatus, isFistCall, (result) => {
            if (isFistCall) {
                this.total = result.total
            }

            this.offset = result.offset

            this.setState({
                movies: result.movies,
                isLoading: false
            });
        })
    }

    _displayMovieDetail = (movie) => {
        this.props.navigation.navigate('MovieDetail', {movieId: movie.id})
    }

    _displayMovies() {
        return (
            <FlatList
                style={styles.list}
                data={this.state.movies}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => (
                    <MovieItem
                        movie={item}
                        displayMovieDetail={this._displayMovieDetail}
                    />
                )}
                onEndReachedThreshold={0.5}
                onEndReached={() => {
                    if (this.offset < this.total) {
                        this._loadMovies(this.offset + this.limit, this.limit, false);
                    }
                }}
            />
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {this._displayLoading()}
                {this._displayMovies()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 0
    }
});
