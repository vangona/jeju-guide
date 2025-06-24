import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHome, faUser } from '@fortawesome/free-solid-svg-icons';
import type { UserObj } from '../types';

interface PageProps {
  userObj: UserObj | null;
}

const Profile = ({ userObj }: PageProps) => {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const goHome = () => {
    router.push('/');
  };

  return (
    <div className='profile__page'>
      <header className='profile__header'>
        <div className='profile__nav'>
          <button className='nav-btn nav-btn--back' onClick={goBack}>
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>뒤로</span>
          </button>
          <h1 className='profile__title'>프로필</h1>
          <button className='nav-btn nav-btn--home' onClick={goHome}>
            <FontAwesomeIcon icon={faHome} />
            <span>홈</span>
          </button>
        </div>
      </header>

      <main className='profile__content'>
        <div className='profile__container'>
          {userObj ? (
            <div className='profile__info'>
              <div className='profile__avatar'>
                {userObj.photoURL ? (
                  <img src={userObj.photoURL} alt='프로필' />
                ) : (
                  <FontAwesomeIcon icon={faUser} />
                )}
              </div>
              <h2>{userObj.displayName || '익명 사용자'}</h2>
              <p>{userObj.uid}</p>
            </div>
          ) : (
            <div className='profile__empty'>
              <FontAwesomeIcon icon={faUser} />
              <p>로그인이 필요합니다.</p>
              <button onClick={() => router.push('/auth')}>
                로그인
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;