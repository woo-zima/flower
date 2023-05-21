<template>
  <div class="Means">
    <div class="rightContainer">
      <div class="authMsg">
        <div class="avatarImg">
          <el-avatar fit="cover" src="http://wphoto.top/FvqbmQo3qldO7dsZXI98AkkJ16RC"></el-avatar>
        </div>
        <div class="msgMain">
          <h2>{{ state.upMsg.uname || '' }}</h2>
        </div>
        <div class="infor">
          <input
            id="w-sign"
            type="text"
            v-model="state.upMsg.introduction"
            :placeholder="state.upMsg.introduction || '编辑个人介绍'"
            maxlength="30"
            @change="changeInfor"
          />
        </div>
      </div>
    </div>
  </div>

  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="上传作品" name="upload">
      <div class="tagBoxs">
        <ul @click="changeUpActive">
          <li :class="['ALL' == checkUp ? 'active' : '']">ALL</li>
          <li :class="['SHing' == checkUp ? 'active' : '']">审核中</li>
        </ul>
      </div>
      <div v-if="state.upPhotoList.length > 0">
        <div class="upContainer">
          <div
            class="in"
            v-for="item in state.upPhotoList"
            :key="item.fid"
            @click="toDes(item.fid)"
          >
            <div class="set" v-on:mouseenter="showThis" v-on:mouseleave="removeThis"></div>
            <ul class="setinner" v-on:mouseenter="showThis" v-on:mouseleave="removeThis">
              <li @click.stop="deleteUp(item)">删除</li>
            </ul>
            <img :src="'http://localhost:3000/files/' + item.furl" alt="" />
            <p style="margin: 0">上传时间: {{ item.ftime.substring(0, 10) }}</p>
          </div>
        </div>
      </div>
      <div v-else>
        <el-empty description="暂无上传" />
      </div>
    </el-tab-pane>

    <el-tab-pane label="我的收藏" name="like">
      <div class="tagBoxs">
        <ul @click="addTagActive">
          <li :class="['ALL' == checkTag ? 'active' : '']">ALL</li>
          <li
            v-for="item in tagList"
            :key="item.name"
            :class="[item.name == checkTag ? 'active' : '']"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div v-if="state.upLikePhotoList.length > 0">
        <div class="upContainer">
          <div
            class="in"
            v-for="item in state.upLikePhotoList"
            :key="item.fid"
            :class="['0' == item.fpass ? 'pass' : '']"
            @click="toDes(item.fid)"
          >
            <img :src="'http://localhost:3000/files/' + item.flower.furl" alt="" />
            <p style="margin: 0">收藏时间: {{ item.ctime.substring(0, 10) }}</p>
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
    uname: '',
    introduction: '',
  },
});
//用户收藏标签
const tagList = ref([]);
const checkTag = ref('ALL');
const checkUp = ref('All');
const activeName = ref('upload');

onMounted(() => {
  getUpLists();
  getLikeLists();
  getTagsByUser();
});

watch(
  () => route.params,
  () => {
    getUpLists();
  }
);

const handleClick = (tab, event) => {
  // console.log(tab, event);
};
const getUpLists = async () => {
  const res = await $api.photo.getFlowerByUser(route.params.uid || 0);
  if (res.data.status === 200) {
    state.upPhotoList = fliterArray(res.data.data);
    state.upMsg.uname = res.data.data[0].user.uname;
    state.upMsg.introduction = res.data.data[0].user.introduction;
  }
};
//获取用户收藏标签
const getTagsByUser = async () => {
  const res = await $api.user.getTagByUid(store.userDeail.uid);
  if (res.data) {
    const arr = res.data.data.map(item => {
      return { name: item.name, count: item.count };
    });
    tagList.value = arr;
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
//鼠标移入事件
const showThis = e => {
  const el = e.target.parentNode.children[1];
  el.classList.add('active');
};
//鼠标移出事件
const removeThis = e => {
  const el = e.target.parentNode.children[1];
  el.classList.remove('active');
};

const deleteUp = item => {
  ElMessageBox.confirm('您确定要删除？', 'delete', {
    distinguishCancelAndClose: true,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  })
    .then(() => {
      console.log(item.fid);
      const res = $api.photo.deletePhoto(item.fid);
      // console.log(res);
      ElMessage({
        type: 'info',
        message: '删除成功',
      });
    })
    .catch(action => {
      console.log(action);
    });
};
//收藏标签切换
const addTagActive = async e => {
  const target = e.target;
  const nameValue = target.firstChild?.nodeValue;
  checkTag.value = nameValue;
  // console.log(checkTag.value);
  if (checkTag.value === 'ALL') {
    getLikeLists();
    return;
  }
  const res = await $api.user.getTagByCname(checkTag.value);
  if (res.data) {
    state.upLikePhotoList = fliterFlowerArray(res.data.data);
  } else {
    state.upLikePhotoList = [];
  }
};
// 上传标签切换
const changeUpActive = async e => {
  const target = e.target;
  const nameValue = target.firstChild?.nodeValue;
  checkUp.value = nameValue;
  if (checkUp.value === 'ALL') {
    getUpLists();
    return;
  }
  const res = await $api.photo.getFlowerByUserPass(store.userDeail.uid);
  if (res.data) {
    state.upPhotoList = fliterArray(res.data.data);
  } else {
    state.upPhotoList = [];
  }
};
const changeInfor = async () => {
  // console.log(state.upMsg.introduction);
  const res = await $api.user.upIntroduction({
    uid: store.userDeail.uid,
    introduction: state.upMsg.introduction,
  });
  if (res) {
    console.log(res);
  }
  getUpLists();
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
  position: relative;
  margin: 0 auto;
  padding: 100px 0 20px 50px;
  width: 1283px;
  border-radius: 0 0 10px 10px;
  background: url(http://wphoto.top/FkEU6nt7B98VjaurZGMcUBeVD5Np);
  background-position: center;
}
.demo-tabs {
  width: 1333px;
  margin: 0 auto;
}
.Means .avatarImg {
  float: left;
  transform: scale(1.5);
}
.Means .msgMain {
  padding-left: 60px;
  font-size: 20px;
  color: #fbc;
}
.Means .infor {
  padding-left: 60px;
}
.Means #w-sign {
  background: transparent;
  border-radius: 4px;
  border: none;
  box-shadow: none;
  color: hsla(0, 0%, 100%, 0.8);
  font-size: 12px;
  font-family: Microsoft Yahei;
  line-height: 26px;
  height: 26px;
  margin-left: -5px;
  padding: 0 5px;
  position: relative;
  top: -1px;
  width: 730px;
}
.Means #w-sign:hover {
  background: hsla(0, 0%, 100%, 0.2);
  box-shadow: 0 0 0 1px hsla(0, 0%, 100%, 0.5);
}
.Means #w-sign:focus {
  background: #fff;
  box-shadow: inset 0 2px 4px rgba(113, 119, 130, 0.3);
  color: #6d757a;
  outline: none;
}
.upContainer {
  position: relative;
  /* margin: 0 20px 40px 20px; */
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
  padding-bottom: 30px;
}
.upContainer .in {
  position: relative;
  height: 305px;
  max-width: 436px;
  border-radius: 5px;
  min-width: calc((100% - 25px) / 3);
}
.upContainer .in img {
  width: 100%;
  height: 90%;
  object-fit: cover;
  border-radius: 5px;
  cursor: pointer;
}
.upContainer .in .set {
  position: absolute;
  width: 20px;
  height: 20px;
  right: 5px;
  cursor: pointer;
}
.upContainer .in .setinner {
  position: absolute;
  right: 0;
  background-color: #fff;
  border-radius: 2px;
  padding: 10px 5px;
  cursor: pointer;
  display: none;
}
.upContainer .in .setinner li:hover {
  color: #ff1e1e;
}
.upContainer .in .set::before {
  content: '...';
  color: #fff;
  font-size: 20px;
}
.upContainer .in .setinner.active {
  display: block;
}
.tagBoxs ul {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: max-content;
}
.tagBoxs ul li {
  border: 1px solid;
  padding: 5px 9px;
  border-radius: 50px;
  cursor: pointer;
}
.tagBoxs ul li.active {
  border: 1px solid #ff1e1e;
  color: #ff1e1e;
}
.upContainer .in img.pass {
  border: 1px solid #ff1e1e;
}
.tagBoxs ul li:hover {
  border: 1px solid #ff1e1e;
  color: #ff1e1e;
}
</style>
