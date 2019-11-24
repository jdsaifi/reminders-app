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

class UpdateProfile extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            can_friend_set_reminder: false,
            display_name: '',
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
                display_name: user.display_name,
                can_friend_set_reminder: user.can_friend_set_reminder
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
       
        if(e.target.type === 'checkbox'){
            this.setState({ [e.target.name]: e.target.checked });
        }else{
            this.setState({ [e.target.name]: e.target.value });
        }
        
    }

    saveProfile = async () => {
        const { display_name, can_friend_set_reminder } = this.state;
        
        try{
            const accessToken = sessionStorage.getItem('reminderapp::access_token');
            const { status, data: { status: api_status, data } } = await API.post(`/profile`, {
                display_name, can_friend_set_reminder
            }, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if(status === 201){
                this.setState({                    
                    msg: 'Profile update success.'
                });
            }
        }catch(error){
            this.setState({                    
                msg: 'Something went wrong.'
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
        const { display_name, can_friend_set_reminder } = this.state;

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
                            <Card.Header>Profile</Card.Header>
                            <Card.Body>                            
                                <Form.Group controlId="display_name">
                                    <Form.Label>Display Name</Form.Label>
                                    <Form.Control 
                                        name="display_name"
                                        type="text" 
                                        placeholder="Enter display name" 
                                        value={display_name}
                                        onChange={this.onChange}
                                    />
                                </Form.Group>

                                <Form.Group controlId="can_friend_set_reminder">
                                    <Form.Check 
                                        type="switch"
                                        id="can_friend_set_reminder"
                                        name="can_friend_set_reminder"
                                        label="Can friend set reminder for you"
                                        onChange={this.onChange}
                                        checked={can_friend_set_reminder}
                                    />
                                </Form.Group>
                                
                            </Card.Body>

                            <Card.Footer>
                            <Button variant="outline-dark" onClick={this.saveProfile}>
                                    Save Profile
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

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfile);

