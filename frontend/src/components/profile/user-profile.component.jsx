import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { isAccessToken, BASE_URL } from '../../utils/utils';

import { actionAuthorize } from '../../redux/actions/auth.action';
import { actionUser } from '../../redux/actions/users.action';

/** Import Component */
import { ProfileCard } from './profile-card.component';
import { ProfileGlance } from './profile-glance.component';

class UserProfile extends React.Component {

    async componentDidMount(){
        const { history, authorize, usersProfile, match: { params } } = this.props;
        
        // Is access_token exists
        if(!isAccessToken()){
            history.push(`${BASE_URL}login`);
        }

        if(await authorize()){
            const resUserProfile = await usersProfile(params.username || "");
            if(!resUserProfile.status){
                // To-Do: show error message
            }
        }else{
            history.push(`${BASE_URL}login`);
        }

    }

    render() {
        const { user } = this.props;
        
        if(_.isEmpty(user)){
            return (<h2 className="text-center">Data Not Found.</h2>)
        }else{
            return (
                <section className="container">
                    <div className="row mt-5 br1">
                        <article className="col-md-4 col-sm-6 text-cetner bb1">
                            <ProfileCard {...user} isOwner={false} />
                        </article>
                        <article className="col-md bg1">
                            <ProfileGlance {...user} />
                        </article>
                    </div>
                </section>
            )
        }
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