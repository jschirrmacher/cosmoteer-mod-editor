export const listModsLoading = bool => ({
    type: 'LIST_MODS_LOADING',
    isLoading: bool
})

export const listModsHasError = error => ({
    type: 'LIST_MODS_ERROR',
    error
})

export const listModsSucceeded = mods => ({
    type: 'LIST_MODS_SUCCEEDED',
    mods
})

export const selectMod = id => ({
    type: 'SELECT_MOD',
    id
})

export const listMods = () => {
    return dispatch => {
        dispatch(listModsLoading(true))

        fetch('/mods')
            .then(res => {
                if (!res.ok) {
                    throw Error(res.statusText)
                }
                dispatch(listModsLoading(false))
                return res
            })
            .then(res => res.json())
            .then(data => dispatch(listModsSucceeded(data.mods)))
            .catch(error => dispatch(listModsHasError(error)))
    }
}
