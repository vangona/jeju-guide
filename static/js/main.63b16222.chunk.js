(this["webpackJsonpjeju-guide"]=this["webpackJsonpjeju-guide"]||[]).push([[0],{44:function(e,t,a){},58:function(e,t,a){"use strict";a.r(t);var n=a(2),c=a.n(n),s=a(34),r=a.n(s),i=(a(44),a(5)),l=a(16),o=a(7),j=a(11),u=a.n(j),d=a(18),b=a(23);a(46),a(60),a(59);b.a.initializeApp({apiKey:"AIzaSyDbt76_Zwf7Pnx-cBDVxe6oDWnv32v9xqo",authDomain:"jeju-guide.firebaseapp.com",projectId:"jeju-guide",storageBucket:"jeju-guide.appspot.com",messagingSenderId:"350907878366",appId:"1:350907878366:web:2f3fcda2d82f9ab4602b4f",measurementId:"G-2F62EPJ668"});b.a;var p=b.a.auth(),m=b.a.firestore(),h=b.a.storage(),O=a(20),x=a(21),v=a(1),f=function(){var e=Object(n.useState)(""),t=Object(i.a)(e,2),a=t[0],c=t[1],s=Object(n.useState)(""),r=Object(i.a)(s,2),l=r[0],o=r[1],j=Object(n.useState)(!0),b=Object(i.a)(j,2),m=b[0],h=b[1],f=Object(n.useState)(""),g=Object(i.a)(f,2),_=g[0],k=g[1],N=function(e){var t=e.target,a=t.name,n=t.value;"email"===a?c(n):"password"===a&&o(n)},y=function(){var e=Object(d.a)(u.a.mark((function e(t){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t.preventDefault(),e.prev=1,!m){e.next=8;break}return e.next=5,p.createUserWithEmailAndPassword(a,l);case 5:e.sent,e.next=11;break;case 8:return e.next=10,p.signInWithEmailAndPassword(a,l);case 10:e.sent;case 11:e.next=16;break;case 13:e.prev=13,e.t0=e.catch(1),"There is no user record corresponding to this identifier. The user may have been deleted."===e.t0.message?k("\uc785\ub825\ud558\uc2e0 \uc544\uc774\ub514\uac00 \uc5c6\uc2b5\ub2c8\ub2e4."):k(e.t0.message);case 16:case"end":return e.stop()}}),e,null,[[1,13]])})));return function(t){return e.apply(this,arguments)}}();return Object(v.jsx)(v.Fragment,{children:Object(v.jsx)("div",{className:"auth-form__container",children:Object(v.jsxs)("form",{className:"auth-form",onSubmit:y,children:[Object(v.jsx)("label",{className:"auth-form__title",children:"\ubbf8\uc290\ud0f1 \uac00\uc774\ub4dc"}),Object(v.jsx)("input",{className:"input auth__input",name:"email",type:"email",placeholder:"Email",required:!0,value:a,onChange:N}),Object(v.jsx)("input",{className:"input auth__input",name:"password",type:"password",placeholder:"Password",required:!0,value:l,onChange:N}),Object(v.jsx)("input",{className:"btn",type:"submit",value:m?"Create Account":"Log In"}),Object(v.jsx)("span",{className:"error",children:_}),Object(v.jsxs)("span",{className:"change-btn",onClick:function(){return h((function(e){return!e}))},children:[Object(v.jsx)(O.a,{icon:x.a,className:"change-btn__logo"}),m?"Log In":"Create Account"]})]})})})},g=(a(38),function(){var e=Object(o.g)(),t=e.state.place,a=e.state.from,c=Object(o.f)(),s=Object(n.useState)(0),r=Object(i.a)(s,2),l=r[0],j=r[1];return Object(v.jsx)("div",{className:"detail__container",children:Object(v.jsxs)("div",{className:"detail-box",children:[Object(v.jsx)("div",{className:"detail__name",children:t.name}),Object(v.jsxs)("div",{className:"detail-img__container",children:[Object(v.jsx)("img",{className:"detail__img",src:t.attachmentUrlArray[l],style:{maxWidth:"100%"},alt:"detail-img"}),Object(v.jsxs)("div",{className:"detail-img-btn__container",children:[0!==l&&Object(v.jsx)("button",{className:"detail__prev detail-btn",onClick:function(){l>0&&j((function(e){return e-1}))},children:"\u25c0"}),l!==t.attachmentUrlArray.length-1&1!==t.attachmentUrlArray.lenth?Object(v.jsx)("button",{className:"detail__next detail-btn",onClick:function(){l<4&&j((function(e){return e+1}))},children:"\u25b6"}):null]})]}),Object(v.jsx)("p",{className:"detail__description",children:t.description}),Object(v.jsx)("button",{onClick:function(){c.push({pathname:"/",state:{prevViewType:a}})},children:"Back"})]})})}),_=a(39),k=function(e){for(var t=e.postsPerPage,a=e.totalPosts,n=e.currentPage,c=e.paginate,s=[],r=Math.ceil(a/t),i=1;i<=r;i++)s.push(i);return Object(v.jsx)(v.Fragment,{children:Object(v.jsxs)("div",{className:"pagination__container",children:[1!==n&&Object(v.jsx)("span",{className:"pagination__arrow",onClick:function(){return c((function(e){return e-1}))},children:"\u25c0"}),s.map((function(e){return Object(v.jsx)("span",{className:"pagination__index",onClick:function(){return c(e)},children:e},e)})),n!==r&&Object(v.jsx)("span",{className:"pagination__arrow",onClick:function(){return c((function(e){return e+1}))},children:"\u25b6"})]})})},N=function(e){var t=e.places,a=e.localArray,c=e.isMobile,s=Object(n.useState)(""),r=Object(i.a)(s,2),o=r[0],j=r[1],u=Object(n.useState)("\uc804\uccb4"),d=Object(i.a)(u,2),b=d[0],p=d[1],m=Object(n.useState)(1),h=Object(i.a)(m,2),O=h[0],x=h[1],f=Object(n.useState)(5),g=Object(i.a)(f,2),_=g[0],N=g[1],y=O*_,w=y-_;return Object(v.jsxs)("div",{className:"list__container",children:[Object(v.jsx)("div",{className:"list__title",children:"\uc790\uc138\ud788 \uc54c\uace0\uc2f6\ub2e4\uba74 \uc7a5\uc18c\uba85\uc744 \ud074\ub9ad\ud574\uc8fc\uc138\uc694."}),Object(v.jsxs)("table",{className:"list__table",children:[Object(v.jsx)("thead",{children:Object(v.jsxs)("tr",{children:[Object(v.jsx)("th",{children:"\uc774\ub984"}),Object(v.jsx)("th",{children:"\uc8fc\uc18c"}),!c&&Object(v.jsx)("th",{children:"\uc124\uba85"})]})}),function(e){var t=0;return t=e.slice(w,y),t}(t).filter((function(e){return e.type===b|"\uc804\uccb4"===b})).map((function(e,t){return Object(v.jsx)("tbody",{children:e.name.includes(o)|e.addressDetail.includes(o)|e.description.includes(o)?Object(v.jsxs)("tr",{style:null===a?{backgroundColor:"white"}:a.some((function(t){return t.name===e.name}))?{backgroundColor:"wheat"}:{backgroundColor:"white"},children:[Object(v.jsx)("td",{className:"list__table-name list__table-content",children:Object(v.jsx)(l.b,{to:{pathname:"/detail",state:{from:"\ubaa9\ub85d",place:e}},children:e.name})}),Object(v.jsx)("td",{"list__table-content":!0,children:e.addressDetail}),!c&&Object(v.jsx)("td",{children:e.description})]}):null},t)}))]}),Object(v.jsx)(k,{postsPerPage:_,totalPosts:t.length,currentPage:O,paginate:x}),Object(v.jsxs)("div",{className:"list-search__container",children:[!c&&Object(v.jsxs)("select",{className:"list-saerch__pnum",onChange:function(e){var t=e.target.value;N(t)},defaultValue:"10",children:[Object(v.jsx)("option",{value:"5",children:"5\uac1c\uc529 \ubcf4\uae30"}),Object(v.jsx)("option",{value:"10",children:"10\uac1c\uc529 \ubcf4\uae30"}),Object(v.jsx)("option",{value:"15",children:"15\uac1c\uc529 \ubcf4\uae30"})]}),Object(v.jsxs)("select",{className:"place-type__list",name:"input__place-type",onChange:function(e){var t=e.target.value;p(t)},children:[Object(v.jsx)("option",{value:"\uc804\uccb4",children:"\uc804\uccb4"}),Object(v.jsx)("option",{value:"\ub9db\uc9d1",children:"\ub9db\uc9d1"}),Object(v.jsx)("option",{value:"\uce74\ud398 & \ubca0\uc774\ucee4\ub9ac",children:"\uce74\ud398 & \ubca0\uc774\ucee4\ub9ac"}),"\\",Object(v.jsx)("option",{value:"\ud48d\uacbd",children:"\ud48d\uacbd"}),Object(v.jsx)("option",{value:"\uc220\uc9d1",children:"\uc220\uc9d1"}),Object(v.jsx)("option",{value:"\uadf8 \uc678 \uac00\ubcfc\ub9cc\ud55c \uacf3",children:"\uadf8 \uc678 \uac00\ubcfc\ub9cc\ud55c \uacf3"})]}),Object(v.jsx)("input",{className:"list-search__input",type:"text",onChange:function(e){var t=e.target.value;j(t)},value:o,placeholder:"\uc7a5\uc18c\uba85, \uc8fc\uc18c, \uc124\uba85..."})]})]})},y=function(e){var t=e.places,a=e.isMobile,c=(Object(o.f)(),Object(n.useState)("\uc804\uccb4")),s=Object(i.a)(c,2),r=s[0],j=s[1],u=Object(n.useState)(null),d=Object(i.a)(u,2),b=d[0],p=d[1],m=Object(n.useState)(0),h=Object(i.a)(m,2),f=h[0],g=h[1],_=Object(n.useState)(!1),k=Object(i.a)(_,2),N=k[0],y=k[1],w=Object(n.useState)({}),S=Object(i.a)(w,2),C=S[0],A=S[1],M=Object(n.useRef)(null),L={},I=function(e){var t=document.createElement("div");t.className="place__infowindow",t.innerHTML="".concat(e.name);var n=new kakao.maps.LatLng(e.geocode[0],e.geocode[1]),c=new kakao.maps.CustomOverlay({content:t,position:n,yAnchor:2.5,clickable:!0}),s=new kakao.maps.Marker({map:L,position:n});a?(kakao.maps.event.addListener(s,"click",function(e,t,a){return function(){t.setMap(e),A(a),y(!0)}}(L,c,e)),kakao.maps.event.addListener(L,"click",function(e){return function(){e.setMap(null),y(!1)}}(c))):(kakao.maps.event.addListener(s,"click",function(e){return function(){p(e)}}(e)),kakao.maps.event.addListener(s,"mouseover",function(e,t){return function(){t.setMap(e),y(!0)}}(L,c)),kakao.maps.event.addListener(s,"mouseout",function(e){return function(){e.setMap(null),y(!1)}}(c)))};return Object(n.useEffect)((function(){!function(){var e=10;a&&(e=11);var t={center:new kakao.maps.LatLng(33.3517,126.5602),level:e};L=new window.kakao.maps.Map(M.current,t)}(),t.map((function(e){"\uc804\uccb4"!==r&&e.type!==r||I(e)}))}),[r]),Object(v.jsx)(v.Fragment,{children:Object(v.jsxs)("div",{className:"map__container",children:[Object(v.jsxs)("div",{className:"vertical",children:[Object(v.jsxs)("select",{className:"place-type__map",name:"input__place-type",onChange:function(e){var t=e.target.value;j(t)},children:[Object(v.jsx)("option",{value:"\uc804\uccb4",children:"\uc804\uccb4"}),Object(v.jsx)("option",{value:"\ub9db\uc9d1",children:"\ub9db\uc9d1"}),Object(v.jsx)("option",{value:"\uce74\ud398 & \ubca0\uc774\ucee4\ub9ac",children:"\uce74\ud398 & \ubca0\uc774\ucee4\ub9ac"}),"\\",Object(v.jsx)("option",{value:"\ud48d\uacbd",children:"\ud48d\uacbd"}),Object(v.jsx)("option",{value:"\uc220\uc9d1",children:"\uc220\uc9d1"}),Object(v.jsx)("option",{value:"\uadf8 \uc678 \uac00\ubcfc\ub9cc\ud55c \uacf3",children:"\uadf8 \uc678 \uac00\ubcfc\ub9cc\ud55c \uacf3"})]}),Object(v.jsx)("div",{children:Object(v.jsxs)("button",{className:"check-geolocation",onClick:function(){navigator.geolocation?navigator.geolocation.getCurrentPosition((function(e){var t=e.coords.latitude,a=e.coords.longitude;!function(e){var t=new kakao.maps.Size(25,25),a={offset:new kakao.maps.Point(27,69)},n=new kakao.maps.MarkerImage("https://cdn.jsdelivr.net/gh/vangona/jeju-guide@main/src/img/tourist.png",t,a);new kakao.maps.Marker({map:L,image:n,position:e})}(new kakao.maps.LatLng(t,a))})):alert("\uc704\uce58 \uc815\ubcf4\ub97c \uc774\uc6a9\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.")},children:[Object(v.jsx)(O.a,{icon:x.b})," \ud604\uc7ac \uc704\uce58 \ud45c\uc2dc\ud558\uae30"]})}),Object(v.jsx)("div",{className:"map",ref:M}),Object(v.jsx)("div",{className:"map-explain__container",children:N?a?Object(v.jsx)(l.b,{to:{pathname:"/detail",state:{from:"\uc9c0\ub3c4",place:C}},children:Object(v.jsxs)("div",{className:"marker__detail",children:[Object(v.jsxs)("h4",{children:[C.name," ",Object(v.jsx)(O.a,{icon:x.c,size:"sm"})]}),Object(v.jsx)("hr",{}),Object(v.jsxs)("p",{children:[C.description.slice(0,50),C.description.length>50&&"..."]})]})}):Object(v.jsx)("div",{className:"map-explain",children:"\ub354 \uc54c\uc544\ubcf4\uc2dc\ub824\uba74 \ub9c8\ucee4\ub97c \ud074\ub9ad\ud574\uc8fc\uc138\uc694."}):Object(v.jsx)("div",{className:"map-explain",children:"\uc9c0\ub3c4\ub97c \ud655\ub300\ud558\uc2e4 \uc218 \uc788\uc2b5\ub2c8\ub2e4. "})})]}),b&&Object(v.jsxs)("div",{className:"map__detail vertical",children:[Object(v.jsx)("h3",{children:b.name}),b.attachmentUrlArray[0]&&Object(v.jsxs)(v.Fragment,{children:[Object(v.jsx)("img",{src:b.attachmentUrlArray[f],alt:"detail-img",width:"100%",height:"auto"}),Object(v.jsxs)("div",{className:"map-detail__img-btn__container",children:[0!==f&&Object(v.jsx)("button",{className:"map-detail__img-btn prev",onClick:function(){f>0&&g((function(e){return e-1}))},children:"\u25c0"}),f!==b.attachmentUrlArray.length-1&1!==b.attachmentUrlArray.lenth&&Object(v.jsx)("button",{className:"map-detail__img-btn next",onClick:function(){f<4&&g((function(e){return e+1}))},children:"\u25b6"})]})]}),Object(v.jsx)("div",{children:b.description}),Object(v.jsx)(l.b,{to:{pathname:"/detail",state:{from:"\uc9c0\ub3c4",place:b}},children:"\ub354 \uc54c\uc544\ubcf4\uae30"}),""!==b.url&&Object(v.jsx)("a",{href:b.url,target:"_blank",rel:"noreferrer",children:"\uad00\ub828 \uc0ac\uc774\ud2b8"}),Object(v.jsx)("div",{className:"map__detail-clear",onClick:function(){p(null)},children:"\u274c"})]})]})})},w=function(e){var t=e.isMobile,a=Object(o.g)(),c=Object(n.useState)(!1),s=Object(i.a)(c,2),r=s[0],l=s[1],j=Object(n.useState)([]),b=Object(i.a)(j,2),p=b[0],h=b[1],f=Object(n.useState)("\uc9c0\ub3c4"),g=Object(i.a)(f,2),k=g[0],w=g[1],S=JSON.parse(localStorage.getItem("micheltain_myplace")),C=function(){var e=Object(d.a)(u.a.mark((function e(){return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,m.collection("places").onSnapshot((function(e){var t=e.docs.map((function(e){return Object(_.a)({id:e.id},e.data())}));h(t),l(!0)}));case 2:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(n.useEffect)((function(){C(),void 0!==a.state&&w(a.state.prevViewType)}),[]),Object(v.jsxs)("div",{className:"home__container",children:[Object(v.jsx)("h3",{className:"home__title",children:"MICHETAIN GUIDE"}),Object(v.jsxs)("button",{className:"home-viewtype",onClick:function(){"\ubaa9\ub85d"===k?w("\uc9c0\ub3c4"):"\uc9c0\ub3c4"===k&&w("\ubaa9\ub85d")},children:[Object(v.jsx)(O.a,{icon:x.a})," ","\uc9c0\ub3c4"===k?"\ub9ac\uc2a4\ud2b8\ub85c \ubcf4\uae30":"\uc9c0\ub3c4\ub85c \ubcf4\uae30"]}),!0===r&"\uc9c0\ub3c4"===k?Object(v.jsx)(y,{places:p,localArray:S,isMobile:t}):!0===r&"\ubaa9\ub85d"===k?Object(v.jsx)(N,{places:p,localArray:S,isMobile:t}):"Loading..."]})},S=a(36),C=a(37),A=a.n(C),M=a(62),L=function(e){var t=e.userObj,a=Object(n.useState)(""),c=Object(i.a)(a,2),s=c[0],r=c[1],l=Object(n.useState)(""),o=Object(i.a)(l,2),j=o[0],b=o[1],p=Object(n.useState)([]),O=Object(i.a)(p,2),x=O[0],f=O[1],g=Object(n.useState)("\uadf8\uc678 \uac00\ubcfc\ub9cc\ud55c \uacf3"),_=Object(i.a)(g,2),k=_[0],N=_[1],y=Object(n.useState)(""),w=Object(i.a)(y,2),C=w[0],L=w[1],I=Object(n.useState)([]),P=Object(i.a)(I,2),F=P[0],E=P[1],D=Object(n.useState)(""),U=Object(i.a)(D,2),q=U[0],B=U[1],T=Object(n.useState)(""),W=Object(i.a)(T,2),z=W[0],R=W[1],G=Object(n.useState)(""),H=Object(i.a)(G,2),J=H[0],V=H[1],K=Object(n.useState)(!1),X=Object(i.a)(K,2),Y=X[0],Z=X[1],Q=new kakao.maps.services.Geocoder,$=function(){var e=Object(d.a)(u.a.mark((function e(a){var n,c,i,l,o;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a.preventDefault(),n=[],F===[]){e.next=17;break}c=0;case 4:if(!(c<F.length)){e.next=17;break}return i=h.ref().child("".concat(t.uid,"/").concat(s,"/").concat(Object(M.a)())),e.next=8,i.putString(F[c],"data_url");case 8:return l=e.sent,e.t0=n,e.next=12,l.ref.getDownloadURL();case 12:e.t1=e.sent,e.t0.push.call(e.t0,e.t1);case 14:c++,e.next=4;break;case 17:return o={name:s,addressDetail:J,address:z,extraAddress:j,geocode:x,type:k,description:C,attachmentUrlArray:n,url:q,creatorId:t.uid},e.next=20,m.collection("places").add(o);case 20:r(""),R(""),V(""),b(""),f([]),N(""),L(""),E([]),B("");case 29:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),ee=function(){var e=Object(d.a)(u.a.mark((function e(t){var a,n,c;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(a=t.target.files,!((n=a).length<6)){e.next=13;break}return c={maxSizeMB:1,maxWidthOrHeight:1024},e.prev=4,e.delegateYield(u.a.mark((function e(){var t,a,s,r;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t=[],a=0;case 2:if(!(a<n.length)){e.next=12;break}return e.next=5,Object(S.a)(n[a],c);case 5:s=e.sent,(r=new FileReader).readAsDataURL(s),r.onloadend=function(e){var a=e.currentTarget.result;t.push(a)};case 9:a++,e.next=2;break;case 12:E(t);case 13:case"end":return e.stop()}}),e)}))(),"t0",6);case 6:e.next=11;break;case 8:e.prev=8,e.t1=e.catch(4),console.log(e.t1);case 11:e.next=14;break;case 13:alert("\uc0ac\uc9c4\uc740 5\uc7a5\uae4c\uc9c0\uc785\ub2c8\ub2e4.");case 14:case"end":return e.stop()}}),e,null,[[4,8]])})));return function(t){return e.apply(this,arguments)}}(),te=function(e,t){if(t===kakao.maps.services.Status.OK){var a=[e[0].y,e[0].x];f(a)}},ae=function(){var e=Object(d.a)(u.a.mark((function e(t){var a,n;return u.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=t.address,n="","R"===t.addressType&&(""!==t.bname&&(n+=t.bname),""!==t.buildingName&&(n+=""!==n?", ".concat(t.buildingName):t.buildingName),a+=""!==n?" (".concat(n,")"):""),R(t.zonecode),V(a),e.next=7,Q.addressSearch(J,te);case 7:Z(!1);case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return Object(v.jsxs)("form",{className:"post-form__container",onSubmit:$,children:[Object(v.jsxs)("div",{className:"post-form__content",children:[Object(v.jsx)("label",{htmlFor:"place-name",children:"\uc7a5\uc18c \uc774\ub984 : "}),Object(v.jsx)("input",{type:"text",name:"place-name",onChange:function(e){var t=e.target.value;r(t)},value:s,required:!0})]}),Object(v.jsxs)("div",{className:"post-form__content vertical",children:[Object(v.jsxs)("div",{className:"address-input",children:[Y&&Object(v.jsx)(A.a,{autoClose:!0,onComplete:ae}),Object(v.jsx)("button",{onClick:function(e){e.preventDefault(),Z(!Y)},children:"\uc8fc\uc18c \uc785\ub825(\uc9c0\ubc88)"})]}),Object(v.jsxs)("div",{className:"address-content__container",children:[Object(v.jsx)("label",{htmlFor:"place-address",children:"\uc8fc\uc18c : "}),Object(v.jsx)("input",{className:"place-address",type:"text",name:"place-address",value:J,readOnly:!0,required:!0}),Object(v.jsx)("input",{className:"place-address-number",type:"text",name:"place-address-number",value:z,readOnly:!0,required:!0})]}),Object(v.jsxs)("div",{className:"address-content__container",children:[Object(v.jsx)("label",{htmlFor:"place-address",children:"\ub098\uba38\uc9c0 \uc8fc\uc18c : "}),Object(v.jsx)("input",{type:"text",name:"place-extra-address",onChange:function(e){var t=e.target.value;b(t)},value:j})]}),Object(v.jsx)("input",{className:"place-geocode",type:"text",name:"place-geocode",readOnly:!0,value:x,required:!0})]}),Object(v.jsxs)("div",{className:"post-form__content vertical",children:[Object(v.jsx)("label",{htmlFor:"place-type",children:"\uc7a5\uc18c \uc885\ub958"}),Object(v.jsxs)("select",{name:"place-type",required:!0,onChange:function(e){var t=e.target.value;N(t)},children:[Object(v.jsx)("option",{value:"\ub9db\uc9d1",children:"\ub9db\uc9d1"}),Object(v.jsx)("option",{value:"\uce74\ud398 & \ubca0\uc774\ucee4\ub9ac",children:"\uce74\ud398 & \ubca0\uc774\ucee4\ub9ac"}),"\\",Object(v.jsx)("option",{value:"\ud48d\uacbd",children:"\ud48d\uacbd"}),Object(v.jsx)("option",{value:"\uc220\uc9d1",children:"\uc220\uc9d1"}),Object(v.jsx)("option",{value:"\uadf8 \uc678 \uac00\ubcfc\ub9cc\ud55c \uacf3",children:"\uadf8 \uc678 \uac00\ubcfc\ub9cc\ud55c \uacf3"})]})]}),Object(v.jsxs)("div",{className:"post-form__content vertical",children:[Object(v.jsx)("label",{htmlFor:"place-description",children:"\uc7a5\uc18c \uc124\uba85"}),Object(v.jsx)("textarea",{className:"place-description",name:"place-description",placeholder:"\uc124\uba85",onChange:function(e){var t=e.target.value;L(t)},value:C,required:!0})]}),Object(v.jsxs)("div",{className:"post-form__content vertical",children:[Object(v.jsx)("label",{htmlFor:"place-img",children:"\uc7a5\uc18c \uc0ac\uc9c4(\ud544\uc218 X)"}),Object(v.jsx)("input",{type:"file",accept:"image/*",name:"place-img",onChange:ee,multiple:!0})]}),Object(v.jsxs)("div",{className:"post-form__content vertical",children:[Object(v.jsx)("label",{htmlFor:"place-description",children:"\ucc38\uace0 \uc0ac\uc774\ud2b8 \uc8fc\uc18c(\uc788\ub2e4\uba74)"}),Object(v.jsx)("input",{type:"url",nmae:"place-url",placeholder:"\uc0ac\uc774\ud2b8 \uc8fc\uc18c",onChange:function(e){var t=e.target.value;B(t)},value:q})]}),Object(v.jsx)("input",{type:"submit",value:"\ub4f1\ub85d\ud558\uae30"})]})},I=function(e){var t=e.userObj,a=Object(o.f)();return Object(v.jsxs)("div",{className:"post__container",children:[Object(v.jsx)(L,{userObj:t}),Object(v.jsx)("button",{onClick:function(){a.push("/")},children:"Home"}),Object(v.jsx)("button",{onClick:function(){p.signOut(),a.push("/")},children:"Logout"})]})},P=function(e){var t=e.isLoggedIn,a=e.userObj,n=e.isMobile;return Object(v.jsx)(v.Fragment,{children:Object(v.jsx)(l.a,{children:Object(v.jsxs)(o.c,{children:[t?Object(v.jsx)(o.a,{exact:!0,path:"/auth",children:Object(v.jsx)(I,{userObj:a})}):Object(v.jsx)(o.a,{exact:!0,path:"/auth",children:Object(v.jsx)(f,{})}),Object(v.jsx)(o.a,{exact:!0,path:"/",children:Object(v.jsx)(w,{isMobile:n})}),Object(v.jsx)(o.a,{exact:!0,path:"/detail",children:Object(v.jsx)(g,{})})]})})})},F=function(){var e=Object(n.useState)(!1),t=Object(i.a)(e,2),a=t[0],c=t[1],s=Object(n.useState)(null),r=Object(i.a)(s,2),l=r[0],o=r[1],j=Object(n.useState)(!1),u=Object(i.a)(j,2),d=u[0],b=u[1],m=navigator.userAgent;return Object(n.useEffect)((function(){p.onAuthStateChanged((function(e){o(e?{uid:e.uid}:null),null!=m.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i)||null!=m.match(/LG|SAMSUNG|Samsung/)?b(!0):b(!1),c(!0)}))}),[]),Object(v.jsx)(v.Fragment,{children:a?Object(v.jsx)(P,{isLoggedIn:Boolean(l),userObj:l,isMobile:d}):"Loading..."})};r.a.render(Object(v.jsx)(c.a.StrictMode,{children:Object(v.jsx)(F,{})}),document.getElementById("root"))}},[[58,1,2]]]);
//# sourceMappingURL=main.63b16222.chunk.js.map