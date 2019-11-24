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
                return { status: false, api_status: 500, msg:'Something went wrong.', data: data.data }
            }else{
                // something is wrong
                return {status: false, msg:'Something went wrong.'}
            }
        }

    }
}

export const actionSearchUser = (q, page) => {
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

export const actionSendFriendRequest = (to) => {
    return async dispatch => {
        try{
            const accessToken = sessionStorage.getItem('reminderapp::access_token');
            const { status, data: { status: api_status, msg, code } } = await API.post(`/friends/request`, {
                to
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if(status === 201){
                // request sent
                return {status: true, code: 'requested'}
            }

            if(status === 200){
                if(code === 'already_friends') return {status: true, code: 'friends'}
                if(code === 'already_requested') return {status: true, code: 'requested'}
            }

        }catch(error){
            const { response } = error;
            if(response){
                const { status, data } = response;
                switch(status){
                    case 422:
                        return {status: false, api_status: 422, msg: data.msg, data: data.data }                    
                    default:
                        return {status: false, api_status: 500, msg: data.msg, data: data.data }
                }                
            }else{
                // something is wrong
                return { status: false, api_status: 500, msg: 'Something went wrong.' }
            }
        }
    }
}

export const actionLoadFriends = () => {
    return async dispatch => {
        try{            
            const accessToken = sessionStorage.getItem('reminderapp::access_token');
            const { status, data: { status: api_status, data } } = await API.get(`/friends`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            if(status === 200 && api_status === 'okay'){
                dispatch({
                    type: 'loadFriends',
                    payload: data
                });

                return {status: true, msg:`Friends`}
            }else{
                return {status: false, msg:'Something went wrong.'}
            }
        }catch(error){
            const { response } = error;
            if(response){
                const { status, data } = response;
                return {status: false, msg: data.msg}
            }else{
                // something is wrong
                return {status: false, msg:'Something went wrong.'}
            }
        }

    }
}