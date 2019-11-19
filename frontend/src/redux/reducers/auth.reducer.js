
const _state = {
    isAuthorized: false,
    user: {}
};

export default (state = _state, { type, payload }) => {
    switch(type){
        case 'auth':
            return {...state, ...payload}
        case 'me':
            return {...state, user: {...payload} }
        default:
            return state
    }
}
