import API from '../../utils/APIHelper';

export const actionMe = () => {
    return async dispatch => {
        try{
            const accessToken = sessionStorage.getItem('reminderapp::access_token');
            const { data: { status, data } } = await API.get('/users/me', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if(status === 'okay'){
                dispatch({
                    type: 'me',
                    payload: data
                });
                return {status: true, msg:'Profile'}
            }else{
                return {status: false, msg:'Something went wrong.'}
            }

        }catch(error){
            const { response } = error;
            if(response){
                const { data } = response;
                return { status: false, msg: data.msg, data: data.data }
            }else{
                // something is wrong
                return {status: false, msg:'Something went wrong.'}
            }
        }

    }
}

export const actionUser = username => {
    return async dispatch => {
        try{
            const accessToken = sessionStorage.getItem('reminderapp::access_token');
            const { status, data: { status: api_status, data } } = await API.get(`/users/${username}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            if(status === 200 && api_status === 'okay'){
                dispatch({
                    type: 'user_profile',
                    payload: data
                });

                return {status: true, msg:`${username}'s Profile`}
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
                
            }else{
                // something is wrong
                return {status: false, msg:'Something went wrong.'}
            }
        }

    }
}

export const actionSearchUser = (q, page) => {
    console.log("actionsearch user q: ", q)
    console.log("actionsearch user page: ", page)
    return async dispatch => {
        try{            
            const accessToken = sessionStorage.getItem('reminderapp::access_token');
            const { status, data: { status: api_status, data, meta } } = await API.get(`/search?q=${q}&page=${page}&limit=24`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            if(status === 200 && api_status === 'okay'){
                dispatch({
                    type: 'search_user',
                    payload: {
                        users: data,
                        userSearchMeta: meta
                    }
                });

                return {status: true, msg:`Search result`, meta}
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
                
            }else{
                // something is wrong
                return {status: false, msg:'Something went wrong.'}
            }
        }

    }
}