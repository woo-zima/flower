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
              {{ !state.followFl ? '关注' : '已关注' }}
            </el-button>
          </section>
          <section class="msg">
            <span>标题:{{ currentPhoto.ftitle }}</span>
            <br />
            <span>景点介绍:{{ currentPhoto.fdesp }}</span>
          </section>
          <section class="address">
            <span>地址:{{ currentPhoto.faddress }}</span>
            <el-icon style="cursor: pointer" @click="goAddress"><Position /></el-icon>
          </section>
          <div class="data" title="投稿时间">投稿时间:</div>
        </aside>
      </div>
    </div>

    <div class="photo-action">
      <el-image
        class="showImg"
        src=""
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
    <!-- <div class="photo-content">
      <div class="content-inner">
        <h2>name</h2>
        <div class="intro">alalalala</div>
        <div class="tags"></div>
        <ul class="star"></ul>
      </div>
    </div> -->

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
            <h3>周边推荐</h3>
            <div style="display: flex">
              <el-avatar @click="toInformation" style="cursor: pointer">
                {{ currentPhoto.uid }}
              </el-avatar>
              <h2>{{ currentPhoto.uid }}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { Position } from '@element-plus/icons-vue';
import { mainStore } from '@/store';
import { useRouter, useRoute } from 'vue-router';

const dialogVisible = ref(false);
let textareaValue = ref('');
const router = useRouter();
const route = useRoute();
const store = mainStore();
const $api = inject('$api');

const currentPhoto = ref({}); //保存当前页面信息
const urls = ref([]);
const state = reactive({
  comment: [
    {
      user: {
        uname: 'asd',
      },
      content: 'SAA',
    },
  ],
  srcList: [],
  followFl: [],
  likeMsg: {},
});
onBeforeUnmount(() => {
  textareaValue.value = '';
});
onMounted(() => {
  getPhotoDetail(route.params.fid);
  getPhotoComment(route.params.fid);
});

// const urls = computed(() => {
//   console.log(currentPhoto.value);
//   return currentPhoto.value.furl.spilt(';');
// });

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
    console.log(currentPhoto.value);
  }
};
//跳转作者详情页
const toInformation = () => {
  //   if (props.dialogConfig.dialogItem.uptime == '') return;
  //   let uid = props.dialogConfig.dialogItem.upid || 0;
  //   router.push({
  //     path: `/users/Means/${uid}/up`,
  //   });
};
//跳转作者详情页
const toContentInformation = id => {
  //   if (props.dialogConfig.dialogItem.uptime == '') return;
  //   console.log(id);
  //   router.push({
  //     path: `/users/Means/${id}/up`,
  //   });
};

const showSrc = computed(() => {
  //   if (props.dialogConfig.dialogItem.purl) {
  //     return 'http://wphoto.top/' + props.dialogConfig.dialogItem.purl;
  //   } else {
  //     return props.dialogConfig.dialogItem.previewSrc[0];
  //   }
});
//获取更新
// watch(
//   () => props.dialogConfig.dialogItem,
//   (newVal, oldVal) => {
//     state.likeMsg = newVal;
//     nextTick(() => {
//       randomColorToDom('.container');
//     });
//     state.srcList = newVal.previewSrc || ['http://wphoto.top/' + newVal.purl];
//     console.log(state.srcList);
//     if (newVal.uptime != '') {
//       getPhotoComment(newVal.pid);
//       getPhotoDetail(newVal.pid);
//       getFollowMsg(newVal.upid);
//     }
//   },
//   { deep: true }
// );
//dialogMain获取关注
const getFollowMsg = async id => {};
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

//DialogMain关注or取关
const toFollow = async () => {};
//导航
const goAddress = () => {
  const adres = currentPhoto.value.faddress || '';
  dialogVisible.value = true;
  console.log(adres);
};
</script>

<style scoped>
.container {
  padding: 0 50px;
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
}

.photo-action {
  display: flex;
  justify-content: space-between;
  padding: 2px 10px;
  border-bottom: 1px solid #ded2d2;
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
  padding: 4px 0;
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
  border: 1px solid #eee;
  border-radius: 2px;
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
  border-radius: 2px;
  padding: 0 20px 20px 20px;
}
.author div h2 {
  margin: 0;
  padding: 0 10px;
}
</style>
