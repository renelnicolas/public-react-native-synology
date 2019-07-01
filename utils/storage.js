import {AsyncStorage} from 'react-native';

/**
 * /!\ DISCLAMER /!\ - Never storage sensitive data into AsyncStorage - /!\ DISCLAMER /!\
 */

/**
 * Put data into storage
 *
 * @param key
 * @param values
 * @param callback function
 * @returns {Promise<boolean>}
 */
export async function setData(key, values, callback) {
    try {
        await AsyncStorage.setItem(key, values, callback)

        return true
    } catch (error) {
    }

    return false
}

/**
 * Get data from storage
 *
 * @param key string
 * @param callback function
 * @returns {Promise<boolean|*>}
 */
export async function getData(key, callback) {
    try {
        const value = await AsyncStorage.getItem(key, callback)

        if (value !== null) {
            return JSON.parse(value)
        }
    } catch (error) {
    }

    return false
}

/**
 * remove data from storage
 *
 * @param key string
 * @param callback function
 * @returns {Promise<boolean|*>}
 */
export async function removeItem(key, callback) {
    try {
        const value = await AsyncStorage.removeItem(key, callback)

        if (value !== null) {
            return JSON.parse(value)
        }
    } catch (error) {
    }

    return false
}
