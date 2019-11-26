import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { isAccessToken, BASE_URL } from '../../utils/utils';
import API from '../../utils/APIHelper';

import { actionAuthorize } from '../../redux/actions/auth.action';
import { actionMe } from '../../redux/actions/users.action';

// bootstrap
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

class ChangeUsername extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            username: '',
            msg: ''
        }
    }

    async componentDidMount(){
        const { history, authorize, meProfile } = this.props;
        
        // Is access_token exists
        if(!isAccessToken()){
            history.push(`${BASE_URL}login`);
        }

        if(await authorize()){
            await meProfile();
            const { user } = this.props;
            this.setState({
                username: user.username
            });

        }else{
            history.push(`${BASE_URL}login`);
        }

    }

    onChange = (e) => {
        /*
          Because we named the inputs to match their
          corresponding values in state, it's
          super easy to update the state
        */
        this.setState({ [e.target.name]: e.target.value });
    }

    saveProfile = async () => {
        const { username } = this.state;
        const { user } = this.props;

        
        
        try{
            if(username === user.username) throw new Error('same_name');
            const accessToken = sessionStorage.getItem('reminderapp::access_token');
            const { status, data: { status: api_status, data } } = await API.post(`/change-username`, {
                username
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if(status === 201){
                this.setState({                    
                    msg: 'Username has been updated.'
                });
            }
        }catch(error){
            const { response } = error;
            let errorMsg = error.message;
            if(response){
                const { status, data } = response;
                errorMsg = data.msg;
                if(status === 422){
                    errorMsg = data.data[0].msg
                }
            }
            
            this.setState({                    
                msg: errorMsg
            });
        }
    }

    closeAlert = () => {
        this.setState({                    
            msg: ''
        });
    }

    render() {
        const { user } = this.props;
        const { username } = this.state;

        if(_.isEmpty(user)) return (<p className="mt-4 text-center"><i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
        <span className="sr-only">Loading...</span></p>);

        return (
            <section className="container">
                {
                    this.state.msg !== '' ? 
                    <Alert key={1} variant='info' onClose={() => this.closeAlert()} dismissible>
                        <strong>Alert! </strong>{this.state.msg}
                    </Alert>
                    : ''
                }
                <div className="row mt-5 br1">
                    <div className="col-md">
                    <Form >
                        <Card className='mx-auto w-50'>
                            <Card.Header>Username</Card.Header>
                            <Card.Body>                            
                                <Form.Group controlId="display_name">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control 
                                        name="username"
                                        type="text" 
                                        placeholder="Enter username" 
                                        value={username}
                                        onChange={this.onChange}
                                    />
                                </Form.Group>
                            </Card.Body>

                            <Card.Footer>
                            <Button variant="outline-dark" onClick={this.saveProfile}>
                                    Change Username
                            </Button>
                            </Card.Footer>

                        </Card>
                    </Form>
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangeUsername);

