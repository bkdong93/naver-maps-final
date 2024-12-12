// const express = require("express");
// const axios = require("axios");
// const app = express();

app.get("/", (req, res) => res.send("Server is now running"));

app.get("/naver-places", async (req, res) => {
  const { query, display = 1, start = 1  } = req.query;

  // console.log("Query parameters:", { start, display, start });
  console.log("Query parameters:", { start, display });

  const url = "https://openapi.naver.com/v1/search/local.json";
  const headers = {
    "X-NCP-APIGW-API-KEY-ID": process.env.NAVER_LOCAL_CLIENT_ID,
    "X-NCP-APIGW-API-KEY": process.env.NAVER_LOCAL_CLIENT_SECRET,
  };

  console.log("Request URL:", url);
  console.log("Request headers:", headers);

  try {
    // const response = await axios.get(url, 
    //   params:          
    //     query,       // 검색어 
    //     display,     // 출력 결과 수 (기본 10, 최대 100)
    //     start        // 시작 위치 (기본 1)},
    //   , 
    //   headers: headers,
    // });

    const response = await axios.get(url, {
      params: { 
        query       // 검색어 
        , display : 1     // 출력 결과 수 (기본 10, 최대 100)
        // , start        // 시작 위치 (기본 1)
      },
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_LOCAL_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.NAVER_LOCAL_CLIENT_SECRET
      }
    });

    // 데이터가 있는지 확인
    if (response.data.items && response.data.items.length > 0) {
      const place = response.data.items[0];

      // 2. Naver Maps 검색 URL 생성
      const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(query)}`;
        // 더 정확한 Naver Maps URL 생성 방식
      //   const encodedQuery = encodeURIComponent(place.title);
      //   const encodedAddress = encodeURIComponent(place.address);
      // const naverMapUrl = `https://map.naver.com/v5/search/${encodedQuery}/place/${encodedAddress}`;

      // 응답 데이터 준비
      const placeInfo = {
        title: place.title.replace(/<[^>]*>/g, ''),
        // address: place.address,
        // roadAddress: place.roadAddress,
        // telephone: place.telephone,
        maplink: place.link,
        category: place.category,
        // longitude: place.mapx,
        // latitude: place.mapy,
        naverMapUrl: naverMapUrl
        // naverMapUrl: place.naverMapUrl
        
      };

      // 한 번만 응답 보내기
      return res.json(placeInfo);
    }
    console.log("Response status:", response.status);
    console.log("Response data: ", response.data);
    // console.log("Response data:", JSON.stringify(response.data, null, 2));

    // res.status(200).json(response.data);
  } catch (error) {
    console.error("Error:", error.message);
    if (error.response) {
      console.error("Error response:", error.response.data);
    }
    res.status(error.response ? error.response.status : 500).json({
      error: error.message,
      details: error.response ? error.response.data : null,
    });
  }
});

// For local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 0; // This will choose a random available port
  const server = app.listen(PORT, () =>
    console.log(`Server ready on port ${server.address().port}.`)
  );
}

module.exports = app;