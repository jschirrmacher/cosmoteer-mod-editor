export const listModsIsLoading = (state = false, action = '') => {
    switch (action.type) {
        case 'LIST_MODS_LOADING':
            return action.isLoading

        default:
            return state
    }
}

export const listModsHasError = (state = '', action = '') => {
    switch (action.type) {
        case 'LIST_MODS_ERROR':
            return action.error

        default:
            return state
    }
}

export const listMods = (state = [], action = '') => {
    switch (action.type) {
        case 'LIST_MODS_SUCCEEDED':
            return action.mods

        default:
            return state
    }
}
