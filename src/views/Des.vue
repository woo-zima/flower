<template>
  <div class="container">
    <div class="photoDetail">
      <div class="leftImg">
        <div class="block text-center">
          <el-carousel trigger="click" height="450px">
            <el-carousel-item v-for="item in urls" :key="item">
              <img :src="'http://localhost:3000/files/' + item" style="width: 100%" />
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <div class="rightMsg">
        <aside class="detail-author">
          <section class="headImg-info">
            <el-avatar @click="toInformation" style="cursor: pointer">
              {{ currentPhoto.user?.uname || '' }}
            </el-avatar>
            <h2>{{ currentPhoto.user?.uname || '' }}</h2>
          </section>
          <section>
            <el-button color="#626aef" round @click="toFollow">
              {{ !isCollect ? '收藏' : '已收藏' }}
            </el-button>
          </section>
          <section class="msg">
            <span class="first_span">标题:{{ currentPhoto.ftitle }}</span>
            <br />
            <span class="last_span">
              景点介绍:
              <p v-for="item in desp" :key="item">{{ item }}</p>
            </span>
          </section>
          <section class="address">
            <span>地址:{{ currentPhoto.faddress }}</span>
            <el-icon style="cursor: pointer" @click="goAddress"><Position /></el-icon>
          </section>
          <div class="data" title="投稿时间">赏花时间:{{ currentPhoto.fmoon }}</div>
        </aside>
      </div>
    </div>

    <div class="photo-action">
      <el-image
        class="showImg"
        :src="state.srcList[0]"
        :preview-src-list="state.srcList"
        :initial-index="0"
        fit="cover"
      />
    </div>

    <el-dialog
      v-model="dialogVisible"
      destroy-on-close
      center
      title="导航路线"
      style="margin: 30px auto"
    >
      <Map :adressMsg="currentPhoto.faddress"></Map>
    </el-dialog>

    <div class="comment">
      <div class="comment-inner">
        <div class="au-comment">
          <div class="comments-box">
            <!-- 输入框 -->
            <div class="post-comment-container">
              <a class="post-comment-avatar">
                <el-avatar>user</el-avatar>
              </a>
              <div class="post-comment">
                <form>
                  <textarea
                    name="commentTextare"
                    v-model="textareaValue"
                    placeholder="请输入评论~"
                    id=""
                    cols="30"
                    rows="10"
                  />
                </form>
              </div>
              <a class="sbumitComment" @click="sbumitTextarea"><span>发送</span></a>
            </div>

            <!-- 评论列表 -->
            <div class="comment-list">
              <div v-if="state.comment.length == 0" style="padding-top: 10px; text-align: center">
                暂无评论...
              </div>
              <ul>
                <li class="comment-item" v-for="item in state.comment" :key="item.plid">
                  <a>
                    <el-avatar @click="toContentInformation(item.user.uid)" style="cursor: pointer">
                      {{ item.user.uname }}
                    </el-avatar>
                  </a>
                  <div>
                    <h2>{{ item.user.uname }}</h2>
                    <div class="comment-text">{{ item.pcontent }}</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="au-saider">
          <div class="author">
            <h3>兴趣推荐</h3>
            <LikeSell :likeDes="likeDes"></LikeSell>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { Position } from '@element-plus/icons-vue';
import { mainStore } from '@/store';
import { useRoute, useRouter } from 'vue-router';

const dialogVisible = ref(false);
let textareaValue = ref('');
const route = useRoute();
const router = useRouter();
const store = mainStore();
const $api = inject('$api');

const currentPhoto = ref({}); //保存当前页面信息
const urls = ref([]);
const desp = ref([]);
//是否关注
const isCollect = ref(false);
const state = reactive({
  comment: [],
  srcList: [],
});
const likeDes = computed(() => {
  return {
    ftag: currentPhoto.value.ftag,
    fid: currentPhoto.value.fid,
  };
});

onBeforeUnmount(() => {
  textareaValue.value = '';
});
onMounted(() => {
  getPhotoDetail(route.params.fid);
  getPhotoComment(route.params.fid);
});

watch(
  () => route.params,
  newVal => {
    if (newVal.fid) {
      getPhotoDetail(newVal.fid);
      getPhotoComment(newVal.fid);
    }
  }
);
const getPhotoComment = async id => {
  const res = await $api.comment.getPhotoComment(id);
  if (res) {
    state.comment = [...res.data.comments];
  }
};

//获取页面信息
const getPhotoDetail = async fid => {
  const res = await $api.photo.photoDetail(fid);
  if (res.status === 200) {
    currentPhoto.value = res.data.data;
    urls.value = currentPhoto.value.furl.split(';');
    desp.value = currentPhoto.value.fdesp.split('\n');
    state.srcList = currentPhoto.value.furl.split(';').map(item => {
      return 'http://localhost:3000/files/' + item;
    });
    // console.log(state.srcList);
    //console.log(currentPhoto.value);
  }
  getFollow();
  // console.log(state.comment.length);
};
//校验
const vaildCommentText = () => {
  if (textareaValue.value === '' || textareaValue.value === null) {
    return false;
  }
  return true;
};
//评论验证触发
const sbumitTextarea = () => {
  if (!store.userDeail.uname) {
    ElMessage({
      showClose: true,
      message: '请先登录再发布评论',
      type: 'info',
    });
    return;
  }
  if (vaildCommentText()) {
    postComment();
    return;
  }
  ElMessage({
    showClose: true,
    message: '请输入评论再发布',
    type: 'info',
  });
};
//发送评论
const postComment = async () => {
  const commentData = {
    uid: store.userDeail.uid,
    fid: route.params.fid,
    pcontent: textareaValue.value,
  };
  const res = await $api.comment.addComment(commentData);
  console.log(res);
  if (res.data.status === 200) {
    textareaValue.value = '';
    getPhotoComment(route.params.fid);
  }
};

//获取是否收藏
const getFollow = async () => {
  if (!store.userDeail.uid) return;
  let uid = store.userDeail.uid,
    fid = currentPhoto.value.fid;
  const res = await $api.photo.isCollect(uid, fid);
  if (res.status === 200) {
    isCollect.value = res.data;
  }
};

//作品收藏
const toFollow = async () => {
  if (!store.userDeail.uname) {
    ElMessage({
      showClose: true,
      message: '你还未登录！',
      type: 'info',
    });
    return;
  }
  let uid = store.userDeail.uid,
    fid = currentPhoto.value.fid;
  const res = await $api.photo.updateLikeById(uid, fid);
  if (res) {
    console.log(res);
  }

  getFollow();
};
//导航
const goAddress = () => {
  const adres = currentPhoto.value.faddress || '';
  dialogVisible.value = true;
};

const fliterMoon = moon => {
  return moon.substring(0, 4) + '年' + moon.substring(4, 6) + '月' + moon.substring(6, 8) + '日';
};
const toContentInformation = () => {};
const toInformation = () => {};
</script>

<style scoped>
::-webkit-scrollbar {
  width: 0px;
}
.container {
  padding: 0 50px;
  background-color: #f3f3f3;
}
.photoDetail {
  display: flex;
  padding: 20px 0;
  height: 450px;
}

.leftImg {
  flex: 3;
  padding: 0 20px 0 12px;
}

.leftImg img {
  height: 100%;
  object-fit: contain;
}

.rightMsg {
  flex: 1;
  padding-left: 14px;
  border-left: 1px solid #ded2d2;
  overflow-y: scroll;
}

.photo-action {
  display: flex;
  justify-content: space-between;
  padding: 2px 10px;
}

.photo-action .showImg {
  position: relative;
  left: -2px;
  width: 18px;
  height: 18px;
  z-index: 999;
  padding-right: 96px;
}

.photo-action .showImg::after {
  position: absolute;
  display: inline-block;
  left: 18px;
  top: -1px;
  content: '查看大图';
  width: 88px;
  height: 18px;
}

.msg {
  font-size: 18px;
  padding: 17px 0;
}
.msg .first_span {
  font-size: 20px;
}
.msg .last_span {
  display: inline-block;
  padding-top: 10px;
}
@media screen and (max-width: 875px) {
  .comment-list ul {
    margin: 0;
    padding: 0;
  }
}
@media screen and (max-width: 700px) {
  .dialogMain .comment {
    padding: 6px 12px;
  }
  .au-comment {
    padding: 2px 1px;
  }
  .post-comment-container {
    flex-direction: column;
  }
  .post-comment-container form textarea {
    height: 66px;
  }
  .author div {
    flex-direction: column;
  }
  .author div h2 {
    margin: 2px 0;
    padding: 10px 5px;
  }
}

.comment .comment-inner {
  display: flex;
}

.comment-inner .au-comment {
  flex: 2;
  background-color: #fff;
  border-radius: 10px;
  box-sizing: border-box;
  margin: 0 10px 10px 0;
  padding: 17px 20px;
  text-align: left;
}

.au-comment .post-comment-container {
  display: flex;
  gap: 10px;
}

.post-comment-container .post-comment {
  flex: 1;
}

.post-comment-container form textarea {
  width: 100%;
  padding: 2px;
  resize: none;
}

.post-comment-container .sbumitComment span {
  width: 50px;
  padding: 4px 5px;
  background-color: #acb;
  border-radius: 2px;
  text-align: center;
  cursor: pointer;
}

.comment-item {
  display: flex;
  margin-top: 30px;
}

.comment-item h2 {
  margin: 0;
  padding-left: 10px;
}

.comment-item .comment-text {
  padding-left: 10px;
}

.comment-inner .au-saider {
  flex: 1;
  box-sizing: border-box;
}

.au-saider .author {
  background-color: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 0 20px 20px 20px;
}
.author div h2 {
  margin: 0;
  padding: 0 10px;
}
</style>
