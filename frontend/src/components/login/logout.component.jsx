import React from 'react';

import { isAccessToken, BASE_URL } from '../../utils/utils';

class Logout extends React.Component{
    async componentDidMount(){
        const { history } = this.props;

        if(!isAccessToken()){
            history.push(`${BASE_URL}login`);
        }

        // Remove access token
        sessionStorage.removeItem('reminderapp::access_token');
        return history.push(`${BASE_URL}login`);
    }

    render() {
        return (
            <div className="container">
                See you soon...
            </div>
        )
    }
}

export default Logout;