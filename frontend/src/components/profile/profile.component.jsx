import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { isAccessToken, BASE_URL } from '../../utils/utils';

import { actionAuthorize } from '../../redux/actions/auth.action';
import { actionMe } from '../../redux/actions/users.action';

/** Import Component */
import { ProfileCard } from './profile-card.component';
import { ProfileGlance } from './profile-glance.component';

class Profile extends React.Component {

    async componentDidMount(){
        const { history, authorize, meProfile } = this.props;
        
        // Is access_token exists
        if(!isAccessToken()){
            history.push(`${BASE_URL}login`);
        }

        if(await authorize()){
            await meProfile();
        }else{
            history.push(`${BASE_URL}login`);
        }

    }

    render() {
        const { user } = this.props;
        if(_.isEmpty(user)) return (<p className="mt-4 text-center"><i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
        <span className="sr-only">Loading...</span></p>);
        return (
            <section className="container">
                <div className="row mt-5 br1">
                    <article className="col-md-4 col-sm-6 text-cetner bb1">
                        <ProfileCard {...user} isOwner={true} />
                    </article>
                    <article className="col-md bg1">
                        <ProfileGlance {...user} />
                    </article>
                </div>
            </section>
        )
    }

}

const mapStateToProps = state => ({
    user: state.auth.user
});

const mapDispatchToProps = dispatch => {
    return {
        authorize: () => dispatch(actionAuthorize()),
        meProfile: () => dispatch(actionMe())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);