import React from 'react';
import { connect } from 'react-redux';

// Bootstrap
import Button from 'react-bootstrap/Button';

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
        if(isFriend === true) status = "Friends";
        if(isRequested === true) status = "Requested";

        if(isFriend === false && isRequested === false)
            status = <Button onClick={this.sendFriendRequest} variant="link" size="sm">Send friend request</Button>;

        if(isRequesting === true) 
            status = <Button variant="link" size="sm" disabled>requesting...</Button>

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