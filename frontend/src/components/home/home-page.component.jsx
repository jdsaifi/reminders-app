import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import Pagination from "react-js-pagination";

import { isAccessToken, BASE_URL } from '../../utils/utils';
import { actionAuthorize } from '../../redux/actions/auth.action';
import { actionReminders } from '../../redux/actions/reminders.action';

// Components
import ReminderCard from '../reminders/reminder-card.component';

class HomePage extends React.Component {
    constructor(props){
        super(props);
       
        this.state = {
            reminders_meta: {
                current_page: 1,
                has_next: null,
                items_count: 0,
                pages_count: 0
            },
            apiMsg: ''
        }
    }

    async componentDidMount(){
        const { history, authorize, loadReminders } = this.props;
        
        // Is access_token exists
        if(!isAccessToken() || !await authorize()){
            console.log("push url: ", `${BASE_URL}login`);
            history.push(`${BASE_URL}login`);
        }

        // load reminders
        const res = await loadReminders(this.state.reminders_meta.current_page);
        if(res.status === true){
            this.setState({
                reminders_meta: res.meta
            });
        }
        if(res.api_status === 404){
            this.setState({
                apiMsg: res.msg
            });
        }
    }

    changeReminderPage = async page => { 
        const { loadReminders } = this.props;       
        // load reminders
        const res = await loadReminders(page);

        if(res.status === true){
            this.setState({
                reminders_meta: res.meta
            });
        }
        if(res.api_status === 404){
            this.setState({
                apiMsg: res.msg
            });
        }
    }

    render(){
        const { reminders } = this.props;
        const { apiMsg, reminders_meta: { current_page, items_count } } = this.state;
        
        if(apiMsg !== '') return (<h3 className="text-center lead mt-4">{apiMsg}</h3>);

        if(_.isEmpty(reminders)) return (<p className="mt-4 text-center"><i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
        <span className="sr-only">Loading...</span></p>);
        
        return (
            <section className="container">
                {
                    reminders.map( reminder => {
                        return <ReminderCard 
                        key={reminder._id} 
                        display_name={reminder.owner.display_name}
                        dp={reminder.owner.dp}
                        remind_me={reminder.remind_me} 
                        remind_on={reminder.remind_on} 
                        />
                    })
                }
                <Pagination
                    activePage={current_page}
                    itemsCountPerPage={10}
                    totalItemsCount={items_count}
                    pageRangeDisplayed={7}
                    onChange={this.changeReminderPage}
                    itemClass="page-item"
                    innerClass="pagination mt-5 mb-5"
                    linkClass="page-link"
                />
            </section>
        )
    }
}

const mapStateToProps = state => ({
    reminders: state.reminders.list
});

const mapDispatchToProps = dispatch => {
    return {
        authorize: () => dispatch(actionAuthorize()),
        loadReminders: page => dispatch(actionReminders(page)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);