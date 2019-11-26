import React from 'react';
import { connect } from 'react-redux';

// Bootstrap
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';

import { actionSendFriendRequest } from '../../redux/actions/users.action';

class IsFriend extends React.Component{

    constructor(props){
        super(props);
        console.log('is friends props: ', props);
        this.state = {
            isFriend: props.isFriend,
            isRequested: props.isRequested,
            isRequesting: false,
            userId: props.userId,
            self: props.self,
            apiMsg: ''
        };
        
    }

    sendFriendRequest = async e => {
        e.preventDefault();

        this.setState({ isRequesting: true });

        const res = await this.props.sendRequest(this.props.userId);

        if(res.status === true){
            if(res.code === "requested"){
                this.setState({ isRequesting: false, isRequested: true });
            }
            if(res.code === "friends"){
                this.setState({ isRequesting: false, isFriend: true });
            }
        }else{
            this.setState({ 
                isRequesting: false, 
                isFriend: false, 
                isRequested: false, 
                apiMsg: res.msg
            });
        }
    }

    render() {
        const { isFriend, isRequested, isRequesting, self } = this.state;
        console.log("is friend state: ", this.state);

        let status = '';
        if(isFriend === true) status = <Dropdown.Item disabled>Both are friends</Dropdown.Item>;
        if(isRequested === true) status = <Dropdown.Item disabled>Requested</Dropdown.Item>;

        if(isFriend === false && isRequested === false)
            status = <Dropdown.Item onClick={this.sendFriendRequest}>Send friend request</Dropdown.Item>            

        if(isRequesting === true) 
            status = <Dropdown.Item disabled>Requesting...</Dropdown.Item>;

        if(self === true)
            status = "";

        return (
            <div className="text-left mb-0 text-muted">
                {status}
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        sendRequest: to => dispatch(actionSendFriendRequest(to))
    }
}

export default connect(null, mapDispatchToProps)(IsFriend);