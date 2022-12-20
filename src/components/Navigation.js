import React from "react";
import { Link } from "react-router-dom";

const Navigation = ({ setViewType, setChatSate }) => {
  const onClickNav = (e) => {
    if (e.target.innerHTML === "Map") {
      setViewType("지도");
      setChatSate(false);
    } else if (e.target.innerHTML === "List") {
      setViewType("목록");
      setChatSate(false);
    } else if (e.target.innerHTML === "Chat") {
      setChatSate(true);
    } else if (e.target.innerHTML === "Profile") {
      setViewType("프로필");
      setChatSate(false);
    }
  };

  return (
    <div className="nav__container">
      <div className="nav__component" onClick={onClickNav}>
        Map
      </div>
      <div className="nav__component" onClick={onClickNav}>
        List
      </div>
      <div className="nav__component" onClick={onClickNav}>
        Chat
      </div>
      <div className="nav__component" onClick={onClickNav}>
        Profile
      </div>
      <div className="nav__component">
        <Link to="/tips">Tips</Link>
      </div>
    </div>
  );
};

export default Navigation;
