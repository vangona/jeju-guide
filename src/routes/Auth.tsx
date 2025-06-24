import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faLock, 
  faEye, 
  faEyeSlash,
  faSpinner,
  faHome,
  faUserPlus,
  faSignInAlt
} from '@fortawesome/free-solid-svg-icons';
import { authService } from '../fBase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

const Auth = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // 이미 로그인된 사용자는 Post 페이지로 리다이렉트
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authService, (user) => {
      if (user) {
        // 로그인된 상태면 Post 페이지로 이동
        router.replace('/admin');
      } else {
        // 로그인되지 않은 상태면 Auth 페이지 표시
        setCheckingAuth(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === 'email') {
      setEmail(value);
      setError(''); // Clear error when user types
    } else if (name === 'password') {
      setPassword(value);
      setError(''); // Clear error when user types
    }
  };

  const onSubmit: React.FormEventHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (newAccount) {
        await createUserWithEmailAndPassword(authService, email, password);
        // 계정 생성 성공 후 게시글 작성으로 이동
        router.replace('/admin');
      } else {
        await signInWithEmailAndPassword(authService, email, password);
        // 로그인 성공 후 게시글 작성으로 이동
        router.replace('/admin');
      }
    } catch (error) {
      if (error instanceof Error) {
        // Firebase 에러 메시지를 한국어로 변환
        let errorMessage = '';
        
        if (error.message.includes('user-not-found')) {
          errorMessage = '등록되지 않은 이메일입니다.';
        } else if (error.message.includes('wrong-password')) {
          errorMessage = '비밀번호가 틀렸습니다.';
        } else if (error.message.includes('email-already-in-use')) {
          errorMessage = '이미 사용 중인 이메일입니다.';
        } else if (error.message.includes('weak-password')) {
          errorMessage = '비밀번호는 최소 6자 이상이어야 합니다.';
        } else if (error.message.includes('invalid-email')) {
          errorMessage = '유효하지 않은 이메일 형식입니다.';
        } else if (error.message.includes('too-many-requests')) {
          errorMessage = '너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.';
        } else {
          errorMessage = '로그인에 실패했습니다. 다시 시도해주세요.';
        }
        
        setError(errorMessage);
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
    setError('');
    setEmail('');
    setPassword('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const goHome = () => {
    router.push('/');
  };

  // 인증 상태 확인 중일 때 로딩 화면 표시
  if (checkingAuth) {
    return (
      <div className='auth__page'>
        <div className='auth__background'>
          <div className='auth__wave'></div>
          <div className='auth__wave'></div>
          <div className='auth__wave'></div>
        </div>
        
        <div className='auth__container'>
          <div className='auth__card'>
            <div className='auth__header'>
              <h1 className='auth__title'>제주 가이드</h1>
              <p className='auth__subtitle'>로그인 상태를 확인하고 있습니다...</p>
            </div>
            <div className='auth__loading'>
              <FontAwesomeIcon icon={faSpinner} spin size="2x" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='auth__page'>
      <div className='auth__background'>
        <div className='auth__wave'></div>
        <div className='auth__wave'></div>
        <div className='auth__wave'></div>
      </div>
      
      <div className='auth__container'>
        <button className='auth__home-btn' onClick={goHome}>
          <FontAwesomeIcon icon={faHome} />
          <span>홈으로 돌아가기</span>
        </button>

        <div className='auth__card'>
          <div className='auth__header'>
            <h1 className='auth__title'>제주 가이드</h1>
            <p className='auth__subtitle'>
              {newAccount ? '새 계정을 만들어 시작하세요' : '계정에 로그인하세요'}
            </p>
          </div>

          <form className='auth__form' onSubmit={onSubmit}>
            <div className='auth__input-group'>
              <div className='auth__input-wrapper'>
                <FontAwesomeIcon icon={faUser} className='auth__input-icon' />
                <input
                  className='auth__input'
                  name='email'
                  type='email'
                  placeholder='이메일 주소'
                  required
                  value={email}
                  onChange={onChange}
                  autoComplete='email'
                />
              </div>

              <div className='auth__input-wrapper'>
                <FontAwesomeIcon icon={faLock} className='auth__input-icon' />
                <input
                  className='auth__input'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='비밀번호'
                  required
                  value={password}
                  onChange={onChange}
                  autoComplete={newAccount ? 'new-password' : 'current-password'}
                />
                <button
                  type='button'
                  className='auth__toggle-password'
                  onClick={togglePasswordVisibility}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            {error && (
              <div className='auth__error'>
                <span>{error}</span>
              </div>
            )}

            <button
              className='auth__submit-btn'
              type='submit'
              disabled={loading}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  <span>처리 중...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={newAccount ? faUserPlus : faSignInAlt} />
                  <span>{newAccount ? '계정 만들기' : '로그인'}</span>
                </>
              )}
            </button>

            <div className='auth__toggle'>
              <span>
                {newAccount ? '이미 계정이 있으신가요?' : '계정이 없으신가요?'}
              </span>
              <button
                type='button'
                className='auth__toggle-btn'
                onClick={toggleAccount}
              >
                {newAccount ? '로그인' : '회원가입'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;