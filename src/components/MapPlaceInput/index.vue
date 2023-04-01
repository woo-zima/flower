<template>
  <div>
    <el-form ref="addressForm" :model="addForm" :rules="addRules">
      <el-form-item label="地址：" prop="sname">
        <el-input
          id="sname"
          v-model.trim="addForm.sname"
          type="text"
          @input="placeAutoInput('sname')"
          @keyup.delete.native="deletePlace('sname')"
          placeholder="请输入地址"
          clearable
        >
          <i class="el-icon-location-outline el-input__icon" slot="suffix" title="地址"></i>
        </el-input>
        <div v-show="snameMapShow" class="map-wrapper">
          <div>
            <el-button type="primary" size="small" @click.stop="snameMapShow = false">
              收起
              <i class="el-icon-caret-top"></i>
            </el-button>
          </div>
          <div id="sNameMap" class="map-self"></div>
        </div>
      </el-form-item>
    </el-form>
    <!--地址模糊搜索子组件-->
    <placeSearch
      class="place-wrap"
      ref="PSearch"
      v-if="resultVisible"
      :result="result"
      :left="offsetLeft"
      :top="offsetTop"
      :width="inputWidth"
      :height="inputHeight"
      @getLocation="getPlaceLocation"
    ></placeSearch>
  </div>
</template>

<script setup>
import AMapLoader from '@amap/amap-jsapi-loader';
import placeSearch from './placeSearch.vue';
import { reactive, ref, onMounted, toRefs } from 'vue';

const addForm = reactive({
  sname: '', // 地点名称
  slat: 0, // 地点纬度
  slng: 0, // 地点经度
});
const addressForm = ref(); //ref表单

//保存地图
const ADMap = ref({});
//获取子组件实例
const PSearch = ref(null);
const inputId = ref('');
const result = ref([]);
const resultVisible = ref(false);
const inputWidth = ref(0);
const inputHeight = ref(0);
const offsetLeft = ref(0);
const offsetTop = ref(0);
const snameMap = ref(null); //地图面板
const snameMapShow = ref(false);

onMounted(() => {
  // document添加onclick监听，点击时隐藏地址下拉浮窗
  document.addEventListener('click', hidePlaces, false);
  // window添加onresize监听，当改变窗口大小时同时修改地址下拉浮窗的位置
  window.addEventListener('resize', changePos, false);
  window._AMapSecurityConfig = {
    securityJsCode: 'c23da6fd8c694cd3a95f9eb8d0f01cb7',
  };
});
const validatePlace = () => {
  addressForm.value.validate(valid => {
    if (valid) {
      return true;
      // console.log(state.uploadMsgForm);
    } else {
      return false;
    }
  });
};

const addRules = {
  sname: [{ required: true, message: '请确认准确地址', trigger: 'change' }],
};

const placeAutoInput = inputid => {
  let currentDom = document.getElementById(inputid); // 获取input对象
  let keywords = currentDom.value;
  if (keywords.trim().length === 0) {
    resultVisible.value = false;
  }
  AMapLoader.load({
    key: 'fbe5c0bff727387368ff0566c40a084d',
    version: '2.0',
    plugins: ['AMap.AutoComplete', 'AMap.Geocoder', 'AMap.ToolBar'],
    AMapUI: {
      // 是否加载 AMapUI，缺省不加载
      version: '1.1', // AMapUI 缺省 1.1
      plugins: [], // 需要加载的 AMapUI ui插件
    },
  }).then(AMap => {
    console.log(AMap);
    ADMap.value = AMap;
    AMap['plugin']('AMap.AutoComplete', function () {
      var autoOptions = {
        //city 限定城市，默认全国
        city: '全国',
      };
      // 实例化AutoComplete
      var autoComplete = new AMap['AutoComplete'](autoOptions);
      // 根据关键字进行搜索
      autoComplete.search(keywords, (status, res) => {
        // 搜索成功时，result即是对应的匹配数据
        if (res.info === 'OK') {
          let sizeObj = currentDom.getBoundingClientRect(); // 取得元素距离窗口的绝对位置
          inputWidth.value = currentDom.clientWidth; // input的宽度
          inputHeight.value = currentDom.clientHeight + 2; // input的高度，2是上下border的宽
          // input元素相对于页面的绝对位置 = 元素相对于窗口的绝对位置
          offsetTop.value = sizeObj.top + inputHeight.value; // 距顶部
          offsetLeft.value = sizeObj.left; // 距左侧
          result.value = res.tips;
          inputId.value = inputid;
          resultVisible.value = true;
        }
      });
    });
  });
};

// 隐藏搜索地址下拉框
const hidePlaces = event => {
  let target = event.target;
  // 排除点击地址搜索下拉框
  if (target.classList.contains('address')) {
    return;
  }
  resultVisible.value = false;
};
// 修改搜索地址下拉框的位置
const changePos = () => {
  if (inputId.value && PSearch.value) {
    let currentDom = document.getElementById(inputId.value);
    let sizeObj = currentDom.getBoundingClientRect(); // 取得元素距离窗口的绝对位置
    // 元素相对于页面的绝对位置 = 元素相对于窗口的绝对位置
    let inputWidth = currentDom.clientWidth; // input的宽度
    let inputHeight = currentDom.clientHeight + 2; // input的高度，2是上下border的宽
    let offsetTop = sizeObj.top + inputHeight; // 距顶部
    let offsetLeft = sizeObj.left; // 距左侧
    PSearch.value.changePost(offsetLeft, offsetTop, inputWidth, inputHeight);
  }
};
// 获取子组件返回的位置信息
const getPlaceLocation = item => {
  console.log(item);
  if (item) {
    resultVisible.value = false;
    if (item.location && item.location.lat) {
      pickAddress(inputId.value, item.location.lng, item.location.lat);
      addressForm.value.validateField(inputId.value);
    } else {
      geocoder(item.name, inputId.value);
    }
  }
};
// 地图选址
const pickAddress = (inputId, lng, lat) => {
  console.log(inputId, lng, lat);
  if (inputId === 'sname') {
    snameMapShow.value = true;
    AMapUI.loadUI(['misc/PositionPicker'], PositionPicker => {
      snameMap.value = new ADMap.value.Map('sNameMap', {
        zoom: 16,
        scrollWheel: false,
        center: [lng, lat],
      });
      let positionPicker = new PositionPicker({
        mode: 'dragMap',
        map: snameMap.value,
      });
      positionPicker.on('success', positionResult => {
        console.log(positionResult);
        addForm.slat = positionResult.position.lat;
        addForm.slng = positionResult.position.lng;
        addForm.sname = positionResult.address;
      });
      positionPicker.on('fail', positionResult => {
        console.log('地址选取失败');
      });
      positionPicker.start();
      snameMap.value.addControl(
        new ADMap.value.ToolBar({
          liteStyle: true,
        })
      );
    });
  }
};
// 地理编码
const geocoder = (keyword, inputValue) => {
  let geocoder = new AMapLoader.Geocoder({
    //city: "010", //城市，默认：“全国”
    radius: 1000, //范围，默认：500
  });
  //地理编码,返回地理编码结果
  geocoder.getLocation(keyword, (status, res) => {
    if (status === 'complete' && res.info === 'OK') {
      let geocode = res.geocodes;
      if (geocode && geocode.length > 0) {
        if (inputValue === 'sname') {
          addForm.slat = geocode[0].location.getLat();
          addForm.slng = geocode[0].location.getLng();
          addForm.sname = keyword;
          // 如果地理编码返回的粗略经纬度数据不需要在地图上显示，就不需要调用地图选址，且要隐藏地图
          //  pickAddress("sname", geocode[0].location.getLng(), geocode[0].location.getLat());
          snameMapShow.value = false;
          addressForm.value.validateField('sname');
        }
      }
    }
  });
};
// 做删除操作时还原经纬度并验证字段
const deletePlace = () => {
  addForm.slat = 0;
  addForm.slng = 0;
  addressForm.value.resetFields();
};
defineExpose({
  validatePlace,
  deletePlace,
  ...toRefs(addForm),
});
</script>
<style>
.map-wrapper .map-self {
  width: 300px;
  height: 150px;
}
</style>
