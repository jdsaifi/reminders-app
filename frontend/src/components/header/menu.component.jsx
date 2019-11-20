import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router";

// Bootstrap
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

import { BASE_URL } from '../../utils/utils';

class HeaderMenu extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            search: ''
        }
    }

    async componentDidMount(){
        console.log("props", this.props);
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    searchHandler = async (e) => {
        console.log("search handler called");
        e.preventDefault();
        const { history } = this.props;
        history.push(`${BASE_URL}search/${this.state.search}`);
    }

    render(){
        const { isAuthorized } = this.props;
        const { search } = this.state;
        return (
            <Navbar bg="info" variant="dark" expand="lg">
                <Container>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href={`${BASE_URL}`} className="nav-link">HOME</Nav.Link>
                            <Nav.Link href={`${BASE_URL}me`} className="nav-link">PROFILE</Nav.Link>
                            <Nav.Link href={`${BASE_URL}set-reminder`} className="nav-link">SET REMINDER</Nav.Link>
                        </Nav>

                        {
                            isAuthorized === false ? '' 
                            : 
                            <Form inline>
                                <FormControl type="text" placeholder="Search" 
                                className="mr-sm-2" name="search" value={search} onChange={this.onChange} />
                                <Button type="submit" variant="outline-light" onClick={this.searchHandler}>Search</Button>
                            </Form>
                        }

                        <Nav>
                            { 
                                isAuthorized === false ? 
                                <Nav.Link href={`${BASE_URL}login`} className="nav-link">LOGIN</Nav.Link>
                                :<Nav.Link href={`${BASE_URL}logout`} className="nav-link">LOGOUT</Nav.Link>
                            }
                        </Nav>

                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }
}

const mapStateToProps = state => ({
    isAuthorized: state.auth.isAuthorized,
});

export default withRouter(connect(mapStateToProps)(HeaderMenu));