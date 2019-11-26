import React from 'react';
import { Link } from "react-router-dom";

// Bootstrap
import Card from 'react-bootstrap/Card';
import Dropdown from 'react-bootstrap/Dropdown';

import IsFriend from './is-friend.component';
import { BASE_URL } from '../../utils/utils';

// alt-src="https://avatars.dicebear.com/v2/avataaars/xxd.svg"
export const ProfileCard = ({ 
    id, dp, display_name, email, isOwner, isFriend, isRequested, self, requests_in_count, 
    can_friend_set_reminder, isBlocked, handleBlock
}) => (
    <Card className="mx-auto mt-0 p-2 w-50">
        

        { 
            isOwner && requests_in_count > 0
            ? <div className="text-left mb-0">
                Requests: <a href="/requests">{requests_in_count} View</a>
            </div> 
            : null 
        }

        <Dropdown>
            <Dropdown.Toggle variant="link" className="more-menu pull-right">
                <i className="fa fa-ellipsis-h"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {
                    self ?
                    <Dropdown.Item disabled>Self Profile</Dropdown.Item>
                    : null
                }
                { 
                    isOwner ? null 
                    : <IsFriend userId={id} self={self} owner={isOwner} isFriend={isFriend} isRequested={isRequested} />
                }

                {
                    isOwner === false && isBlocked === false && self === false ?
                    // <button className="btn btn-sm pull-right btn-info" onClick={handleBlock}>Block this user</button>
                    <Dropdown.Item onClick={handleBlock}>Block this User</Dropdown.Item>
                    : null
                }
                {
                    isOwner === false && isBlocked === true ?
                    // <button className="btn btn-sm pull-right btn-info" onClick={handleBlock}>Unblock this user</button>
                    <Dropdown.Item onClick={handleBlock}>Unblock this User</Dropdown.Item>
                    : null
                }

                {/* { isOwner === false ? <Dropdown.Item href={`${BASE_URL}me/edit`}>Block this User</Dropdown.Item> : null } */}
                { isOwner ? <Dropdown.Item href={`${BASE_URL}me/edit`}>Update Profile</Dropdown.Item> : null }
                { isOwner ? <Dropdown.Item href={`${BASE_URL}me/change-username`}>Change username</Dropdown.Item> : null }

            </Dropdown.Menu>
        </Dropdown>
        
        <Card.Body className="text-center">
            <img 
                alt="Profile" 
                src={dp}
                className="rounded-circle img-thumbnail mx-auto text-center"
                />

            <p className="lead mb-0">{display_name}</p>
            <p className="text-muted">{email}</p>

            {
                isOwner === false && isFriend === true && can_friend_set_reminder === true
                ? <Link 
                    to={{
                        pathname: `${BASE_URL}set-reminder`,
                        search: `?f=${id}`
                    }}
                    className="btn btn-info btn-block"
                >
                    <i className="fa fa-bell"></i> Send Reminder
                </Link>
                : null
            }
            
        </Card.Body>
    </Card>
)