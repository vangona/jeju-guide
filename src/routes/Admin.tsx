import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeft,
  faHome,
  faSignOutAlt,
  faUser,
  faCog,
  faPlus,
  faEdit,
  faChartBar,
  faMapMarkerAlt,
  faImage,
  faLink,
  faCalendarAlt,
  faRobot,
  faSpinner,
  faCheckCircle,
  faExclamationTriangle,
  faKey,
  faEye,
  faEyeSlash,
  faLock,
  faSave,
} from '@fortawesome/free-solid-svg-icons';
import { authService, dbService } from '../fBase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import type { UserObj, PlaceInfo } from '../types';

interface AdminProps {
  userObj: UserObj | null;
}

const Admin = ({ userObj }: AdminProps) => {
  const router = useRouter();
  const [showProfile, setShowProfile] = useState(false);
  const [stats, setStats] = useState({
    totalPlaces: 0,
    recentPlaces: 0,
    placesThisMonth: 0,
  });
  const [recentPlaces, setRecentPlaces] = useState<PlaceInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [vectorLoading, setVectorLoading] = useState(false);
  const [vectorStatus, setVectorStatus] = useState<
    'idle' | 'processing' | 'success' | 'error'
  >('idle');
  const [vectorMessage, setVectorMessage] = useState('');
  const [adminApiKey, setAdminApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [showApiKeyPassword, setShowApiKeyPassword] = useState(false);

  // 인증되지 않은 사용자 리다이렉트
  useEffect(() => {
    if (!userObj) {
      router.push('/auth');
    }
  }, [userObj, router]);

  // 저장된 Admin API 키 로드
  useEffect(() => {
    const savedKey = localStorage.getItem('admin_openai_api_key');
    if (savedKey) {
      setAdminApiKey(savedKey);
    } else {
      setShowApiKeyInput(true);
    }
  }, []);

  // 통계 및 최근 장소 데이터 로드
  useEffect(() => {
    const loadAdminData = async () => {
      if (!userObj) return;

      try {
        setLoading(true);

        // 사용자가 등록한 모든 장소 조회
        const placesQuery = query(collection(dbService, 'places'));

        const querySnapshot = await getDocs(placesQuery);
        const allPlaces: PlaceInfo[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          allPlaces.push({
            id: doc.id,
            ...data,
          } as PlaceInfo);
        });

        // 실제 날짜 기반 통계 계산
        const now = new Date();
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // 장소 데이터에서 생성 시간을 추출하여 통계 계산
        const getCreatedAtDate = (place: PlaceInfo): Date | null => {
          const placeData = place as PlaceInfo & {
            createdAt?: number | { toDate?: () => Date };
          };

          if (placeData.createdAt) {
            if (
              typeof placeData.createdAt === 'object' &&
              placeData.createdAt.toDate
            ) {
              // Firestore Timestamp 객체
              return placeData.createdAt.toDate();
            } else if (typeof placeData.createdAt === 'number') {
              // Unix timestamp
              return new Date(placeData.createdAt);
            }
          }

          return null;
        };

        const placesThisMonth = allPlaces.filter((place) => {
          const createdAt = getCreatedAtDate(place);

          // createdAt이 없으면 이번 달로 간주 (새로 등록된 것으로 가정)
          if (!createdAt) {
            return true;
          }

          return createdAt >= thisMonthStart;
        }).length;

        const recentPlaces = allPlaces.filter((place) => {
          const createdAt = getCreatedAtDate(place);

          // createdAt이 없으면 최근으로 간주
          if (!createdAt) {
            return true;
          }

          return createdAt >= lastWeekStart;
        }).length;

        setStats({
          totalPlaces: allPlaces.length,
          recentPlaces,
          placesThisMonth,
        });

        // 최근 5개 장소
        setRecentPlaces(allPlaces.slice(0, 5));
      } catch (error) {
        // 오류 처리
        setStats({
          totalPlaces: 0,
          recentPlaces: 0,
          placesThisMonth: 0,
        });
        setRecentPlaces([]);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, [userObj]);

  const onLogOutClick = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      authService.signOut();
      router.push('/');
    }
  };

  const onHomeClick = () => {
    router.push('/');
  };

  const onBackClick = () => {
    router.back();
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const navigateToPost = () => {
    router.push('/post');
  };

  const navigateToEdit = () => {
    router.push('/edit');
  };

  const handleApiKeySubmit = () => {
    if (adminApiKey.trim()) {
      localStorage.setItem('admin_openai_api_key', adminApiKey);
      setShowApiKeyInput(false);
    }
  };

  const generateEmbeddings = async () => {
    // OpenAI API 키 확인
    if (!adminApiKey.trim()) {
      setShowApiKeyInput(true);
      setVectorStatus('error');
      setVectorMessage('OpenAI API 키를 먼저 설정해주세요.');
      setTimeout(() => {
        setVectorStatus('idle');
        setVectorMessage('');
      }, 3000);
      return;
    }

    setVectorLoading(true);
    setVectorStatus('processing');
    setVectorMessage('Firebase에서 장소 데이터를 가져오고 있습니다...');

    try {
      // 1. Firebase에서 모든 장소 데이터 가져오기
      const placesQuery = query(collection(dbService, 'places'));
      const querySnapshot = await getDocs(placesQuery);
      const places: PlaceInfo[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        places.push({
          id: doc.id,
          ...data,
        } as PlaceInfo);
      });

      if (places.length === 0) {
        setVectorStatus('error');
        setVectorMessage('처리할 장소 데이터가 없습니다.');
        return;
      }

      setVectorMessage(
        `${places.length}개 장소의 임베딩을 생성하고 있습니다...`,
      );

      // 2. API로 장소 데이터 전송하여 임베딩 생성
      const response = await fetch('/api/generate-embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          places: places,
          apiKey: adminApiKey,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setVectorStatus('success');
        setVectorMessage(
          `성공적으로 ${result.processedCount}개 장소의 임베딩을 생성했습니다.`,
        );
      } else {
        setVectorStatus('error');
        setVectorMessage(result.error || '임베딩 생성에 실패했습니다.');
      }
    } catch (error) {
      setVectorStatus('error');
      setVectorMessage('서버 오류가 발생했습니다.');
    } finally {
      setVectorLoading(false);
      // 5초 후 상태 초기화
      setTimeout(() => {
        setVectorStatus('idle');
        setVectorMessage('');
      }, 5000);
    }
  };

  if (!userObj) {
    return null;
  }

  return (
    <div className='admin__page'>
      <div className='admin__background'>
        <div className='admin__wave'></div>
        <div className='admin__wave'></div>
        <div className='admin__wave'></div>
      </div>

      <header className='admin__header'>
        <div className='admin__nav'>
          <button className='nav-btn nav-btn--back' onClick={onBackClick}>
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>뒤로</span>
          </button>

          <div className='admin__title-section'>
            <FontAwesomeIcon icon={faCog} className='title-icon' />
            <h1 className='admin__title'>관리자 대시보드</h1>
          </div>

          <div className='admin__user-section'>
            <button className='user-profile-btn' onClick={toggleProfile}>
              <FontAwesomeIcon icon={faUser} />
              <span className='user-name'>
                {userObj.displayName || '사용자'}
              </span>
            </button>

            {showProfile && (
              <div className='profile__dropdown'>
                <div className='profile__info'>
                  <div className='profile__avatar'>
                    {userObj.photoURL ? (
                      <img src={userObj.photoURL} alt='프로필' />
                    ) : (
                      <FontAwesomeIcon icon={faUser} />
                    )}
                  </div>
                  <div className='profile__details'>
                    <p className='profile__name'>
                      {userObj.displayName || '익명 사용자'}
                    </p>
                    <p className='profile__email'>{userObj.uid}</p>
                  </div>
                </div>

                <div className='profile__actions'>
                  <button className='profile__action' onClick={onHomeClick}>
                    <FontAwesomeIcon icon={faHome} />
                    <span>홈으로</span>
                  </button>
                  <button
                    className='profile__action profile__action--logout'
                    onClick={onLogOutClick}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    <span>로그아웃</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className='admin__content'>
        {/* Welcome Section */}
        <div className='admin__welcome'>
          <div className='welcome__content'>
            <h2>안녕하세요, {userObj.displayName || '사용자'}님!</h2>
            <p>제주 가이드 관리자 대시보드에 오신 것을 환영합니다.</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='admin__stats'>
          <div className='stats__card'>
            <div className='stats__icon'>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </div>
            <div className='stats__content'>
              <h3>{loading ? '...' : stats.totalPlaces}</h3>
              <p>총 등록 장소</p>
            </div>
          </div>

          <div className='stats__card'>
            <div className='stats__icon'>
              <FontAwesomeIcon icon={faCalendarAlt} />
            </div>
            <div className='stats__content'>
              <h3>{loading ? '...' : stats.placesThisMonth}</h3>
              <p>이번 달 등록</p>
            </div>
          </div>

          <div className='stats__card'>
            <div className='stats__icon'>
              <FontAwesomeIcon icon={faChartBar} />
            </div>
            <div className='stats__content'>
              <h3>{loading ? '...' : stats.recentPlaces}</h3>
              <p>최근 7일</p>
            </div>
          </div>
        </div>

        {/* API Key Setup */}
        <div className='admin__api-setup'>
          <h3 className='section__title'>
            <FontAwesomeIcon icon={faRobot} />
            Vector Search 설정
          </h3>

          <div className='api-key__container'>
            {showApiKeyInput ? (
              <div className='api-key__input-section'>
                <div className='api-key__header'>
                  <FontAwesomeIcon icon={faKey} className='api-key__icon' />
                  <h4 className='api-key__title'>OpenAI API 키 설정</h4>
                </div>

                <div className='api-key__input-wrapper'>
                  <div className='api-key__input-container'>
                    <FontAwesomeIcon
                      icon={faLock}
                      className='api-key__input-icon'
                    />
                    <input
                      type={showApiKeyPassword ? 'text' : 'password'}
                      value={adminApiKey}
                      onChange={(e) => setAdminApiKey(e.target.value)}
                      placeholder='sk-proj-xxxxx... (OpenAI API 키를 입력하세요)'
                      className='api-key__input'
                      onKeyPress={(e) =>
                        e.key === 'Enter' && handleApiKeySubmit()
                      }
                    />
                    <button
                      type='button'
                      onClick={() => setShowApiKeyPassword(!showApiKeyPassword)}
                      className='api-key__visibility-btn'
                      title={showApiKeyPassword ? '키 숨기기' : '키 보기'}
                    >
                      <FontAwesomeIcon
                        icon={showApiKeyPassword ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>

                  <div className='api-key__actions'>
                    <button
                      onClick={handleApiKeySubmit}
                      className='api-key__submit-btn'
                      disabled={!adminApiKey.trim()}
                    >
                      <FontAwesomeIcon icon={faSave} />
                      저장
                    </button>
                    <button
                      onClick={() => {
                        setShowApiKeyInput(false);
                        setAdminApiKey(
                          localStorage.getItem('admin_openai_api_key') || '',
                        );
                      }}
                      className='api-key__cancel-btn'
                    >
                      취소
                    </button>
                  </div>
                </div>

                <div className='api-key__help'>
                  <div className='api-key__help-item'>
                    <FontAwesomeIcon
                      icon={faExclamationTriangle}
                      className='help-icon'
                    />
                    <span>
                      Vector Search 기능을 사용하려면 OpenAI API 키가
                      필요합니다.
                    </span>
                  </div>
                  <div className='api-key__help-item'>
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      className='help-icon'
                    />
                    <span>
                      키는 브라우저에 안전하게 저장되며 서버로 전송되지
                      않습니다.
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className='api-key__status'>
                <div className='api-key__status-card'>
                  <div className='api-key__status-icon'>
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </div>
                  <div className='api-key__status-info'>
                    <h4>OpenAI API 키가 설정되었습니다</h4>
                    <p>Vector Search 기능을 사용할 수 있습니다</p>
                  </div>
                  <button
                    onClick={() => setShowApiKeyInput(true)}
                    className='api-key__change-btn'
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    변경
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className='admin__actions'>
          <h3 className='section__title'>
            <FontAwesomeIcon icon={faCog} />
            빠른 작업
          </h3>

          <div className='actions__grid'>
            <button
              className='action__card action__card--primary'
              onClick={navigateToPost}
            >
              <div className='action__icon'>
                <FontAwesomeIcon icon={faPlus} />
              </div>
              <div className='action__content'>
                <h4>새 장소 등록</h4>
                <p>새로운 장소를 등록하고 다른 여행자들과 공유해보세요</p>
              </div>
            </button>

            <button
              className='action__card action__card--secondary'
              onClick={navigateToEdit}
            >
              <div className='action__icon'>
                <FontAwesomeIcon icon={faEdit} />
              </div>
              <div className='action__content'>
                <h4>장소 관리</h4>
                <p>등록된 장소들을 수정하거나 삭제할 수 있습니다</p>
              </div>
            </button>

            <button
              className='action__card action__card--vector'
              onClick={generateEmbeddings}
              disabled={vectorLoading || !adminApiKey.trim()}
            >
              <div className='action__icon'>
                <FontAwesomeIcon
                  icon={vectorLoading ? faSpinner : faRobot}
                  spin={vectorLoading}
                />
              </div>
              <div className='action__content'>
                <h4>Vector Search 관리</h4>
                <p>AI 검색을 위한 임베딩을 생성합니다</p>
                {vectorMessage && (
                  <div
                    className={`vector-status vector-status--${vectorStatus}`}
                  >
                    <FontAwesomeIcon
                      icon={
                        vectorStatus === 'success'
                          ? faCheckCircle
                          : vectorStatus === 'error'
                            ? faExclamationTriangle
                            : faSpinner
                      }
                      spin={vectorStatus === 'processing'}
                    />
                    <span>{vectorMessage}</span>
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Recent Places */}
        {recentPlaces.length > 0 && (
          <div className='admin__recent'>
            <h3 className='section__title'>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
              최근 등록한 장소
            </h3>

            <div className='recent__list'>
              {recentPlaces.map((place) => (
                <div key={place.id} className='recent__item'>
                  <div className='recent__info'>
                    <h4 className='recent__name'>{place.name}</h4>
                    <span className='recent__type'>{place.type}</span>
                    <p className='recent__description'>
                      {place.description.length > 100
                        ? `${place.description.slice(0, 100)}...`
                        : place.description}
                    </p>
                  </div>

                  <div className='recent__meta'>
                    {place.attachmentUrlArray &&
                      place.attachmentUrlArray.length > 0 && (
                        <div className='recent__badge'>
                          <FontAwesomeIcon icon={faImage} />
                          <span>{place.attachmentUrlArray.length}</span>
                        </div>
                      )}

                    {place.url && (
                      <div className='recent__badge'>
                        <FontAwesomeIcon icon={faLink} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* 배경 클릭으로 프로필 드롭다운 닫기 */}
      {showProfile && (
        <div
          className='profile__backdrop'
          onClick={() => setShowProfile(false)}
        />
      )}
    </div>
  );
};

export default Admin;
