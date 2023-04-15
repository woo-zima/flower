<template>
  <div class="Means">
    <div class="rightContainer">
      <div class="authMsg">
        <div class="avatarImg">
          <el-avatar fit="cover" src="http://wphoto.top/FvqbmQo3qldO7dsZXI98AkkJ16RC"></el-avatar>
        </div>
        <div class="msgMain">
          <h2>{{ store.userDeail.uname || '' }}</h2>
        </div>
      </div>
    </div>
  </div>

  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="上传作品" name="upload">
      <div v-if="state.upPhotoList.length > 0">
        <div class="upContainer">
          <div
            class="in"
            v-for="item in state.upPhotoList"
            :key="item.fid"
            @click="toDes(item.fid)"
          >
            <img :src="'http://localhost:3000/files/' + item.furl" alt="" />
          </div>
        </div>
      </div>
      <div v-else>
        <el-empty description="暂无上传" />
      </div>
    </el-tab-pane>
    <el-tab-pane label="我的收藏" name="like">
      <div v-if="state.upLikePhotoList.length > 0">
        <div class="upContainer">
          <div
            class="in"
            v-for="item in state.upLikePhotoList"
            :key="item.fid"
            @click="toDes(item.fid)"
          >
            <img :src="'http://localhost:3000/files/' + item.flower.furl" alt="" />
          </div>
        </div>
      </div>
      <div v-else>
        <el-empty description="暂无收藏" />
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import { inject, onMounted, reactive, watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { mainStore } from '@/store';
import { fliterArray, fliterFlowerArray } from '../tool/groupArray';

const $api = inject('$api');
const store = mainStore();
const route = useRoute();
const router = useRouter();
const state = reactive({
  upPhotoList: [],
  upLikePhotoList: [],
  upMsg: {
    uname: 'zmrin',
  },
});
const activeName = ref('upload');

onMounted(() => {
  getUpLists();
  getLikeLists();
});

watch(
  () => route.params,
  () => {
    getUpLists();
  }
);

const handleClick = (tab, event) => {
  console.log(tab, event);
};
const getUpLists = async () => {
  const res = await $api.photo.getFlowerByUser(route.params.uid || 0);
  if (res.data.status === 200) {
    state.upPhotoList = fliterArray(res.data.data);
  }
};
const getLikeLists = async () => {
  const res = await $api.photo.getFlowerLikeByUser(route.params.uid || 0);
  if (res.data.status === 200) {
    state.upLikePhotoList = fliterFlowerArray(res.data.data);
  }
};

//跳转图鉴详情
const toDes = fid => {
  router.push({
    name: 'des',
    params: {
      fid,
    },
  });
};
</script>

<style>
.el-tabs__item:hover {
  color: #ff1e1e;
}
.el-tabs__item.is-active {
  color: #ff1e1e;
}
.el-tabs__active-bar {
  background-color: #ff1e1e;
}
.Means {
  padding: 20px 0 0 50px;
}
.Means .msgMain {
  font-size: 20px;
  color: #fbc;
}
.upContainer {
  position: relative;
  margin: 0 20px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
}
.upContainer .in {
  height: 305px;
  max-width: 460px;
  border-radius: 5px;
  min-width: calc((100% - 20px) / 3);
}
.upContainer .in img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
}
</style>
