import React from 'react';

// Bootstrap
import Card from 'react-bootstrap/Card'

import IsFriend from './is-friend.component';

// alt-src="https://avatars.dicebear.com/v2/avataaars/xxd.svg"
export const ProfileCard = ({ id, dp, display_name, email, isOwner, isFriend, isRequested, self, requests_in_count  }) => (
    <Card className="mx-auto mt-0 p-2">
        { 
            isOwner ? null 
            : <IsFriend userId={id} self={self} owner={isOwner} isFriend={isFriend} isRequested={isRequested} />
        }

        { 
            isOwner && requests_in_count > 0
            ? <div className="text-left mb-0">
                Requests: <a href="/requests">{requests_in_count} View</a>
            </div> 
            : null 
        }
        
        <Card.Body className="text-center">
            <img 
                alt="Profile" 
                src={dp}
                className="rounded-circle img-thumbnail w-75 mx-auto text-center"
                style={{ minHeight: "220px"}} />

            <p className="lead mb-0">{display_name}</p>
            <p className="text-muted">{email}</p>

            { isOwner ? <div className="text-right mb-0"><a href="/me/edit">Edit Profile</a></div> : null }
            
        </Card.Body>
    </Card>
)