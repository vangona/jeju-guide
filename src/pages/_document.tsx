import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang='ko'>
      <Head>
        <script
          type='text/javascript'
          src='//dapi.kakao.com/v2/maps/sdk.js?appkey=4d7b3b261e7eeebf426f97cbfd87ab4c&libraries=services,clusterer'
        />
        <meta
          name='naver-site-verification'
          content='c42ea354ad66c498bf3837251f2dedd7428321eb'
        />
        <meta charSet='utf-8' />
        <link rel='icon' href='/favicon.ico' />
        <meta name='theme-color' content='#000000' />
        <meta
          name='description'
          content='로컬과 장기여행자가 직접 겪은 제주도 맛집 & 볼거리 & 갈 곳 제주여행 제주갈만한곳 제주맛집 제주카페 제주도추천'
        />
        <meta property='og:title' content='제주 가이드 : 미슐탱 가이드' />
        <meta
          property='og:description'
          content='로컬과 장기여행자가 직접 겪은 제주도 맛집 & 볼거리 & 갈 곳 제주여행'
        />
        <meta
          property='og:image'
          content='https://cdn.jsdelivr.net/gh/vangona/jeju-guide@main/src/img/tourist.png'
        />
        <link rel='apple-touch-icon' href='/logo192.png' />
        <link rel='manifest' href='/manifest.json' />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
