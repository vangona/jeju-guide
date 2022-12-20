import React, { useState } from 'react';
import { dbService } from '../fBase';

interface SaychatProps {
  latitude: number;
  longitude: number;
}

const Saychat = ({ latitude, longitude }: SaychatProps) => {
  const [chat, setChat] = useState('');

  const onSubmit: React.FormEventHandler = async (event) => {
    if (latitude) {
      event.preventDefault();
      const chatObj = {
        text: chat,
        createdAt: Date.now(),
        location: [latitude, longitude],
      };
      await dbService.collection('chats').add(chatObj);
      setChat('');
    } else {
      alert('먼저 위치를 표시해주세요.');
    }
  };

  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    const {
      target: { value },
    } = event;
    setChat(value);
  };

  return (
    <div className='saychat__container'>
      <form className='saycht__form' onSubmit={onSubmit}>
        <textarea
          className='saychat__content'
          value={chat}
          onChange={onChange}
          placeholder='0 / 120'
          maxLength={120}
          required
        />
        <input className='saychat__btn' type='submit' value='게시하기' />
      </form>
    </div>
  );
};

export default Saychat;
