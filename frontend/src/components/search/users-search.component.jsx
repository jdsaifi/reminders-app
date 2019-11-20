import React from 'react';
import { connect } from 'react-redux';
import Pagination from "react-js-pagination";
import _ from 'lodash';

import { isAccessToken, BASE_URL } from '../../utils/utils';
import { actionAuthorize } from '../../redux/actions/auth.action';
import { actionMe, actionSearchUser } from '../../redux/actions/users.action';
import { UserSearchCard } from '../search/user-search-card.component';



class UserSearch extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            search_users_meta: {
                current_page: 1,
                has_next: null,
                items_count: 0,
                pages_count: 0,
                query: ''
            },
            apiMsg: ''
        }
    }

    async componentDidUpdate(prevProps, prevState) {
        const { history, authorize, match: thisMatch , searchUser } = this.props;
        const { match: prevMatch } = prevProps;
        const { current_page } = this.state;        

        // Is access_token exists
        if(!isAccessToken() || !await authorize()){
            history.push(`${BASE_URL}login`);
        }        
        
        if (prevMatch.params.q !== thisMatch.params.q) {
            const res = await searchUser(thisMatch.params.q || '', current_page);
            if(res.status === true){
                this.setState({
                    search_users_meta: res.meta,
                    apiMsg: ''
                });
            }
            if(res.api_status === 404){
                this.setState({
                    apiMsg: res.msg
                });
            }
        }
      }

    async componentDidMount(){
        const { history, authorize, match: { params }, loadSelf, searchUser } = this.props;
        const { current_page } = this.state;
        console.log("users search params: ", params)
        
        // Is access_token exists
        if(!isAccessToken() || !await authorize()){
            history.push(`${BASE_URL}login`);
        }

        // load self profile
        await loadSelf();
        
        const res = await searchUser(params.q || '', current_page);

        if(res.status === true){
            this.setState({
                search_users_meta: res.meta,
                apiMsg: ''
            });
        }
        if(res.api_status === 404){
            this.setState({
                apiMsg: res.msg
            });
        }
    }

    changeUserSearchPage = async page => { 
        const { searchUser } = this.props;       
        const { search_users_meta: { query } } = this.state;       
        // load reminders
        const res = await searchUser(query, page);

        if(res.status === true){
            this.setState({
                search_users_meta: res.meta,
                apiMsg: ''
            });
        }
        if(res.api_status === 404){
            this.setState({
                apiMsg: res.msg
            });
        }
    }

    render() {
        const { users } = this.props;
        const { apiMsg, search_users_meta: { current_page, items_count, pages_count }, search_users_meta } = this.state;

        if(apiMsg !== '') return (<h3 className="text-center lead mt-4">{apiMsg}</h3>);
        
        if(_.isEmpty(users)) return (<p className="mt-4 text-center"><i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
        <span className="sr-only">Loading...</span></p>);

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12 lead mt-4 mb-4">
                        Searching for: <strong>{search_users_meta.query}</strong>
                        <hr />
                    </div>
                </div>

                <div className="row">
                    {users.map(user => {
                        return <UserSearchCard key={user._id} {...user} />
                    })}
                </div>

                <div className="row">
                    {
                        pages_count > 1 
                        ? <Pagination
                            activePage={current_page}
                            itemsCountPerPage={10}
                            totalItemsCount={items_count}
                            pageRangeDisplayed={7}
                            onChange={this.changeUserSearchPage}
                            itemClass="page-item"
                            innerClass="pagination mt-5 mb-5"
                            linkClass="page-link"
                        /> : null
                    }
                    
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    users: state.users.users,
    user: state.auth.user,
})

const mapDispatchToProps = dispatch => {
    return {
        authorize: () => dispatch(actionAuthorize()),
        searchUser: (q, page) => dispatch(actionSearchUser(q, page)),
        loadSelf: () => dispatch(actionMe())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserSearch)