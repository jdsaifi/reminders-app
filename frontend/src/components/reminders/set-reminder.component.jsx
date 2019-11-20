import React from 'react';
import { connect } from 'react-redux';

// Bootstrap
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

import { isAccessToken, BASE_URL } from '../../utils/utils';
import { actionAuthorize } from '../../redux/actions/auth.action';
import { actionSetReminder } from '../../redux/actions/reminders.action';


class SetReminder extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showErrorAlert: false,
            showSuccessAlert: false,
            msg: '',

            // form data
            remind_me: '',
            enabled:true,
            date: 'today',
            time: 'morning',
            friends:''
        }
    }

    async componentDidMount(){
        const { history, authorize } = this.props;
        
        // Is access_token exists
        if(!isAccessToken() || !await authorize()){
            history.push(`${BASE_URL}login`);
        }
    }

    saveReminder = async () => {
        const { setReminder } = this.props;
        const { remind_me, enabled, date, time, friends } = this.state;
        
        let setReminderData = {remind_me, enabled, date, time, friends};

        const res = await setReminder(setReminderData);

        if(res.status === true){
            this.setState({
                showSuccessAlert: true,
                msg: res.msg
            });
        }else{
            this.setState({
                showErrorAlert: true,
                msg: res.msg
            });
        }
    }

    closeSuccessAlert = () => {
        this.setState({
            showSuccessAlert: false
        });
    }

    closeErrorAlert = () => {
        this.setState({
            showErrorAlert: false
        });
    }

    onChange = (e) => {
        /*
          Because we named the inputs to match their
          corresponding values in state, it's
          super easy to update the state
        */
        this.setState({ [e.target.name]: e.target.value });
      }

    render(){
        const { showErrorAlert, showSuccessAlert, remind_me, date, time } = this.state;
        return (
            <Container className="mt-5">
                {
                    showSuccessAlert ? 
                    <Alert key={1} variant='success' onClose={() => this.closeSuccessAlert()} dismissible>
                        <strong>Success! </strong>{this.state.msg}
                    </Alert>
                    : ''
                }

                {
                    showErrorAlert ? 
                    <Alert key={1} variant='danger' onClose={() => this.closeErrorAlert()} dismissible>
                        <strong>Error! </strong>{this.state.msg}
                    </Alert>
                    : ''
                }


                <Form>
                    <Card className="mx-auto w-50">
                    <Card.Header>Set a reminder</Card.Header>
                    <Card.Body>
                        <Form.Control type="text" placeholder="Remind me..." name="remind_me" value={remind_me} onChange={this.onChange} />
                        <hr />

                        <section className="row">
                            <div className="col-md">
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control as="select" name="date" onChange={this.onChange} value={date}>
                                        <option value="today">Today</option>
                                        <option value="tomorrow">tomorrow</option>
                                        <option value="set">Set date</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                            <div className="col-md">
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Time</Form.Label>
                                    <Form.Control as="select" name="time" onChange={this.onChange} value={time}>
                                        <option value="morning">Morning</option>
                                        <option value="afternoon">Afternoon</option>
                                        <option value="evening">Evening</option>
                                        <option value="night">Night</option>
                                        <option value="set_time">Set time</option>
                                    </Form.Control>
                                </Form.Group>
                            </div>
                        </section>

                    </Card.Body>

                    <Card.Footer className="text-muted">
                        <Button variant="outline-dark" onClick={this.saveReminder}>Save Reminder</Button>
                    </Card.Footer>
                    </Card>
                </Form>          
                
            </Container>
            
        )
    }
}


const mapDispatchToProps = dispatch => {
    return {
        authorize: () => dispatch(actionAuthorize()),
        setReminder: data => dispatch(actionSetReminder(data))
    }
}

export default connect(null, mapDispatchToProps)(SetReminder);