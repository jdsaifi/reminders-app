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

                return { status: true }
            }else{
                return { status: false }
            }
            
        }catch(error){
            const { response } = error;
            if(response){
                const { status, data } = response;
                switch(status){
                    case 422:
                        return { status: false, api_status: 422, msg: data.msg, data: data.data }
                    case 409:
                        return { status: false, api_status: 409, msg: data.msg, data: data.data }
                    default:
                        return { status: false, api_status: 500, msg: data.msg, data: data.data }
                }                
            }else{
                // something is wrong
                return { status: false, api_status: 500, msg: 'Something went wrong.' }
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