
const _state = {
    list: []
};

export default (state = _state, { type, payload }) => {
    switch(type){
        case 'load_reminders':
            return {...state, list: [ ...payload ] }
        default:
            return state
    }
}