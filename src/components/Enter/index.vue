<template>
  <div class="LoginIndex">
    <el-dialog
      :modelValue="store.loginBoolean"
      width="600px"
      :title="`${store.loginOrSign ? '登录' : '注册'}`"
      center
      @close="closeHandle"
    >
      <LoginF v-if="store.loginOrSign" />
      <RegisterF v-else />
    </el-dialog>
  </div>
</template>

<script setup>
import LoginF from './Login.vue';
import RegisterF from './Register.vue';
import { mainStore } from '@/store';

const store = mainStore();
const closeHandle = () => {
  store.loginBoolean = false;
};
</script>
