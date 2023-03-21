<template>
  <div class="HeaderBar">
    <el-row justify="space-around" style="width: 100%">
      <el-col class="header-info" :lg="10" :sm="10" :xs="8">
        <el-button type="primary">Upload</el-button>
      </el-col>
      <el-col class="header-info" :lg="10" :sm="10" :xs="8">
        <el-autocomplete
          v-model="state.params.key"
          :debounce="300"
          :fetch-suggestions="querySearch"
          :maxlength="40"
          class="input-with-select"
          placeholder="搜索"
          @select="handleSearch"
        ></el-autocomplete>
      </el-col>

      <el-col class="header-info" :lg="4" :sm="4" :xs="4">
        <div>
          <div v-if="store.showUser">
            <el-dropdown @command="clickMenu">
              <div>
                <el-avatar fit="cover" shape="square">
                  {{ store.userDeail.uname }}
                </el-avatar>
              </div>
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
import { inject, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { mainStore } from '@/store';

const router = useRouter();
const $api = inject('$api');
const store = mainStore();
const state = reactive({
  params: {
    key: '',
  },
  user: {
    userId: '',
  },
  queryList: [],
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
const querySearch = async (queryString, cb) => {
  state.queryList = [];
  if (queryString.length > 0) {
    const queryParams = { queryValue: queryString };
    const { data, status } = await $api.photo.getKeyWorlds(queryParams);
    if (status === 200) {
      // state.queryList = data.map((i) => {
      state.queryList.push({
        value: data.pdescribe.split(' ')[0],
      });
      // })
      cb(state.queryList);
    } else {
      cb(state.queryList);
    }
  } else {
    cb(state.queryList);
  }
};

const handleSearch = item => {
  console.log(item);
  router.replace({
    path: '/keyPhotos',
    query: { key: item.value },
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
    path: `/users/Means/${uid}/up`,
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

.input-with-select {
  padding-top: 12px;
  width: 40vw;
  background-color: #fff;
}

.input-with-select:hover {
  background-color: rgba(0, 0, 0, 0.08);
}

.header-info {
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-text {
  width: 72px;
  height: 30px;
  line-height: 28px;
  text-align: center;
  text-decoration: none;
  color: #fff;
  font-size: 16px;
  margin: 0 12px 0 0;
  background: #202d40;
  border-radius: 2px;
  text-decoration: none;
  padding: 5px 12px;
  cursor: pointer;
}
</style>
