import React from 'react';

// Bootstrap
import Card from 'react-bootstrap/Card'

// alt-src="https://avatars.dicebear.com/v2/avataaars/xxd.svg"
export const ProfileCard = ({ dp, display_name, email, isOwner }) => (
    <Card style={{}} className="mx-auto mt-0 p-2">
        <Card.Body className="text-center">
            <img 
                alt="Profile" 
                src={dp}
                className="rounded-circle img-thumbnail w-75 mx-auto text-center"
                style={{ minHeight: "220px"}} />

            <p className="lead mb-0">{display_name}</p>
            <p className="text-muted">{email}</p>

            { isOwner ? <div className="text-right mb-0"><a href="/edit">Edit Profile</a></div> : null }
            
        </Card.Body>
    </Card>
)