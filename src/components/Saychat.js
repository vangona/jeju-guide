import { dbService } from "fBase";
import React, { useState } from "react";

const Saychat = ({lat, lon}) => {
    const [chat, setChat] = useState("")

    const onSubmit = async (event) => {
        if (lat) {
            event.preventDefault();
            const chatObj = {
                text: chat,
                createdAt: Date.now(),
                location: [lat, lon]
            }
            await dbService.collection('chats').add(chatObj)
            setChat("");
        } else {
            alert("먼저 위치를 표시해주세요.")
        }
    };

    const onChange = (event) => {
        const { target: {value} } = event;
        setChat(value);
    };

    return (
        <div className="saychat__container">
            <form className="saycht__form" onSubmit={onSubmit}>
                <textarea className="saychat__content" value={chat} onChange={onChange} type="text" placeholder="0 / 120" maxLength={120} required />
                <input className="saychat__btn" type="submit" value="게시하기" />
            </form>
        </div>
    )
}

export default Saychat;