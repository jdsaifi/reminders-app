import { combineReducers } from 'redux';
import authReducer from './auth.reducer';
import userReducer from './user.reducer';
import remindersReducer from './reminders.reducer';

export default combineReducers({
    auth: authReducer,
    users: userReducer,
    reminders: remindersReducer
});