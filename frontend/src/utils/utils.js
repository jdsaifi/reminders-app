export const isAccessToken = () => {
    const token = sessionStorage.getItem('reminderapp::access_token');

    if(token === null){
        return false;
    }else{
        return token
    }
}

export const BASE_URL = '/';