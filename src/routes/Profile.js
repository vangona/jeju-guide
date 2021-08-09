import React, { useEffect } from "react";

const Profile = ({userObj}) => {
    useEffect(()=>{
        console.log(userObj)
    })
    return (
        <div className="profile__container">
            <div><h1>프로필 화면</h1></div>
            <div>{userObj.uid}</div>
        </div> 
    )
}

export default Profile;