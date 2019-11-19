
const _state = {
    profile: {},
    users: [],
    userSearchMeta: {}
};

export default (state = _state, { type, payload }) => {
    switch(type){
        case 'user_profile':
            return {...state, profile: { ...payload } }
        case 'search_user':
            return {...state, ...payload}
        default:
            return state
    }
}