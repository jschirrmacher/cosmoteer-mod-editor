import { combineReducers } from 'redux'
import {listModsIsLoading, listModsHasError, listMods, selectMod} from './listMods'

const moditor = combineReducers({
    listModsIsLoading,
    listModsHasError,
    listMods,
    selectMod
})

export default moditor
