<template>
  <div class="app-container">
    <el-button @click="lookEnd">查看目的地详情</el-button>
    <div style="background-color: #ffffff">
      <div id="container"></div>
      <div id="panel"></div>
    </div>
  </div>
</template>

<script setup>
import AMapLoader from '@amap/amap-jsapi-loader';
import { ref, shallowRef, onMounted, reactive, toRefs, watch } from 'vue';
const props = defineProps({
  adressMsg: {
    type: String,
  },
});
const { adressMsg } = toRefs(props);
const map = shallowRef(null); //地图面板
const oMap = reactive({
  mymap: {},
  startLngLat: [],
  endLngLat: [],
});
const current_position = ref([]);

onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: 'c23da6fd8c694cd3a95f9eb8d0f01cb7',
  };
  navigator.geolocation.getCurrentPosition(position => {
    current_position.value[0] = position.coords.latitude;
    current_position.value[1] = position.coords.longitude;
    // 在这里调用获取当前定位关键字的函数
    console.log(position);
  });

  initMap();
});

const goView = () => {
  //构造路线导航类
  const Driving = new oMap.mymap.Driving({
    map: map.value, //地图
    hideMarkers: false, //自定义起点终点图标，默认false
    policy: oMap.mymap.DrivingPolicy.LEAST_TIME,
    panel: 'panel',
  });
  const points = [
    { keyword: '重庆理工大学两江校区', city: '全国' },
    { keyword: adressMsg.value, city: '全国' },
  ];
  // 根据起终点名称规划驾车导航路线
  Driving.search(points, (status, result) => {
    if (status === 'complete') {
      console.log('绘制驾车路线完成');
    } else {
      console.log('获取驾车数据失败：' + result);
    }
  });
};
const initMap = () => {
  AMapLoader.load({
    key: 'fbe5c0bff727387368ff0566c40a084d', // 申请好的Web端开发者Key，首次调用 load 时必填
    version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ['AMap.ToolBar', 'AMap.Driving', 'AMap.Geolocation', 'AMap.Geocoder'], // 需要使用的的插件列表
  })
    .then(AMap => {
      oMap.mymap = AMap;
      map.value = new AMap.Map('container', {
        enableHighAccuracy: true, //是否使用高精度定位，默认:true
        resizeEnable: true,
        viewMode: '3D', //是否为3D地图模式
        zoom: 16, //初始化地图级别
        //center: [29.559858, 106.555525], //初始化地图中心点位置
      });
      goView();
    })
    .catch(e => {
      console.log(e);
    });
};

//地图定位
const getGeolocation = AMap => {
  let geolocation = new AMap.Geolocation({
    // 是否使用高精度定位，默认：true
    enableHighAccuracy: true,
    // 设置定位超时时间，默认：无穷大
    timeout: 10000,
  });
  geolocation.getCurrentPosition();
  AMap.Event.addListener(geolocation, 'complete', onComplete);
  AMap.Event.addListener(geolocation, 'error', onError);
};

function onComplete(data) {
  // oMap.startLngLat = [data.position.lng, data.position.lat];
}

function onError(data) {
  // 定位出错
  console.log(data);
}

const lookEnd = () => {};
</script>

<style scoped>
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 500px;
}
#panel {
  position: fixed;
  background-color: white;
  max-height: 90%;
  overflow-y: auto;
  border-radius: 3px;
  top: 25px;
  right: 52px;
  width: 329px;
}
#panel .amap-call {
  background-color: #009cf9;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
#panel .amap-lib-driving {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  overflow: hidden;
}
</style>
