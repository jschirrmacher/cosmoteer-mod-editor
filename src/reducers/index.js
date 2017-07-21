import { combineReducers } from 'redux'
import {listModsIsLoading, listModsHasError, listMods} from './listMods'

const moditor = combineReducers({
    listModsIsLoading,
    listModsHasError,
    listMods
})

export default moditor
