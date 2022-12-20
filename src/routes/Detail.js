import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddMyPlace from "components/AddMyPlace";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import ScriptTag from "react-script-tag";
import ReactGA from "react-ga";
import { dbService } from "fBase";

const Detail = ({ match }) => {
  const location = useLocation();
  let from = "지도";
  if (location.state !== undefined) {
    from = location.state.from;
  }
  const history = useHistory();
  const [detailPlace, setDetailPlace] = useState({});
  const [imgPage, setImgPage] = useState(0);
  const [detailLoading, setDetailLoading] = useState(false);

  const clickBackBtn = () => {
    history.push({
      pathname: "/",
      state: {
        prevViewType: from,
      },
    });
  };

  const clickNextImg = () => {
    if (imgPage < 4) {
      setImgPage((prev) => prev + 1);
    }
  };

  const clickPrevImg = () => {
    if (imgPage > 0) {
      setImgPage((prev) => prev - 1);
    }
  };

  const getGA = () => {
    console.log("세부 페이지 진입");
    const pathName = window.location.pathname;
    ReactGA.initialize("UA-199674845-1");
    ReactGA.set({ page: pathName });
    ReactGA.pageview(pathName);
  };

  const getPlaceName = async () => {
    const name = match.params.place;
    await dbService
      .collection("places")
      .where("name", "==", name)
      .onSnapshot((snapshot) => {
        const placeName = snapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        setDetailPlace(placeName);
        setDetailLoading(true);
      });
  };

  useEffect(() => {
    getPlaceName();
    getGA();
  }, []);
  return (
    <>
      {detailLoading ? (
        <div className="detail__container">
          <div className="detail-box">
            <div className="detail__name">{detailPlace[0].name}</div>
            {detailPlace[0].attachmentUrlArray[0] ? (
              <div className="detail-img__container">
                <img
                  className="detail__img"
                  src={detailPlace[0].attachmentUrlArray[imgPage]}
                  style={{ maxWidth: "100%" }}
                  alt="detail-img"
                />
                <div className="detail-img-btn__container">
                  {imgPage !== 0 && (
                    <button
                      className="detail__prev detail-btn"
                      onClick={clickPrevImg}
                    >
                      <FontAwesomeIcon icon={faAngleLeft} />
                    </button>
                  )}
                  {(imgPage !== detailPlace[0].attachmentUrlArray.length - 1) &
                  (detailPlace[0].attachmentUrlArray.lenth !== 1) ? (
                    <button
                      className="detail__next detail-btn"
                      onClick={clickNextImg}
                    >
                      <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}
            <p className="detail__description">{detailPlace[0].description}</p>
            {/* <AddMyPlace place={place}/> */}
            <ins
              className="kakao_ad_area"
              style={{ display: "none" }}
              data-ad-unit="DAN-c9rNVYJ0iiSwi4Sm"
              data-ad-width="320"
              data-ad-height="50"
            ></ins>
            <button style={{ marginTop: "1rem" }} onClick={clickBackBtn}>
              돌아가기
            </button>
          </div>
          <span className="copyright">
            &copy; 2021, 나만의 서랍장 Co. all rights reserved.
          </span>
          <ScriptTag
            type="text/javascript"
            src="//t1.daumcdn.net/kas/static/ba.min.js"
            async
          ></ScriptTag>
        </div>
      ) : (
        "Loading..."
      )}
    </>
  );
};

export default Detail;
