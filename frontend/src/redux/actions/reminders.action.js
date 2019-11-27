import API from '../../utils/APIHelper';

/** all reminders */
export const actionReminders = page => {
    return async dispatch => {
        try{
            const accessToken = sessionStorage.getItem('reminderapp::access_token');
            const { status, data: { status: api_status, data, meta } } = await API.get(`/reminders?page=${page}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            if(status === 200 && api_status === 'okay'){
                dispatch({
                    type: 'load_reminders',
                    payload: data
                });

                return {status: true, msg:`List of reminders`, meta}
            }else{
                return {status: false, msg:'Something went wrong.'}
            }
        }catch(error){
            const { response } = error;
            if(response){
                const { status, data } = response;
                if(status === 404 ){
                    return { status: false, api_status: 404, msg: data.msg, data: data.data }
                }
                return {status: false, msg:'Something went wrong.'}
            }else{
                // something is wrong
                return {status: false, msg:'Something went wrong.'}
            }
        }

    }
}
// End Reminders

/** 
 * Load all expired reminders
 */
export const actionExpiredReminders = page => {
    return async dispatch => {
        try{
            const accessToken = sessionStorage.getItem('reminderapp::access_token');
            const { status, data: { status: api_status, data, meta } } = await API.get(`/expired-reminders?page=${page}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            if(status === 200 && api_status === 'okay'){
                dispatch({
                    type: 'load_reminders',
                    payload: data
                });

                return {status: true, msg:`List of reminders`, meta}
            }else{
                return {status: false, msg:'Something went wrong.'}
            }
        }catch(error){
            const { response } = error;
            if(response){
                const { status, data } = response;
                if(status === 404 ){
                    return { status: false, api_status: 404, msg: data.msg, data: data.data }
                }
                return {status: false, msg:'Something went wrong.'}
            }else{
                // something is wrong
                return {status: false, msg:'Something went wrong.'}
            }
        }

    }
}
 // End actionExpiredReminders();

/**
 * Set Reminder
 */
export const actionSetReminder = reminder_data => {
    return async dispatch => {
        try{
            const accessToken = sessionStorage.getItem('reminderapp::access_token');
            const { status, data: { status: api_status } } = await API.post(`/reminders`, reminder_data, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if(status === 201 && api_status === 'okay'){
                dispatch({
                    type: 'set_new_reminder_success'
                });

                return {status: true, msg:`Reminder has been set successfully.`}
            }else{
                return {status: false, msg:'Something went wrong.'}
            }
        }catch(error){
            const { response } = error;
            if(response){
                const { data } = response;
                return { status: false, api_status: data.status, msg: data.msg, data: data.data }
            }else{
                // something is wrong
                return {status: false, msg:'Something went wrong.'}
            }
        }
    }
}