import React from 'react';

import { isAccessToken } from '../../utils/utils';

class Logout extends React.Component{
    async componentDidMount(){
        const { history } = this.props;

        if(!isAccessToken()){
            history.push('/login');
        }

        // Remove access token
        sessionStorage.removeItem('reminderapp::access_token');
        history.push('/login');
    }
}

export default Logout;