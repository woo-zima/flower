<template>
  <div class="likeContainer">
    <div class="likeList" v-if="likeList.length != 0">
      <div class="innerList" v-for="item in likeList" @click="toDetail(item)">
        <el-avatar class="avatar" src="https://source.unsplash.com/collection/94734566">
          {{ item.user.uname }}
        </el-avatar>
        <img :src="'http://localhost:3000/files/' + item.furl" alt="" />
      </div>
    </div>
    <div v-else>暂无推荐！</div>
  </div>
</template>

<script setup>
import { defineProps, inject, reactive, ref, toRefs, watch } from 'vue';
import { fliterArray } from '../tool/groupArray';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const $api = inject('$api');
const props = defineProps({
  likeDes: {
    type: Object,
  },
});
const { likeDes } = toRefs(props);

const likeList = ref([]);

watch(
  () => likeDes,
  newVal => {
    getLikeSell(newVal);
  },
  { deep: true }
);

const getLikeSell = async obj => {
  const { ftag, fid } = obj.value;
  const res = await $api.photo.getFlowerByTag(ftag, fid);
  if (res) {
    console.log(res);
    likeList.value = fliterArray(res.data.data);
  }
};
const toDetail = item => {
  console.log(item);
  router.push({
    path: `/des/${item.fid}`,
  });
};
</script>

<style scoped>
.likeContainer {
  position: relative;
}
.likeContainer .likeList {
  width: 100%;
}
.innerList {
  position: relative;
  width: 100%;
  border-radius: 5px;
  cursor: pointer;
  max-height: 280px;
  margin-bottom: 10px;
}
.innerList .avatar {
  position: absolute;
  top: 3px;
  left: 3px;
}
.innerList img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  max-height: 280px;
  border-radius: 5px;
}
</style>
