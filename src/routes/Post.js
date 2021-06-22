import PostForm from "components/PostForm";
import { authService } from "fBase";
import React from "react";
import { useHistory } from "react-router-dom";

const Post = ({userObj}) => {
    const history = useHistory();
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/")
    }
    const onHomeClick = () => {
        history.push("/")
    }
    return (
        <div className="post__container">
            <PostForm userObj={userObj}/>
            <button onClick={onHomeClick}>Home</button>
            <button onClick={onLogOutClick}>Logout</button>
        </div>
    )
}

export default Post;