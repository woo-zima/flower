<template>
  <div class="HeaderBar">
    <el-row justify="space-around" style="width: 100%">
      <el-col class="header-info" :lg="10" :sm="10" :xs="8">
        <div class="g_btn">
          <el-button @click="goHome">主页</el-button>
          <el-button @click="goUpLoad">上传</el-button>
        </div>
      </el-col>
      <el-col class="header-info" :lg="10" :sm="10" :xs="8">
        <el-input
          type="text"
          class="searchInput"
          v-model="state.query.keywords"
          clearable
          :prefix-icon="Search"
          placeholder="搜索"
          @change="handleSearch"
        ></el-input>
      </el-col>

      <el-col class="header-info" :lg="4" :sm="4" :xs="4">
        <div>
          <div v-if="store.showUser">
            <el-dropdown @command="clickMenu">
              <el-avatar
                style="cursor: pointer"
                fit="cover"
                src="http://wphoto.top/FvqbmQo3qldO7dsZXI98AkkJ16RC"
              >
                {{ store.userDeail.uname }}
              </el-avatar>

              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="item of MenuList"
                    :key="item.name"
                    :command="item.handler"
                    :divided="item.divided"
                  >
                    {{ item.name }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div v-else>
            <span class="button-text" @click="login">登录</span>
            <span class="button-text" @click="signUp">注册</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue';
import { inject, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { mainStore } from '@/store';

const router = useRouter();
const $api = inject('$api');
const store = mainStore();
const state = reactive({
  query: {
    keywords: '',
  },
  user: {
    userId: '',
  },
});

onMounted(() => {});

const MenuList = computed(() => {
  return [
    {
      name: '个人资料',
      handler: 'information',
    },
    {
      name: '设置',
      handler: 'setting',
    },
    {
      name: '退出',
      handler: 'logOut',
      divided: true,
    },
  ];
});
const clickMenu = type => {
  switch (type) {
    case 'information':
      toInformation();
      break;
    case 'setting':
      setModel();
      break;
    case 'logOut':
      logOut();
      break;
    default:
      break;
  }
};
//跳转上传页
const goUpLoad = () => {
  if (!store.showUser) {
    ElMessage({
      showClose: true,
      message: '请先登录吧！',
      type: 'info',
    });
    return;
  }
  router.push({
    path: `/upload`,
  });
};
const goHome = () => {
  router.push({
    path: `/`,
  });
};

const handleSearch = () => {
  if (!store.userDeail.uname) {
    ElMessage({
      showClose: true,
      message: '未登录!',
      type: 'info',
    });
    return;
  }
  router.replace({
    path: '/searchAll',
    query: { keywords: state.query.keywords },
  });
};

const setModel = () => {
  router.push({
    path: `/setUp`,
  });
};
const toInformation = () => {
  let uid = store.userDeail.uid || 0;
  router.push({
    path: `/info/${uid}`,
    query: new Date(),
  });
};

const login = () => {
  store.LoginBoolean(true);
  store.LoginOrSign(true);
};

const signUp = () => {
  store.LoginBoolean(true);
  store.LoginOrSign(false);
};
const logOut = () => {
  console.log(store.showUser);
  localStorage.clear();
  store.setUserInfo({});
  router.push({
    path: `/`,
  });
};
</script>

<style scoped>
.HeaderBar {
  background-color: #fff;
  height: 100%;
  width: 100%;
  display: flex;
  overflow: hidden;
  box-shadow: rgb(0 0 0 / 20%) 0px -2px 6px;
}

.header-info {
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-text {
  line-height: 28px;
  text-align: center;
  text-decoration: none;
  color: #e06666;
  font-size: 16px;
  margin: 0 12px 0 0;
  border-radius: 5px;
  background: #fff;
  border-radius: 2px;
  text-decoration: none;
  padding: 5px 12px;
  cursor: pointer;
}
.searchInput {
  max-width: 220px;
}
</style>
