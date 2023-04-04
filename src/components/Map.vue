<template>
  <div class="app-container">
    <span>使用其他方式导航。。</span>
    <div style="background-color: #ffffff">
      <div id="container"></div>
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
  startName: '',
  endName: '',
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
  });

  initMap();
});
watch(
  () => adressMsg,
  newVal => {
    console.log(newVal);
  }
);
const goView = () => {
  //构造路线导航类
  console.log(adressMsg);
  const Driving = new oMap.mymap.Driving({
    map: map.value, //地图
    hideMarkers: false, //自定义起点终点图标，默认false
    policy: oMap.mymap.DrivingPolicy.LEAST_TIME,
  });
  const points = [
    { keyword: '重庆理工大学两江校区', city: '全国' },
    { keyword: adressMsg.value, city: '全国' },
  ];

  // 根据起终点名称规划驾车导航路线
  Driving.search(points, (status, result) => {
    // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
    // if (status === 'complete') {
    //   console.log('绘制驾车路线完成');
    // } else {
    //   console.log('获取驾车数据失败：' + result);
    // }
    console.log('result', result);
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
      //   const autoOptions = {
      //     city:'全国',
      //     input:'start'
      //   }
      //调用获取定位方法
      getGeolocation();
      goView();
    })
    .catch(e => {
      console.log(e);
    });
};

//地图定位
const getGeolocation = () => {
  // const geolocation = new oMap.mymap.Geolocation({
  //   enableHighAccuracy: true, //是否使用高精度定位，默认:true
  //   timeout: 10000, //超过10秒后停止定位，默认：5s
  //   // position: "RB", //定位按钮的停靠位置
  //   // offset: [10, 240], //定位按钮与设置的停靠位置的偏移量，默认：[10, 20]
  //   showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
  //   showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
  //   panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
  //   zoomToAccuracy: true, //定位成功后自动调整地图视野到定位精度范围，默认：true
  // });
  console.log([current_position.value[0], current_position.value[1]]);
  const geocoder = new oMap.mymap.Geocoder({
    radius: 1000,
    extensions: 'all',
  });
  geocoder.getAddress([25.0642432, 121.5987712], function (status, result) {
    if (status === 'complete' && result.regeocode) {
      console.log(result);
    } else {
      console.log('解析失败');
    }
  });
};

//解析定位结果
function onComplete(data) {
  console.log(data);
  // oMap.startName = data.position.lat;
  // oMap.endName = data.position.lng;
}
//解析定位错误信息
function onError(data) {
  console.log(data);
}
</script>

<style scoped>
#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 500px;
}
.el-dialog {
  --el-dialog-margin-top: 30px;
}
</style>
