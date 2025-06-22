// TODO: DaumPost & 카카오맵 타입 찾아서 @ts-ignore 지우기

import imageCompression from 'browser-image-compression';
import React, { useEffect, useState } from 'react';
import DaumPostcode from 'react-daum-postcode';
import { v4 as uuidv4 } from 'uuid';
import { dbService, storageService } from '../fBase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { UserObj } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMapMarkerAlt, 
  faCamera, 
  faLink, 
  faSpinner,
  faCheckCircle,
  faTimes,
  faCloudUploadAlt,
  faImage
} from '@fortawesome/free-solid-svg-icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

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
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // @ts-expect-error kakao maps API is not typed  
  const geocoder = new kakao.maps.services.Geocoder();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!name.trim()) newErrors.name = '장소 이름을 입력해주세요';
    if (!addressDetail) newErrors.address = '주소를 선택해주세요';
    if (!description.trim()) newErrors.description = '장소 설명을 입력해주세요';
    if (description.length < 10) newErrors.description = '설명을 10자 이상 입력해주세요';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit: React.FormEventHandler = async (event) => {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setUploadProgress(0);
    
    try {
      const attachmentUrlArray = [];
      if (attachmentArray.length > 0) {
        for (let i = 0; i < attachmentArray.length; i++) {
          const attachmentRef = ref(storageService, `${userObj?.uid}/${name}/${uuidv4()}`);
          const response = await uploadString(attachmentRef, attachmentArray[i], 'data_url');
          const downloadURL = await getDownloadURL(response.ref);
          attachmentUrlArray.push(downloadURL);
          setUploadProgress(((i + 1) / attachmentArray.length) * 100);
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

      await addDoc(collection(dbService, 'places'), placeObj);
      
      // Success state
      setShowSuccess(true);
      setTimeout(() => {
        setName('');
        setAddress('');
        setAddressDetail('');
        setExtraAddress('');
        setGeocode([]);
        setType('카페 & 베이커리');
        setDescription('');
        setAttachmentArray([]);
        setUrl('');
        setShowSuccess(false);
        setUploadProgress(0);
      }, 2000);
      
    } catch (error) {
      // Error adding document
      alert('등록 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
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
      const resultArray: string[] = [];
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
      // Error handling
    }
  };

  const onUrlChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target as HTMLInputElement; // event.target에 대한 타입 추론이 안되엇 타입캐스팅
    setUrl(value);
  };

  const onChangeOpenPost = () => {
    setIsOpenPost(!isOpenPost);
  };

  // @ts-expect-error
  const makeGeocode = (result, status) => {
    // @ts-expect-error
    if (status === kakao.maps.services.Status.OK) {
      const geocodeArray = [result[0].y, result[0].x];
      // @ts-expect-error
      setGeocode(geocodeArray);
    }
  };

  // @ts-expect-error
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
    // attachmentArray updated
  }, [attachmentArray]);

  const removeImage = (index: number) => {
    setAttachmentArray(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form className='post-form__container' onSubmit={onSubmit}>
      {/* Success Message */}
      {showSuccess && (
        <div className='success-message'>
          <FontAwesomeIcon icon={faCheckCircle} />
          <span>장소가 성공적으로 등록되었습니다!</span>
        </div>
      )}

      {/* Place Name */}
      <div className='form-section'>
        <div className='section-header'>
          <FontAwesomeIcon icon={faMapMarkerAlt} />
          <h3>기본 정보</h3>
        </div>
        
        <div className='form-field'>
          <label htmlFor='place-name'>장소 이름 *</label>
          <input
            type='text'
            name='place-name'
            onChange={onNameChange}
            value={name}
            placeholder='장소 이름을 입력해주세요'
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className='error-text'>{errors.name}</span>}
        </div>

        <div className='form-field'>
          <label htmlFor='place-type'>카테고리 *</label>
          <select name='place-type' value={type} onChange={onTypeChange}>
            <option value='맛집'>맛집</option>
            <option value='카페 & 베이커리'>카페 & 베이커리</option>
            <option value='풍경'>풍경</option>
            <option value='술집'>술집</option>
            <option value='숙소'>숙소</option>
            <option value='그 외 가볼만한 곳'>그 외 가볼만한 곳</option>
          </select>
        </div>
      </div>

      {/* Address Section */}
      <div className='form-section'>
        <div className='section-header'>
          <FontAwesomeIcon icon={faMapMarkerAlt} />
          <h3>위치 정보</h3>
        </div>
        
        <div className='address-input'>
          {isOpenPost && (
            <div className='postcode-container'>
              <DaumPostcode autoClose onComplete={onCompletePost} />
            </div>
          )}
          <button type='button' onClick={onChangeOpenPost} className='address-search-btn'>
            <FontAwesomeIcon icon={faMapMarkerAlt} />
            주소 검색하기
          </button>
        </div>

        {addressDetail && (
          <div className='address-display'>
            <div className='form-field'>
              <label>선택된 주소</label>
              <input
                type='text'
                value={addressDetail}
                readOnly
                className='readonly-input'
              />
            </div>
            
            <div className='form-field'>
              <label htmlFor='place-extra-address'>상세 주소 (선택사항)</label>
              <input
                type='text'
                name='place-extra-address'
                onChange={onExtraAddressChange}
                value={extraAddress}
                placeholder='상세 주소를 입력해주세요 (예: 2층, 101호)'
              />
            </div>
          </div>
        )}
        
        {errors.address && <span className='error-text'>{errors.address}</span>}
        
        <input
          className='place-geocode'
          type='hidden'
          name='place-geocode'
          value={geocode}
        />
      </div>

      {/* Description */}
      <div className='form-section'>
        <div className='section-header'>
          <FontAwesomeIcon icon={faMapMarkerAlt} />
          <h3>상세 설명</h3>
        </div>
        
        <div className='form-field'>
          <label htmlFor='place-description'>장소 설명 *</label>
          <textarea
            className={`place-description ${errors.description ? 'error' : ''}`}
            name='place-description'
            placeholder='이 장소만의 특별한 점, 추천 이유, 방문 팁 등을 자세히 설명해주세요. (최소 10자 이상)'
            onChange={onDescriptionChange}
            value={description}
            rows={5}
          />
          <div className='char-count'>
            <span className={description.length < 10 ? 'insufficient' : ''}>
              {description.length}/10 (최소)
            </span>
          </div>
          {errors.description && <span className='error-text'>{errors.description}</span>}
        </div>
      </div>

      {/* Images */}
      <div className='form-section'>
        <div className='section-header'>
          <FontAwesomeIcon icon={faCamera} />
          <h3>사진 업로드</h3>
        </div>
        
        <div className='form-field'>
          <label htmlFor='place-img'>장소 사진 (최대 5장)</label>
          <div className='file-upload-area'>
            <input
              type='file'
              accept='image/*'
              name='place-img'
              onChange={onAttachmentChange}
              multiple
              id='place-img'
            />
            <label htmlFor='place-img' className='file-upload-label'>
              <FontAwesomeIcon icon={faCloudUploadAlt} />
              <span>클릭하여 사진 선택</span>
              <small>JPG, PNG 파일만 가능 (최대 5장)</small>
            </label>
          </div>

          {attachmentArray.length > 0 && (
            <div className='image-preview-section'>
              <h4>
                <FontAwesomeIcon icon={faImage} />
                미리보기 ({attachmentArray.length}/5)
              </h4>
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={15}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                  480: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                }}
                className='image-preview-swiper'
              >
                {attachmentArray.map((attachment, index) => (
                  <SwiperSlide key={index}>
                    <div className='image-preview-item'>
                      <img src={attachment} alt={`preview ${index + 1}`} />
                      <button
                        type='button'
                        className='remove-image-btn'
                        onClick={() => removeImage(index)}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}
        </div>
      </div>

      {/* Website URL */}
      <div className='form-section'>
        <div className='section-header'>
          <FontAwesomeIcon icon={faLink} />
          <h3>추가 정보</h3>
        </div>
        
        <div className='form-field'>
          <label htmlFor='place-url'>관련 웹사이트 (선택사항)</label>
          <input
            type='url'
            name='place-url'
            placeholder='https://example.com'
            onChange={onUrlChange}
            value={url}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className='submit-section'>
        {isSubmitting && attachmentArray.length > 0 && (
          <div className='upload-progress'>
            <div className='progress-bar'>
              <div 
                className='progress-fill' 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span>이미지 업로드 중... {Math.round(uploadProgress)}%</span>
          </div>
        )}
        
        <button 
          type='submit' 
          className='submit-btn'
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin />
              등록 중...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faCheckCircle} />
              장소 등록하기
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default PostForm;
