import React from 'react';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const ProfileGlance = ({ createdAt, friends_count = 0, isOwner, isBlocked, handleBlock, self }) => (
    <section className="row br1">
        <div className="col-md-12 h3 font-weight-light mb-3 pb-2">
            Profile at a Glance

            {
                isOwner === false && isBlocked === false && self === false ?
                <button className="btn btn-sm pull-right btn-info" onClick={handleBlock}>Block this user</button>
                : null
            }
            {
                isOwner === false && isBlocked === true ?
                <button className="btn btn-sm pull-right btn-info" onClick={handleBlock}>Unblock this user</button>
                : null
            }
            

            <hr />
        </div>
        <div className="col-md lead">
            Member Since: 
            <strong> { `${monthNames[new Date(createdAt).getMonth()]} ${new Date(createdAt).getUTCFullYear()}` }</strong>
        </div>
        <div className="col-md lead">
            Friends: <strong>{new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(friends_count)}</strong>
        </div>
    </section>
);