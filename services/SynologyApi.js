import axios from 'axios'
import {SYNOFC} from '../utils/encryption'
import {setData, getData} from "../utils/storage";

let NAS_ENDPOINT_URL = '';
let ENDPOINT = '';
let PROTOCOL = 'http';
let PORT = 5000;
let IS_HTTPS = false;
let TOKEN = '';

/**
 * Check
 * /!\ Never storage sensitive data into AsyncStorage
 */
export async function checkRegisterCredential(callback) {
    let credentials = await getData('credentials')

    if (typeof callback === "function") {
        callback(credentials);
    }
}

/**
 * Authentification with NAS
 *
 * @param endpoint object {endpoint: string, username: string, password: string, isHttps: bool}
 * @param callback function
 */
export function login(oAuth, callback) {
    let clientTime = Math.floor((new Date()).getTime() / 1000);

    ENDPOINT = oAuth.endpoint;
    PROTOCOL = oAuth.isHttps ? 'https://' : 'http://';
    PORT = oAuth.isHttps ? 5001 : PORT;
    IS_HTTPS = oAuth.isHttps;

    NAS_ENDPOINT_URL = PROTOCOL + ENDPOINT + `:${PORT}`

    console.log(`NAS_ENDPOINT_URL : ${NAS_ENDPOINT_URL}`);

    let path = '/webapi/encryption.cgi'

    let synoParams = {
        _sid: '',
        api: 'SYNO.API.Encryption',
        version: 1,
        method: 'getinfo',
        format: 'module',
    }

    let authFields = {
        account: oAuth.username,
        passwd: oAuth.password,
        format: 'sid',
        session: "DownloadStation",
        client_time: clientTime,
        timezone: getGMTOffset(new Date())
    };

    console.log(`>>> ${path}`);

    axios.post(NAS_ENDPOINT_URL + path, concatParams(synoParams, true))
        .then(function (response) {
            let SYNOo = SYNOFC();

            let clientTime = Math.floor((new Date()).getTime() / 1000);

            var cipherKey = response.data.data.cipherkey;
            var rsaModulus = response.data.data.public_key;
            var cipherToken = response.data.data.ciphertoken;
            var timeBias = response.data.data.server_time - Math.floor(+new Date() / 1000);
            var encryptedParams = SYNOo.Encryption.EncryptParam(authFields, cipherKey, rsaModulus, cipherToken, timeBias);
            encryptedParams.client_time = clientTime;
            authFields = encryptedParams;

            let path = '/webapi/auth.cgi'

            let postParams = {
                _sid: '',
                api: 'SYNO.API.Auth',
                version: 4,
                method: 'login',
                __cIpHeRtExT: encodeURIComponent(authFields[cipherKey]),
                client_time: authFields['client_time']
            }

            console.log(`>>> ${path}`);

            axios.post(NAS_ENDPOINT_URL + path, concatParams(postParams, false))
                .then(function (response) {
                    let result = false;

                    if (response.data.success) {
                        TOKEN = response.data.data.sid;

                        result = true;

                        console.log('_sid => ', TOKEN);

                        setData('credentials', JSON.stringify(oAuth))
                    } else {
                        console.warn(`>>> ${path}`, response.data);
                    }

                    if (typeof callback === "function") {
                        callback(result);
                    }
                })
                .catch(function (error) {
                    console.warn(`>>> ${path}`, error);

                    if (typeof callback === "function") {
                        callback(false);
                    }
                });
        })
        .catch(function (error) {
            console.warn(`>>> ${path}`, error);

            if (typeof callback === "function") {
                callback(false);
            }
        });
}

/**
 * Get movie list
 *
 * @param callback function
 */
export function getList(offset, limit, watched, isFistCall, callback) {
    let path = "/webapi/VideoStation/movie.cgi"

    console.log(`${path} : offset = ${offset}, limit = ${limit}, isFistCall = ${isFistCall}`);

    let synoParams = {
        api: "SYNO.VideoStation.Movie",
        version: 2,
        method: "list",
        _sid: TOKEN
    }

    let movieFields = {
        sort_by: 'added',
        sort_direction: 'desc',
        library_id: 0,
        actor: [],
        director: [],//"Christoffer Boe"
        writer: [],
        genre: [],
        year: [],
        date: [],
        channel_name: [],
        title: [],
        resolution: [],
        // "watching", "unwatched", "watched"
        watchedstatus: [undefined != watched ? watched : ''],
        filecount: [],
        container: [],
        duration: [],
        certificate: [],
        // {"from": 15, "to": 34}
        rating: [],
        offset: offset,
        limit: limit,
        additional: ["watched_ratio", "poster_mtime", "poster", "file", "rating"] // "watched_ratio", "backdrop_mtime", "poster_mtime", "poster", "summary"
    }

    axios.post(NAS_ENDPOINT_URL + path, concatParams({...synoParams, ...movieFields}, true, true), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function (response) {
            let res = false;

            if (response.data.success) {
                res = {
                    movies: response.data.data.movies,
                    offset: response.data.data.offset,
                    total: response.data.data.total
                };

            } else {
                console.warn('SYNO.VideoStation.Movie', response);
            }

            if (typeof callback === "function") {
                callback(res);
            }
        })
        .catch(function (error) {
            console.warn(`>>> ${path}`, error);

            if (typeof callback === "function") {
                callback(false);
            }
        });
}


/**
 * Get movie poster
 *
 * @param movie
 * @returns {string}
 */
export function getImageFromApi(movie) {
    let path = "/webapi/VideoStation/poster.cgi?"

    let synoParams = {
        api: "SYNO.VideoStation.Poster",
        version: 2,
        method: "getimage",
        _sid: TOKEN
    }

    let movieFields = {
        id: movie.id,
        type: 'movie',
        poster_mtime: (movie.hasOwnProperty('additional') && movie.additional.hasOwnProperty('poster_mtime')) ? movie.additional.poster_mtime : null
    }

    return NAS_ENDPOINT_URL + path + concatParams({...synoParams, ...movieFields}, true)
}


/**
 * Get movie infos
 *
 * @param movieId int
 * @param callback function
 */
export function getInfos(movieId, callback) {
    let path = "/webapi/entry.cgi"

    let synoParams = {
        api: "SYNO.VideoStation2.Movie",
        version: 1,
        method: "getinfo",
        _sid: TOKEN
    }

    let movieFields = {
        id: "[" + movieId + "]",
        additional: ["extra", "summary", "file", "actor", "writer", "director", "genre", "collection", "watched_ratio", "conversion_produced", "backdrop_mtime", "poster_mtime"]
    }

    console.log(`>>> ${path}`);

    axios.post(NAS_ENDPOINT_URL + path, concatParams({...synoParams, ...movieFields}, true, true))
        .then(function (response) {
            let res = false;

            if (response.data.success) {
                if (0 < response.data.data.movie.length) {
                    res = response.data.data.movie[0];
                }
            } else {
                console.warn(`>>> ${path}`, response);
            }

            if (typeof callback === "function") {
                callback(res);
            }
        })
        .catch(function (error) {
            console.warn(`>>> ${path}`, error);

            if (typeof callback === "function") {
                callback(false);
            }
        });
}

/**
 * Set Watched/UnWatched movie
 *
 * @param movie object
 * @param watched bool
 * @param callback function
 */
function setWatched(movie, watched, callback) {
    let path = '/webapi/VideoStation/movie.cgi'

    let synoParams = {
        api: "SYNO.VideoStation.Movie",
        version: 2,
        method: "set_watched",
        _sid: sidToken
    }

    let movieQuery = {
        id: movie.id,
        watched: watched
    }

    console.log(`>>> ${path}`);

    axios.post(NAS_ENDPOINT + path, concatParams({...synoParams, ...movieQuery}, true), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function (response) {
            let res = false;

            if (response.data.success) {
                res = response.data.data;
            } else {
                console.warn(`>>> ${path}`, response);
            }

            if (typeof callback === "function") {
                callback(res);
            }
        })
        .catch(function (error) {
            console.warn(`>>> ${path}`, error);

            if (typeof callback === "function") {
                callback(false);
            }
        });
}

/**
 * Convert date with timezone
 *
 * @param date
 * @returns {string}
 */
function getGMTOffset(date) {
    return (date.getTimezoneOffset() > 0 ? "-" : "+") +
        leftPad(Math.floor(Math.abs(date.getTimezoneOffset()) / 60), 2, "0") +
        ":" +
        leftPad(Math.abs(date.getTimezoneOffset() % 60), 2, "0");
}

/**
 *
 *
 * @param d
 * @param b
 * @param c
 * @returns {string}
 */
function leftPad(d, b, c) {
    let a = String(d);

    if (!c) {
        c = " "
    }

    while (a.length < b) {
        a = c + a;
    }

    return a;
}

/**
 * Convert object to string, encoded if necessary
 *
 * @param source object
 * @param encoded bool
 * @param keepQuote loop
 * @returns {string}
 */
function concatParams(source, encoded, keepQuote) {
    let array = []

    for (let key in source) {
        let value = source[key]

        if (Array.isArray(value) && keepQuote) {
            value = convertArrayToStringQuoted(value)
        }

        if (encoded) {
            array.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
        } else {
            array.push(key + "=" + value);
        }
    }

    return array.join("&").replace(/\+/g, '%20');
}

/**
 * Convert array to string quoted
 *
 * @param arrayToConvert array
 * @returns {string}
 */
function convertArrayToStringQuoted(arrayToConvert) {
    if (0 < arrayToConvert.length) {
        if ('object' === typeof arrayToConvert[0]) {
            return '[' + JSON.stringify(arrayToConvert[0]) + ']';
        }

        return '["' + arrayToConvert.join('","') + '"]'
    }

    return '[]'
}
