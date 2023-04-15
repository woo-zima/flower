<template>
  <div class="photo_s">
    <VirtualPhotoList
      :photoList="photoList"
      :listSize="listSize"
      :showList="showList"
    ></VirtualPhotoList>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, watch } from 'vue';
import { groupArray } from '@/tool/groupArray.js';
import { useRoute } from 'vue-router';

const $api = inject('$api');
const route = useRoute();
const listSize = ref(400);
const showList = ref(8);
const photoList = ref([]);

onMounted(() => {
  //获取全部图片信息
  getFlowersMsg();
});

watch(
  () => route.query.keywords,
  newVal => {
    getFlowersMsg(newVal);
  },
  {
    deep: true,
  }
);

const getFlowersMsg = async () => {
  const key = route.query.keywords || '';
  const res = await $api.photo.getFlowerBykey(key);
  if (res.data.status === 200) {
    photoList.value = groupArray(res.data.data);
  }
};
</script>

<style scoped>
.photo_s {
  display: flex;
}
</style>
