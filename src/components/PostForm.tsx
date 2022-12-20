// TODO: DaumPost & 카카오맵 타입 찾아서 @ts-ignore 지우기

import imageCompression from 'browser-image-compression';
import React, { useEffect, useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import { v4 as uuidv4 } from 'uuid';
import { dbService, storageService } from '../fBase';
import { UserObj } from '../types';

/* global kakao */

interface PostFormProps {
  userObj: UserObj | null;
}

const PostForm = ({ userObj }: PostFormProps) => {
  const [name, setName] = useState('');
  const [extraAddress, setExtraAddress] = useState('');
  const [geocode, setGeocode] = useState([]);
  const [type, setType] = useState('카페 & 베이커리');
  const [description, setDescription] = useState('');
  const [attachmentArray, setAttachmentArray] = useState<string[]>([]);
  const [url, setUrl] = useState('');

  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [isOpenPost, setIsOpenPost] = useState(false);

  // @ts-ignore
  const geocoder = new kakao.maps.services.Geocoder();

  const onSubmit: React.FormEventHandler = async (event) => {
    event.preventDefault();
    let attachmentUrlArray = [];
    if (attachmentArray.length > 0) {
      for (let i = 0; i < attachmentArray.length; i++) {
        const attachmentRef = storageService
          .ref()
          .child(`${userObj?.uid}/${name}/${uuidv4()}`);
        const response = await attachmentRef.putString(
          attachmentArray[i],
          'data_url',
        );
        attachmentUrlArray.push(await response.ref.getDownloadURL());
      }
    }

    const placeObj = {
      name,
      addressDetail,
      address,
      extraAddress,
      geocode,
      type,
      description,
      attachmentUrlArray,
      url,
      creatorId: userObj?.uid,
    };

    await dbService.collection('places').add(placeObj);
    setName('');
    setAddress('');
    setAddressDetail('');
    setExtraAddress('');
    setGeocode([]);
    setType('');
    setDescription('');
    setAttachmentArray([]);
    setUrl('');
  };

  const onNameChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target as HTMLInputElement; // event.target에 대한 타입 추론이 안되엇 타입캐스팅
    setName(value);
  };

  const onExtraAddressChange: React.ChangeEventHandler<HTMLInputElement> = (
    event,
  ) => {
    const { value } = event.target as HTMLInputElement; // event.target에 대한 타입 추론이 안되엇 타입캐스팅
    setExtraAddress(value);
  };

  const onTypeChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    const { value } = event.target as HTMLSelectElement; // event.target에 대한 타입 추론이 안되엇 타입캐스팅
    setType(value);
  };

  const onDescriptionChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
    event,
  ) => {
    const { value } = event.target as HTMLTextAreaElement; // event.target에 대한 타입 추론이 안되엇 타입캐스팅
    setDescription(value);
  };

  const onAttachmentChange: React.ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    const { files } = event.target as HTMLInputElement; // event.target에 대한 타입 추론이 안되엇 타입캐스팅
    const fileArray = files;

    if (!fileArray) return;
    if (fileArray.length >= 6) {
      alert('사진은 5장까지입니다.');
      return;
    }

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
    };

    try {
      let resultArray: string[] | null = [];
      for (let i = 0; i < fileArray.length; i++) {
        const compressedFile = await imageCompression(fileArray[i], options);
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onloadend = (finishedEvent) => {
          const target = finishedEvent.currentTarget as FileReader; // event.target에 대한 타입 추론이 안되엇 타입캐스팅
          const result = target.result as string; // TODO: 나중에 코드 뜯어서 수정하기.
          result && resultArray?.push(result);
        };
      }
      setAttachmentArray(resultArray);
    } catch (error) {
      console.log(error);
    }
  };

  const onUrlChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target as HTMLInputElement; // event.target에 대한 타입 추론이 안되엇 타입캐스팅
    setUrl(value);
  };

  const onChangeOpenPost = () => {
    setIsOpenPost(!isOpenPost);
  };

  // @ts-ignore
  const makeGeocode = (result, status) => {
    // @ts-ignore
    if (status === kakao.maps.services.Status.OK) {
      const geocodeArray = [result[0].y, result[0].x];
      // @ts-ignore
      setGeocode(geocodeArray);
    }
  };

  // @ts-ignore
  const onCompletePost = async (data) => {
    let fullAddr = data.address;
    let extraAddr = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddr += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddr +=
          extraAddr !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddr += extraAddr !== '' ? ` (${extraAddr})` : '';
    }

    await geocoder.addressSearch(fullAddr, makeGeocode);

    setAddress(data.zonecode);
    setAddressDetail(fullAddr);

    setIsOpenPost(false);
  };

  useEffect(() => {
    console.log(attachmentArray);
  }, [attachmentArray]);

  return (
    <form className='post-form__container' onSubmit={onSubmit}>
      <div className='post-form__content'>
        <label htmlFor='place-name'>장소 이름 : </label>
        <input
          type='text'
          name='place-name'
          onChange={onNameChange}
          value={name}
          required
        />
      </div>
      <div className='post-form__content vertical'>
        <div className='address-input'>
          {isOpenPost && <DaumPostcode autoClose onComplete={onCompletePost} />}
          <button onClick={onChangeOpenPost}>주소 입력 하기</button>
        </div>
        <div className='address-content__container'>
          <label htmlFor='place-address'>주소 : </label>
          <input
            className='place-address'
            type='text'
            name='place-address'
            value={addressDetail}
            readOnly
            required
          />
          <input
            className='place-address-number'
            type='text'
            name='place-address-number'
            value={address}
            readOnly
            required
          />
        </div>
        <div className='address-content__container'>
          <label htmlFor='place-address'>나머지 주소 : </label>
          <input
            type='text'
            name='place-extra-address'
            onChange={onExtraAddressChange}
            value={extraAddress}
          />
        </div>
        <input
          className='place-geocode'
          type='text'
          name='place-geocode'
          readOnly
          value={geocode}
          required
        />
      </div>
      <div className='post-form__content vertical'>
        <label htmlFor='place-type'>장소 종류</label>
        <select name='place-type' value={type} required onChange={onTypeChange}>
          <option value='맛집'>맛집</option>
          <option value='카페 & 베이커리'>카페 & 베이커리</option>\
          <option value='풍경'>풍경</option>
          <option value='술집'>술집</option>
          <option value='숙소'>숙소</option>
          <option value='그 외 가볼만한 곳'>그 외 가볼만한 곳</option>
        </select>
      </div>
      <div className='post-form__content vertical'>
        <label htmlFor='place-description'>장소 설명</label>
        <textarea
          className='place-description'
          name='place-description'
          placeholder='설명'
          onChange={onDescriptionChange}
          value={description}
          required
        />
      </div>
      <div className='post-form__content vertical'>
        <label htmlFor='place-img'>
          장소 사진(필수 X, 최대 5장, 올린 순서대로 보여집니다.)
        </label>
        <input
          type='file'
          accept='image/*'
          name='place-img'
          onChange={onAttachmentChange}
          multiple
        />
        <div>
          {attachmentArray.map((attachment) => {
            return <img src={`${attachment}`} alt='preview' width='20%' />;
          })}
        </div>
      </div>
      <div className='post-form__content vertical'>
        <label htmlFor='place-description'>참고 사이트 주소(있다면)</label>
        <input
          type='url'
          name='place-url'
          placeholder='사이트 주소'
          onChange={onUrlChange}
          value={url}
        />
      </div>
      <input type='submit' value='등록하기' />
    </form>
  );
};

export default PostForm;
