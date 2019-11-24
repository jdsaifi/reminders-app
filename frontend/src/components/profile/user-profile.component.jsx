import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import Alert from 'react-bootstrap/Alert'

import { isAccessToken, BASE_URL } from '../../utils/utils';
import { actionAuthorize } from '../../redux/actions/auth.action';
import { actionUser } from '../../redux/actions/users.action';
import API from '../../utils/APIHelper';

/** Import Component */
import { ProfileCard } from './profile-card.component';
import { ProfileGlance } from './profile-glance.component';


function RequestButtons({ username, actionAccept, actionReject, reqAccepting, reqRejecting}){
    return (
        <div className="row mt-5">
            <div className="col-md">
                <Alert key="1" variant='info'>
                    <strong>Action required </strong>
                    You have a pending friend request from @{username}
                    {' '}  

                    {
                        reqAccepting || reqRejecting ?
                        <button className="btn btn-success" disabled>{reqAccepting?'Acepting...':'Accept'}</button> : 
                        <button className="btn btn-success" onClick={actionAccept}>Accept</button> 
                    }
                    
                    {' '} 

                    {
                        reqRejecting || reqAccepting ?
                        <button className="btn btn-danger" disabled>{reqRejecting?'Rejecting...':'Reject'}</button> :
                        <button className="btn btn-danger" onClick={actionReject}>Reject</button>
                    }
                </Alert>
            </div>
        </div>
    );
}

class UserProfile extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            apiMsg: '',
            errorMsg: '',
            reqAccepting: false,
            reqRejecting: false,
            dismisRequestButtons: false,
            didUpdate: false,
        }
    }

    async componentDidUpdate(prevProps, prevState){
        const { history, authorize, usersProfile, match: { params } } = this.props;

        // Is access_token exists
        if(!isAccessToken() || !await authorize()){
            history.push(`${BASE_URL}login`);
        }
        
        if(this.state.didUpdate !== prevState.didUpdate){
            await usersProfile(params.username || "");
            this.setState({ didUpdate: false });
        }
        
    }

    async componentDidMount(){
        const { history, authorize, usersProfile, match: { params } } = this.props;
        
        // Is access_token exists
        if(!isAccessToken()){
            history.push(`${BASE_URL}login`);
        }

        if(await authorize()){
            const resUserProfile = await usersProfile(params.username || "");
            if(!resUserProfile.status){
                this.setState({
                    apiMsg: resUserProfile.msg
                });
            }
        }else{
            history.push(`${BASE_URL}login`);
        }
    }

    actionAccept = async () => {
        const { user: { username } } = this.props;
        console.log("action accept clicked");
        this.setState({
            reqAccepting: true
        });

        try{
            const accessToken = sessionStorage.getItem('reminderapp::access_token');
            const { status, data: { status: api_status, data } } = await API.post(`/friends/requests/${username}/accept`, null, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if(status === 201){
                this.setState({
                    reqAccepting: false,
                    dismisRequestButtons: true,
                    didUpdate: true,
                    errorMsg: 'The friend request has been accepted.'
                });
            }
        }catch(error){

            const { response } = error;
            if(response){
                const { data } = response;
                this.setState({
                    reqAccepting: false,
                    errorMsg: data.msg
                });     
            }else{
                // something is wrong
                this.setState({
                    reqAccepting: false,
                    errorMsg: 'Something went wrong.'
                });
            }
        }
    }

    actionReject = async () => {
        console.log("action reject clicked");
        const { user: { username } } = this.props;
        this.setState({
            reqRejecting: true
        });

        try{
            const accessToken = sessionStorage.getItem('reminderapp::access_token');
            const { status, data: { status: api_status, data } } = await API.post(`/friends/requests/${username}/reject`, null, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if(status === 201){
                this.setState({
                    reqRejecting: false,
                    dismisRequestButtons: true,
                    didUpdate: true,
                    errorMsg: 'The friend request has been rejected.'
                });
            }
        }catch(error){

            const { response } = error;
            if(response){
                const { data } = response;
                this.setState({
                    reqRejecting: false,
                    errorMsg: data.msg
                });     
            }else{
                // something is wrong
                this.setState({
                    reqRejecting: false,
                    errorMsg: 'Something went wrong.'
                });
            }
        }
    }

    proccessBlock = async () => {
        const { user: { username } } = this.props;

        try{
            const accessToken = sessionStorage.getItem('reminderapp::access_token');
            const { status, data: { status: api_status, data } } = await API.post(`/users/${username}/block`, null, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if(status === 201){
                this.setState({
                    errorMsg: 'User has been blocked',
                    didUpdate: true
                });
            }
        }catch(error){

            const { response } = error;
            if(response){
                const { data } = response;
                this.setState({
                    errorMsg: data.msg
                });     
            }else{
                // something is wrong
                this.setState({
                    errorMsg: 'Something went wrong.'
                });
                
            }
        }


    }

    proccessUnblock = async () => {
        const { user: { username } } = this.props;
        
        try{
            const accessToken = sessionStorage.getItem('reminderapp::access_token');
            const { status, data: { status: api_status, data } } = await API.post(`/users/${username}/unblock`, null, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if(status === 201){
                this.setState({
                    errorMsg: 'User has been unblocked',
                    didUpdate: true
                });
            }
        }catch(error){

            const { response } = error;
            if(response){
                const { data } = response;
                this.setState({
                    errorMsg: data.msg
                });     
            }else{
                // something is wrong
                this.setState({
                    errorMsg: 'Something went wrong.'
                });
            }
        }
    }

    handleBlock = () => {
        const isBlocked = this.props.user.isBlocked;
        
        if(isBlocked === true){
            // process unblock
            this.proccessUnblock();
        }

        if(isBlocked === false){
            // process block
            this.proccessBlock()
        }
    }

    closeError = () =>{
        this.setState({
            errorMsg: ''
        })
    }

    render() {
        const { user } = this.props;
        const { apiMsg, reqAccepting, reqRejecting, errorMsg, dismisRequestButtons } = this.state;

        if(apiMsg !== '') return (<h3 className="text-center lead mt-4">{apiMsg}</h3>);

        if(_.isEmpty(user)) return (<p className="mt-4 text-center"><i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
        <span className="sr-only">Loading...</span></p>);        

        return (
            <section className="container">
                {user.hasRequest && dismisRequestButtons === false ? <RequestButtons 
                    username={user.username} 
                    actionAccept={this.actionAccept}
                    actionReject={this.actionReject}
                    reqAccepting={reqAccepting}
                    reqRejecting={reqRejecting}
                />:null}

                {errorMsg === '' ? null : <div className="row">
                    <div className="col-md">
                        <Alert key="2" variant='info' onClose={() => this.closeError()} dismissible>
                            <strong>Alert! </strong>{errorMsg}</Alert>
                    </div>
                </div>}

                <div className="row mt-5 br1">
                    <article className="col-md-6 col-lg-4 col-sm-12 text-cetner bb1">
                        <ProfileCard {...user} isOwner={false} />
                    </article>
                    <article className="col-md-6 col-lg-8 col-sm-12 bg1">
                        <ProfileGlance {...user} isOwner={false} handleBlock={this.handleBlock} />
                    </article>
                </div>
            </section>
        )
        
    }
}

const mapStateToProps = state => ({
    user: state.users.profile
});

const mapDispatchToProps = dispatch => {
    return {
        authorize: () => dispatch(actionAuthorize()),
        usersProfile: username => dispatch(actionUser(username))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);