import imageCompression from "browser-image-compression";
import { dbService, storageService } from "fBase";
import React, { useEffect, useState } from "react";
import DaumPostcode from "react-daum-postcode";
import { v4 as uuidv4} from "uuid";

/* global kakao */

const PostForm = ({userObj}) => {
    const [name, setName] = useState('');
    const [extraAddress, setExtraAddress] = useState(''); 
    const [geocode, setGeocode] = useState([]);
    const [type, setType] = useState('그외 가볼만한 곳');
    const [description, setDescription] = useState('');
    const [attachmentArray, setAttachmentArray] = useState([]);
    const [url, setUrl] = useState('');

    const [address, setAddress] = useState("");
    const [addressDetail, setAddressDetail] = useState("");
    const [isOpenPost, setIsOpenPost] = useState(false);

    const geocoder = new kakao.maps.services.Geocoder();

    const onSubmit = async (event) => {
        event.preventDefault();
        let attachmentUrlArray = [];
        if (attachmentArray !== []) {
            for (let i = 0; i < attachmentArray.length; i++) {
                const attachmentRef = storageService.ref().child(`${userObj.uid}/${name}/${uuidv4()}`)
                const response = await attachmentRef.putString(attachmentArray[i], "data_url")
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
            creatorId: userObj.uid
        }
        await dbService.collection("places").add(placeObj)
        setName('');
        setAddress('');
        setAddressDetail('');
        setExtraAddress('');
        setGeocode([]);
        setType('');
        setDescription('');
        setAttachmentArray([]);
        setUrl('');
    }

    const onNameChange = (event) => {
        const { target: {value} } = event;
        setName(value);
    }

    const onExtraAddressChange = (event) => {
        const { target: {value} } = event;
        setExtraAddress(value);
    }
    
    const onTypeChange = (event) => {
        const { target: {value} } = event;
        setType(value);
    }

    const onDescriptionChange = (event) => {
        const { target: {value} } = event;
        setDescription(value);
    }

    const onAttachmentChange = async (event) => {
        const {target: { files }} = event;
        const fileArray = files;
        if (fileArray.length < 6) {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1024,
            }
            try {
                let resultArray = [];
                for (let i = 0; i < fileArray.length; i++) {
                    const compressedFile = await imageCompression(fileArray[i], options)
                    const reader = new FileReader();
                    reader.readAsDataURL(compressedFile);
                    reader.onloadend = (finishedEvent) => {
                        const {currentTarget : {result}} = finishedEvent
                        resultArray.push(result)
                    }
                }
                setAttachmentArray(resultArray);
                // const theFile = files[0];
                // const compressedFile = await imageCompression(theFile, options)
                // const reader = new FileReader();
                // reader.readAsDataURL(compressedFile);
                // reader.onloadend = (finishedEvent) => {
                //     const {currentTarget: {result}} = finishedEvent
                //     setAttachment(result)
                // }
            } catch (error) {
                console.log(error)
            }
        } else {
            alert('사진은 5장까지입니다.')
        }
    }

    const onUrlChange = (event) => {
        const { target: {value} } = event;
        setUrl(value);
    }

    const onChangeOpenPost = (event) => {
        event.preventDefault();
        setIsOpenPost(!isOpenPost);
    };
    
    const makeGeocode = (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
            const geocodeArray = [result[0].y, result[0].x]
            setGeocode(geocodeArray)
        }
    }

    const onCompletePost = async (data) => {
        let fullAddr = data.address;
        let extraAddr = '';
    
        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddr += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddr += (extraAddr !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddr += (extraAddr !== '' ? ` (${extraAddr})` : '');
        }
    
        setAddress(data.zonecode);
        setAddressDetail(fullAddr);
    
        await geocoder.addressSearch(addressDetail, makeGeocode)

        setIsOpenPost(false);
    }

    return (
        <form className="post-form__container" onSubmit={onSubmit}>
            <div className="post-form__content">               
                <label htmlFor="place-name">장소 이름 : </label>
                <input type="text" name="place-name" onChange={onNameChange} value={name} required/>
            </div>
            <div className="post-form__content vertical">  
                <div className="address-input">
                    { isOpenPost && <DaumPostcode autoClose onComplete={onCompletePost} /> }
                    <button onClick={onChangeOpenPost}>주소 입력(지번)</button>
                </div>
                <div className="address-content__container">
                    <label htmlFor="place-address">주소 : </label>
                    <input className="place-address" type="text" name="place-address" value={addressDetail} readOnly required/>
                    <input className="place-address-number" type="text" name="place-address-number" value={address} readOnly required/>
                </div>         
                <div className="address-content__container">
                    <label htmlFor="place-address">나머지 주소 : </label>
                    <input type="text" name="place-extra-address" onChange={onExtraAddressChange} value={extraAddress}/>  
                </div>  
                <input className="place-geocode" type="text" name="place-geocode" readOnly value={geocode} required />
            </div>     
            <div className="post-form__content vertical">         
                <label htmlFor="place-type">장소 종류</label>
                <select name="place-type" required onChange={onTypeChange} >
                    <option value="맛집">맛집</option>
                    <option value="카페 & 베이커리">카페 & 베이커리</option>\
                    <option value="풍경">풍경</option>
                    <option value="술집">술집</option>
                    <option value="숙소">숙소</option>
                    <option value="그 외 가볼만한 곳">그 외 가볼만한 곳</option>
                </select>
            </div>
            <div className="post-form__content vertical">               
                <label htmlFor="place-description">장소 설명</label>
                <textarea className="place-description" name="place-description" placeholder="설명" onChange={onDescriptionChange} value={description} required/>
            </div>
            <div className="post-form__content vertical">               
                <label htmlFor="place-img">장소 사진(필수 X)</label>
                <input type="file" accept="image/*" name="place-img" onChange={onAttachmentChange} multiple/>
            </div>
            <div className="post-form__content vertical">               
                <label htmlFor="place-description">참고 사이트 주소(있다면)</label>
                <input type="url" nmae="place-url" placeholder="사이트 주소" onChange={onUrlChange}  value={url}/>
            </div>
            <input type="submit" value="등록하기" />
        </form>
    )
}

export default PostForm;