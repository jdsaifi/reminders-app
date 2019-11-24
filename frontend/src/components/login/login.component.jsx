import React from 'react';
import { connect } from 'react-redux';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import _ from 'lodash';
import moment from 'moment-timezone';

// Bootstrap
import Alert from 'react-bootstrap/Alert';

import { isAccessToken, BASE_URL } from '../../utils/utils';
import { actionSocialSignIn, actionAuthorize } from '../../redux/actions/auth.action';

class Login extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            loginErrorMsg: ''
        }
    }

    async componentDidMount(){
        const { history } = this.props;

        // Is access_token exists
        if(isAccessToken()){
            history.push(`${BASE_URL}`);
        }
        
    }

    signin = async (res, provider) => {
        let data;
        console.log("provider: ", provider);
        console.log("res: ", res);

        if(provider === 'facebook' && res.email){
            let username = res.email.split('@')[0];
            data = {
                auth_provider: 'facebook',
                auth_provider_id: res.id,
                auth_provider_access_token: res.accessToken,
                username: username,
                email: res.email,
                display_name: res.name,
                dp: `https://graph.facebook.com/${res.id}/picture?type=large`,
                first_name: res.first_name || "",
                last_name: res.last_name || "",
                timezone: moment.tz.guess()
            }
        }

        if(provider === 'google' && !_.isEmpty(res.profileObj)){
            let username = res.profileObj.email.split('@')[0];
            data = {
                auth_provider: 'google',
                auth_provider_id: res.profileObj.googleId,
                auth_provider_access_token: res.accessToken,
                username: username,
                email: res.profileObj.email,
                display_name: res.profileObj.name,
                dp: res.profileObj.imageUrl,
                first_name: res.profileObj.givenName || "",
                last_name: res.profileObj.familyName || "",
                timezone: moment.tz.guess()
            }
        }



        if(data){
            const res = await this.props.signin(data);
            console.log("social login res: ", res);
            if(res.status === false){
                this.setState({ loginErrorMsg: res.msg });
            }

            if(res.status === true){
                this.setState({ loginErrorMsg: '' });
                const { history } = this.props;
                // Redirect user to Profile(/me) page
                history.push(`${BASE_URL}me`);
            }
        }else{
            this.setState({ loginErrorMsg: 'Something went wrong. Please try later.' });
        }
    }

    closeErrorAlert = () => {
        this.setState({ loginErrorMsg: '' });
    }

    render(){
        const { loginErrorMsg } = this.state;

        return(
            <section className="container">
                <h2 className="text-center">Welcome to Remind.me</h2>
                <hr />

                {
                    loginErrorMsg !== '' ? 
                    <Alert key={1} variant='danger' onClose={() => this.closeErrorAlert()} dismissible>
                        <strong>Error! </strong>{loginErrorMsg}
                    </Alert>
                    : ''
                }

                <article className="jumbotron">
                    <p className="text-center lead">
                        <strong>
                            Ready to begin? Signin to set reminder and collaborate with your friends and colleagues!
                        </strong>
                    </p>

                    <div className="text-center">
                        <FacebookLogin
                            appId="860969304305165" //APP ID NOT CREATED YET
                            fields="name,email,picture,first_name,last_name"
                            callback={res => this.signin(res, 'facebook')}
                            cssClass="loginBtn loginBtn--facebook mr-4"
                        />

                        <GoogleLogin
                                clientId="604433154038-357srq78dgd0jiji0fs7s8rme0k5uu0u.apps.googleusercontent.com" //CLIENTID NOT CREATED YET
                                buttonText="LOGIN WITH GOOGLE"
                                onSuccess={res => this.signin(res, 'google')}
                                onFailure={res => this.signin(res, 'google')}
                            />
                    </div>
                </article>
            </section>
        )
    }
}

const mapStateToProps = state => ({
    user: state.auth.user
})

const mapDispatchToProps = dispatch => {
    return {
        signin: data => dispatch(actionSocialSignIn(data)),
        authorize: () => dispatch(actionAuthorize())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);