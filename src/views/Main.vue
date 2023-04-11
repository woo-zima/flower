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
import { ref, computed, inject, onMounted } from 'vue';
//分隔数组函数
import { groupArray } from '../tool/groupArray';

const $api = inject('$api');

const locale = ref(zhCn);
const monthValue = ref('');
const listSize = ref(400);
const showList = ref(8);
const photoList = ref([]);

onMounted(() => {
  //获取全部图片信息
  getFlowersMsg();
});

const getFlowersMsg = async () => {
  const res = await $api.photo.photoDetails();
  if (res.status === 200) {
    photoList.value = groupArray(res.data.flowers);
  }
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
