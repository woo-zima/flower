<template>
  <el-config-provider :locale="locale">
    <div class="main_container Main">
      <div class="block">
        <el-date-picker v-model="monthValue" type="month" placeholder="选择花期月份" />
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

const $api = inject('$api');

const locale = ref(zhCn);
const monthValue = ref('');
const listSize = ref(60);
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
  console.log(photoList.value);
};
//分隔数组函数
const groupArray = array => {
  if (array.length <= 3) {
    return;
  }
  for (let i = 0; i < array.length; i++) {
    if (array[i].furl.includes(';')) {
      array[i].furl = array[i].furl.split(';')[0];
    }
  }
  const result = [];
  for (let i = 0; i < array.length; i += 3) {
    result.push(array.slice(i, i + 3));
  }

  return result;
};
// const photoList = computed(() => {
//   return Array(1000)
//     .fill('')
//     .map((item, index) => ({
//       id: index,
//       content: '列表项内容' + index,
//     }));
// });
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
