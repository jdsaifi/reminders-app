import React from 'react';
import { Link } from 'react-router-dom';

// Bootstrap
import Card from 'react-bootstrap/Card'

import { BASE_URL } from '../../utils/utils';


                    

// alt-src="https://avatars.dicebear.com/v2/avataaars/xxd.svg"
export const UserSearchCard = ({ dp, display_name, email, username, isOwner }) => (
    <section className="col-sm-12 col-md-4 col-lg-3">
        <Card style={{}} className="mx-auto mb-4 p-1">
            <Card.Body className="text-center">
                <img 
                    alt="Profile" 
                    src={dp}
                    className="rounded-circle img-thumbnail w-75 mx-auto text-center h-75" />

                <p className="lead mb-0">{display_name}</p>
                <p className="text-muted">{email}</p>

                <Link to={`${BASE_URL}users/${username}`}>View Profile</Link>
            </Card.Body>
        </Card>
    </section>
)