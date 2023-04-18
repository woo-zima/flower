// https://restapi.amap.com/v3/distance?parameters
// distance: '8093'; 距离 单位米
// duration: '1062'; 费时 单位秒
// origin_id: '1';

export const initAmap = async (start, end) => {
  const key = '50d1721190af728bee089d4e78c7958b';
  const init = async (start, end) => {
    //根据地址查询距离
    //const start = '重庆市渝北区金开大道';
    //const end = '重庆市渝北区园博园';
    const startLonLat = await getLonLat(start);
    const endLonLat = await getLonLat(end);
    const distance = await getDistance(startLonLat, endLonLat);
    if (distance) {
      return distance;
    }
  };
  //根据经纬度获取两地距离(驾车距离)
  const getDistance = async (origins, destination) => {
    const type = 1; //即驾车导航
    const url = `https://restapi.amap.com/v3/distance?origins=${origins}&destination=${destination}&type=${type}&key=${key}`;
    const res = await fetch(url).then(res => res.json());
    if (res.info === 'OK') {
      return res.results[0];
    }
  };
  //根据关键字转为地理经纬度
  const getLonLat = async address => {
    const queryUrl = `https://restapi.amap.com/v3/geocode/geo?address=${address}&output=JSON&key=${key}`;
    const res = await fetch(queryUrl).then(res => res.json());
    if (res.info === 'OK') {
      return res.geocodes[0].location;
    }
  };
  return await init(start, end);
};
