<template>
  <div class="Register">
    <el-form
      ref="registerForm"
      :model="state"
      status-icon
      :rules="rules"
      label-width="80px"
      label-position="left"
    >
      <el-form-item label="账号" prop="username">
        <el-input v-model="state.username" />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input
          v-model="state.password"
          :maxlength="20"
          show-password
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input v-model="state.checkPass" type="password" autocomplete="off" />
      </el-form-item>

      <el-form-item label="验证码" prop="code">
        <el-row type="flex" justify="space-between" :gutter="16">
          <el-col>
            <el-input
              v-model="state.code"
              :maxlength="4"
              @keyup.enter.native="submitForm('loginForm')"
            >
              <template #append>
                <img style="width: 90px" :src="imageBase64" @click.stop="getCode" />
              </template>
            </el-input>
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm(registerForm)">注册</el-button>
        <el-button @click="resetForm(registerForm)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { inject, reactive, ref } from 'vue';
import { mainStore } from '@/store';

const $api = inject('$api');
const store = mainStore();
const state = reactive({
  username: '',
  password: '',
  checkPass: '',
  code: '',
});
const registerForm = ref();
const imageBase64 = ref('http://localhost:3000/user/getcode?t=' + Math.floor(Math.random() * 100));
const getCode = () => {
  imageBase64.value = 'http://localhost:3000/user/getcode?t=' + Math.floor(Math.random() * 100);
};
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== state.password) {
    callback(new Error('两次输入不一致!'));
  } else {
    callback();
  }
};
const rules = reactive({
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  checkPass: [{ required: true, validator: validatePass, trigger: 'blur' }],
  code: [{ required: true, message: '请输入图片验证码', trigger: 'blur' }],
});

const submitForm = formEl => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      register(formEl);
      console.log('submit!');
    } else {
      console.log('error submit!');
      return false;
    }
  });
};
const register = async formEl => {
  const registerForm = {
    username: state.username,
    password: state.password,
    code: state.code,
  };
  console.log(registerForm);
  const res = await $api.user.register(registerForm);
  console.log(res);
  if (res.data.status === 200) {
    // resetForm(formEl);
    store.LoginBoolean(false);
    ElMessage({
      showClose: true,
      message: res.data.msg,
      type: 'success',
    });
  } else {
    // resetForm(formEl);
    store.LoginBoolean(false);
    ElMessage({
      showClose: true,
      message: res.data.msg,
      type: 'error',
    });
  }
};
</script>

<style>
.Register {
  display: flex;
  justify-content: center;
  align-items: center;
}

.Register .el-form {
  width: 266.5px;
}
</style>
