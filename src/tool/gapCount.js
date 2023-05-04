// https://restapi.amap.com/v3/distance?parameters
// distance: '8093'; 距离 单位米
// duration: '1062'; 费时 单位秒
// origin_id: '1';

export const initAmap = (start, end) => {
  const key = '50d1721190af728bee089d4e78c7958b';
  const init = (start, end) => {
    //根据地址查询距离
    //const start = '重庆市渝北区金开大道';
    //const end = '重庆市渝北区园博园';
    // getLonLat(start).then(res => {
    //   console.log(res);
    // });
    // getLonLat(end);
    Promise.all([getLonLat(start), getLonLat(end)]).then(res => {
      const start = res[0].geocodes[0].location;
      const end = res[1].geocodes[0].location;
      getDistance(start, end).then(res => {
        console.log(res.results[0]);
        return res.results[0];
      });
    });
  };
  //根据经纬度获取两地距离(驾车距离)
  const getDistance = (origins, destination) => {
    const type = 1; //即驾车导航
    const url = `https://restapi.amap.com/v3/distance?origins=${origins}&destination=${destination}&type=${type}&key=${key}`;
    // const res = fetch(url).then(res => res.json());
    return new Promise(resolve => {
      fetch(url).then(res => {
        resolve(res.json());
      });
    });
    // if (res.info === 'OK') {
    //   return res.results[0];
    // }
  };
  //根据关键字转为地理经纬度
  const getLonLat = address => {
    const queryUrl = `https://restapi.amap.com/v3/geocode/geo?address=${address}&output=JSON&key=${key}`;
    return new Promise(resolve => {
      fetch(queryUrl).then(res => {
        resolve(res.json());
      });
    });
  };

  console.log(init(start, end));
};
