<template>
  <div class="not-found">
    <h1>404</h1>
    <p>抱歉，页面未找到</p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<style scoped>
.not-found {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: #ded2d2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 48px;
  text-align: center;
}

.not-found h1 {
  margin-bottom: 20px;
  font-weight: bold;
  color: #acb;
}

.not-found p {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}
.not-found a {
  color: #acb;
}
</style>
