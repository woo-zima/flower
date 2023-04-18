<template>
  <div class="container" style="height: calc(100vh - 92px)" ref="container">
    <div class="virtualList" v-if="showDataFlag">
      <div
        v-for="(item, index) in showData"
        :key="index"
        :style="{ height: listSize + 'px' }"
        class="Sitem"
      >
        <div v-for="i in item" :key="i.fid" @click="toDetail(i)" class="sitem_it">
          <img :src="'http://localhost:3000/files/' + i.furl" alt="" />
          <div class="ifooter">
            <el-avatar style="cursor: pointer">{{ i.user.uname }}</el-avatar>
            <span class="fname">{{ i.user.uname }}</span>
            <span class="title">
              {{ i.ftitle }}
            </span>
            <span class="time">赏花时间:{{ fliterMoon(i.fmoon) }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else><el-empty description="暂无资源" /></div>
  </div>
</template>

<script setup>
import { defineProps, watch, ref, computed, toRefs } from 'vue';
import { useRouter } from 'vue-router';
const props = defineProps({
  photoList: {
    type: Array,
    required: true,
  },
  listSize: {
    type: Number,
    required: true,
  },
  showList: {
    type: Number,
    required: true,
  },
});
const showDataFlag = ref(false);
const router = useRouter();
// 使用 toRefs 包裹 props，让解构获得的父组件传递的参数变为响应式的
const { photoList, listSize, showList } = toRefs(props);
const container = ref(null); // 页面 container 节点
const showData = computed(() => photoList.value); // 最终筛选出的要展示的数据

watch(
  () => photoList,
  newVal => {
    newVal.value.length === 0 ? (showDataFlag.value = false) : (showDataFlag.value = true);
  },
  {
    deep: true,
  }
);
const toDetail = item => {
  router.push({
    name: 'des',
    params: {
      fid: item.fid,
    },
  });
};
const fliterMoon = moon => {
  return moon.slice(0, 4) + '年' + moon.substring(4, 6) + '月' + moon.substring(6, 8) + '日';
};
</script>

<style scoped>
.container {
  position: relative;
  overflow-y: scroll;
  width: 100%;
}
.virtualList {
  position: absolute;
  top: 0;
  width: 100%;
  /* margin-top: 5px; */
}
.Sitem {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: start;
  margin-bottom: 12px;
}
.Sitem .sitem_it {
  width: 100%;
  max-width: 33%;
  padding: 5px;
  border-radius: 3px;
  cursor: pointer;
}
.Sitem .sitem_it img {
  width: 100%;
  height: 90%;
  border-radius: 10px;
  object-fit: cover;
}
.ifooter {
  position: relative;
}
.ifooter .fname {
  position: absolute;
  left: 41px;
  top: 5px;
}
.ifooter .title {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0px);
}
.ifooter .time {
  font-size: 12px;
  float: right;
}
</style>
