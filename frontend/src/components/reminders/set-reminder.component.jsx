import React from 'react';
import { connect } from 'react-redux';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import _ from 'lodash';

// Bootstrap
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';


import { isAccessToken, BASE_URL, partsOfTheDay, parts, validateDateTime, TIME_PICKER_TIME_INTERVALS } from '../../utils/utils';
import { actionAuthorize } from '../../redux/actions/auth.action';
import { actionSetReminder } from '../../redux/actions/reminders.action';
import { actionLoadFriends } from '../../redux/actions/users.action';
import queryString from 'query-string';

class SetReminder extends React.Component {
    constructor(props){
        super(props);

        const qs = queryString.parse(props.location.search);

        const validDate = validateDateTime(moment().format('YYYY-MM-DD'), parts[0]);

        this.state = {
            showErrorAlert: false,
            showSuccessAlert: false,
            msg: '',

            // form data
            remind_me: '',
            date: validDate.converted.date,
            dateDisplay: 'Today',
            time: validDate.converted.time,
            timeDisplay: partsOfTheDay(), //validDate.inputs.time,
            partsOfTheDay: parts,
            showPastDateError: false,
            friend: 'f' in qs ? qs.f : ''
        }

        
    }

    async componentDidMount(){
        const { history, authorize, loadFriends } = this.props;
        
        // Is access_token exists
        if(!isAccessToken() || !await authorize()){
            history.push(`${BASE_URL}login`);
        }

        const loadFriendsRes = await loadFriends();
        console.log('loadFriendsRes : ', loadFriendsRes);
    }

    saveReminder = async () => {
        const { setReminder } = this.props;
        const { remind_me, date, time, friend } = this.state;
        
        let setReminderData = {remind_me, date, time, friend};

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

    dateDropdownHandler = (val) => {        
        let date = null;
        let dateDisplay = val;
        if(_.isObject(dateDisplay)){
            date = moment(val);
            if(date.format('YYYY') == moment().format('YYYY')){                
                dateDisplay = date.format('dddd, MMMM DD');
            }else{
                dateDisplay = date.format('dddd, MMMM DD, YYYY');
            }
        }else{
            date = moment();
            if(dateDisplay === 'Tomorrow'){
                date.add(1, 'd');
            }
        }
        date = date.format('YYYY-MM-DD');
        
        this.setState({ date, dateDisplay }, () => {
            const { date, time } = this.state;
            const valid = validateDateTime(date, time);
            this.setState({showPastDateError: !valid.status});
        });
    }

    timeDropdownHandler = (val) => {
        let time = val;
        let timeDisplay = val;
        if(_.isObject(time)){
            time = moment(val).format("HH:mm");
            timeDisplay = moment(val).format("hh:mm A");
        }
        this.setState({ time, timeDisplay }, () => {
            const { date, time } = this.state;
            const valid = validateDateTime(date, time);
            this.setState({showPastDateError: !valid.status, time: valid.converted.time});
        });
    }

    render(){
        const { 
            showErrorAlert, 
            showSuccessAlert, 
            remind_me, 
            partsOfTheDay, 
            dateDisplay, 
            timeDisplay, 
            showPastDateError,
            friend
        } = this.state;

        const { friends } = this.props;

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
                        <div className="row">
                            <div className="col-md">
                                <Form.Control type="text" placeholder="Remind me..." name="remind_me" value={remind_me} onChange={this.onChange} className="align-text-bottom" />
                            </div>

                            <div className="col-md">
                            <Form.Group controlId="exampleForm.ControlSelect1">
                                <Form.Control as="select" value={friend} name="friend" onChange={this.onChange} >
                                    <option value="">Friends</option>
                                    {
                                        friends.map(friend => <option key={friend._id} value={friend._id}>
                                            {friend.display_name}
                                        </option>)
                                    }
                                    
                                </Form.Control>
                            </Form.Group>
                            </div>
                        </div>

                        <hr />



                        <section className="row">
                            <div className="col-md">

                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Date</Form.Label>
                                    <Dropdown className="w-100 ">
                                        <Dropdown.Toggle variant="light" id="dropdown-basic" className="w-100 text-left">
                                                {dateDisplay}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="w-100">
                                            <Dropdown.Item onClick={()=>this.dateDropdownHandler('Today')}>Today</Dropdown.Item>
                                            <Dropdown.Item onClick={()=>this.dateDropdownHandler('Tomorrow')}>Tomorrow</Dropdown.Item>
                                            <Dropdown.Item className="hover-dropdown">
                                                Set date
                                            </Dropdown.Item>
                                            <div className="hover-cal">
                                                <DatePicker inline
                                                    selected={new Date()}
                                                    onChange={(date) => this.dateDropdownHandler(date)}
                                                />
                                            </div>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Form.Group>
                            </div>
                            <div className="col-md">
                                <Form.Group controlId="exampleForm.ControlSelect1">
                                    <Form.Label>Time</Form.Label>
                                    <Dropdown className="w-100 ">
                                        <Dropdown.Toggle variant="light" id="dropdown-basic" className="w-100 text-left">
                                                {timeDisplay}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="w-100">
                                            {
                                                partsOfTheDay.map(
                                                    part => <Dropdown.Item key={part} onClick={
                                                        ()=>this.timeDropdownHandler(part)
                                                    }>{part}</Dropdown.Item>)
                                            }

                                            <Dropdown.Item className="hover-dropdown">
                                                Set time
                                            </Dropdown.Item>

                                            <div className="hover-cal">
                                                
                                            <DatePicker inline
                                                selected={new Date()}
                                                onChange={date => this.timeDropdownHandler(date)}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeIntervals={TIME_PICKER_TIME_INTERVALS}
                                                timeCaption="Time"
                                                dateFormat="h:mm aa"
                                            />
                                            </div>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Form.Group>
                            </div>
                        </section>

                    </Card.Body>
                    <Card.Footer className="text-muted">
                        <div className="row">
                            <div className='col-md'>
                                <Button 
                                    variant="outline-dark" 
                                    onClick={this.saveReminder}
                                    disabled={ remind_me === '' || showPastDateError === true ? `disabled` : null}
                                >Save Reminder</Button>
                            </div>
                            <div className='col-md error-msg text-right'>
                                {
                                    showPastDateError === true ? 
                                    <span>
                                        <i className="fa fa-exclamation-triangle"></i> 
                                        You can not reminder for past
                                    </span>
                                    : null
                                }
                                
                            </div>
                        </div>
                    </Card.Footer>
                    </Card>
                </Form>
            </Container>
        )
    }
}

const mapStateToProps = state => ({
    friends: state.users.friends
})

const mapDispatchToProps = dispatch => {
    return {
        authorize: () => dispatch(actionAuthorize()),
        setReminder: data => dispatch(actionSetReminder(data)),
        loadFriends: () => dispatch(actionLoadFriends())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SetReminder);