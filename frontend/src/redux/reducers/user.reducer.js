
const _state = {
    profile: {},
    users: [],
    userSearchMeta: {},
    friends: []
};

export default (state = _state, { type, payload }) => {
    switch(type){
        case 'user_profile':
            return {...state, profile: { ...payload } }
        case 'search_user':
            return {...state, ...payload}
        case 'loadFriends':
            return {...state, friends: [...payload] }
        default:
            return state
    }
}