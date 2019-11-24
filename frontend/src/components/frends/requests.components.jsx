import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { isAccessToken, BASE_URL } from '../../utils/utils';
import { UserSearchCard } from '../search/user-search-card.component';
import { actionAuthorize } from '../../redux/actions/auth.action';
import API from '../../utils/APIHelper';

class FriendRequests extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            apiMsg: '',
            requests: []
        };
    }

    async componentDidMount(){
        const { history, authorize } = this.props;
        // Is access_token exists
        if(!isAccessToken() || !await authorize()){
            history.push(`${BASE_URL}login`);
        }
        
        const accessToken = sessionStorage.getItem('reminderapp::access_token');
        const { status, data: { status: api_status, data } } = await API.get(`/friends/requests`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if(status === 200){
            const req_in = data[0].friend_requests_in;
            this.setState({
                requests: data[0].friend_requests_in,
                apiMsg: req_in.length < 1?'No Data Found.':''
            });
        }
    }



    render() {
        const { requests, apiMsg } = this.state;

        if(apiMsg !== '') return (<h3 className="text-center lead mt-4">{apiMsg}</h3>);

        if(_.isEmpty(requests)) return (<p className="mt-4 text-center"><i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
        <span className="sr-only">Loading...</span></p>);

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12 lead mt-4 mb-4">
                        Friend requests
                        <hr />
                    </div>
                </div>

                <div className="row">
                    {requests.map(user => {
                        return <UserSearchCard key={user._id} {...user} />
                    })}
                </div>
            </div>
        )
    }

}

const mapDispatchToProps = dispatch => {
    return {
        authorize: () => dispatch(actionAuthorize())
    }
}

export default connect(null, mapDispatchToProps)(FriendRequests)