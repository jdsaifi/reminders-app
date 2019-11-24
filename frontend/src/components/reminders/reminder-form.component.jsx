import React from 'react';

class ReminderForm extends React.Component {

    render(){
        return (
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
                    <Button 
                        variant="outline-dark" 
                        onClick={this.saveReminder}
                        disabled
                    >Save Reminder</Button>
                </Card.Footer>
                </Card>
            </Form>
        )
    }
}