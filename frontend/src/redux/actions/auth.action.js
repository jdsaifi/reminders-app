import API from '../../utils/APIHelper';

export const actionSocialSignIn = data => {
    return async dispatch => {
        try{
            const socialLoginResponse = await API.post(`/social-signin`, data);
            if(socialLoginResponse.status === 201){
                const { data: { data } } = socialLoginResponse;

                // Save JWT Access Token
                sessionStorage.setItem('reminderapp::access_token', data.access_token);
                
                dispatch({
                    type: 'auth',
                    payload: {...data, isAuthorized: true}
                });

                return { c: 10001, status: true, msg: 'Success' }
            }else{
                return { c: 10002, status: false, msg: 'Something went wrong.' }
            }
            
        }catch(error){
            const { response } = error;
            if(response){
                const { status, data } = response;
                switch(status){
                    case 422:
                        return { c: 10003, status: false, api_status: 422, msg: data.msg, data: data.data }
                    case 409:
                        return { c: 10004, status: false, api_status: 409, msg: data.msg, data: data.data }
                    default:
                        return { c: 10005, status: false, api_status: 500, msg: data.msg, data: data.data }
                }                
            }else{
                // something is wrong
                return { c: 10006, status: false, api_status: 500, msg: 'Something went wrong.' }
            }
        }
    }
}

export const actionAuthorize = () => {
    return async dispatch => {
        try{
            const accessToken = sessionStorage.getItem('reminderapp::access_token');
            const { data } = await API.get('/authorize', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            if(data.status === 'okay'){
                dispatch({
                    type: 'auth',
                    payload: { isAuthorized: true }
                });
                return true;
            }else{
                dispatch({
                    type: 'auth',
                    payload: { isAuthorized: false }
                });
                return false;
            }
        }catch(error){
            return false;
        }
    }
}