<template>
  <el-config-provider :locale="locale">
    <div class="main_container Main">
      <div class="block">
        <el-date-picker
          v-model="monthValue"
          clearable
          type="month"
          placeholder="选择花期月份"
          @change="changeMonth"
        />
        <el-select
          v-model="GapValue"
          clearable
          class="m-2"
          placeholder="选择距离"
          @change="changeGap"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="photo_c">
        <VirtualPhotoList
          :photoList="photoList"
          :listSize="listSize"
          :showList="showList"
        ></VirtualPhotoList>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import { ref, computed, inject, onMounted, toRaw } from 'vue';
//分隔数组函数
import { groupArray } from '../tool/groupArray';
//
import { initAmap } from '../tool/gapCount';

const $api = inject('$api');

const locale = ref(zhCn);
const monthValue = ref('');
const listSize = ref(400);
const showList = ref(8);
const photoList = ref([]);
//未分组的图片数组
let noGroupList = [];

const GapValue = ref();

const options = [
  {
    value: 'far',
    label: '由远至近',
  },
  {
    value: 'near',
    label: '由近至远',
  },
];

onMounted(() => {
  //获取全部图片信息
  getFlowersMsg();
});

const getFlowersMsg = async () => {
  const res = await $api.photo.photoDetails();
  if (res.status === 200) {
    noGroupList = res.data.flower;
    photoList.value = groupArray(res.data.flower);
  }
  // console.log(noGroupList.value);
};
//根据时间获取图片信息
const getFollowByTime = async moon => {
  const res = await $api.photo.photoDetailByTime(moon);
  if (res.status === 200) {
    photoList.value = groupArray(res.data.data);
  }
};
const changeMonth = () => {
  if (!monthValue.value) {
    getFlowersMsg();
    return;
  }
  getFollowByTime(forMate(monthValue.value));
};
//距离计算
const changeGap = async () => {
  const as = initAmap('重庆市渝北区理工大学两江校区', '重庆园博园');
  console.log(as);
};

const forEachMap = () => {
  return new Promise(resolve => {
    noGroupList.forEach(item => {
      initAmap('重庆市渝北区理工大学两江校区', item.faddress).then(res => {
        console.log('1');
        item.distance = Number(res.distance);
      });
    });
    resolve(noGroupList);
  });
};

const forMate = date => {
  let year = date.getFullYear();
  year = (year + '').slice(2, 4);
  let month = date.getMonth() + 1;
  if ((month + '').length == 1) {
    month = '0' + month;
  }
  return year + month;
};
</script>

<style scoped>
.main_container {
  position: relative;
}
.p_border {
  border-radius: 10px;
  border: 1px solid #ded2d2;
}
.photo_c {
  display: flex;
  /* margin: 20px 20px 0 20px; */
}
</style>
