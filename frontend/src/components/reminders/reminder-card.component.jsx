import React from 'react';
import moment from 'moment-timezone'; 

// Bootstrap
import Card from 'react-bootstrap/Card'

class ReminderCard extends React.Component {
    render(){
        const { time, date, remind_me, owner: { display_name, dp }, friend } = this.props;
        let remind_me_on = moment(`${date} ${time}`);

        let friendName = '';
        if(friend && friend.hasOwnProperty('display_name'))
            friendName = friend.display_name;

        return (
            <section className="row mt-3">
                <article className="col-md">
                    <Card className="mt-0 p-3 reminder-card-boxshadow">
                        <div className="row">
                            <article className="col-md-2 text-center reminder-list-user-box">
                                {/* https://avatars.dicebear.com/v2/avataaars/xxd.svg */}
                                <img src={dp} alt="Avatar"
                                style={{ width: "75px" }} />
                                <p className="lead">{display_name}</p>
                            </article>

                            <article className="col-md-10">
                                <p className="lead"  style={{ minHeight:"70px" }}>{remind_me}</p>

                                <div className="row">
                                    <div className="col-md">
                                        <strong className="text-muted">Will remind at </strong>
                                        { remind_me_on.format('LLLL') }
                                    </div>
                                    <div className="col-md">
                                        <strong className="text-muted">Reminder for: </strong>
                                        <i>{display_name}</i> <i>{friendName!== ''? `& ${friendName}`: ''}</i>
                                    </div>
                                </div>
                                
                            </article>
                        </div>
                    </Card>
                </article>
            </section>
        );
    }
}

export default ReminderCard;