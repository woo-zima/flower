<template>
  <div class="container" style="height: calc(100vh - 60px)" @scroll="handleScroll" ref="container">
    <div class="virtualList" :style="{ top: listTop }">
      <div v-for="item in showData" :key="item.id" :style="{ height: listSize + 'px' }">
        {{ item.content }}
      </div>

      <!-- 用于撑开高度的元素 -->
      <div class="bar" :style="{ height: barHeight }"></div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, reactive, ref, computed, toRefs } from 'vue';

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
// 使用 toRefs 包裹 props，让解构获得的父组件传递的参数变为响应式的
const { photoList, listSize, showList } = toRefs(props);

const container = ref(null); // 页面 container 节点
const start = ref(0); //开始下标
const end = ref(showList.value); //结束下标

const showData = computed(() => photoList.value.slice(start.value, end.value)); // 最终筛选出的要展示的数据
//const containerHeight = computed(() => listSize.value * showList.value + 'px'); // 容器的高度
const barHeight = computed(
  () => listSize.value * photoList.value.length - start.value * listSize.value + 'px'
); // 撑开容器内容高度的元素的高度
const listTop = computed(() => start.value * listSize.value + 'px'); // 列表向上滚动时要动态改变 top 值

// 容器的滚动事件
const handleScroll = () => {
  // 获取容器顶部滚动的尺寸
  const scrollTop = container.value.scrollTop;
  // 计算卷去的数据条数，用计算的结果作为获取数据的起始和结束下标
  // 起始的下标就是卷去的数据条数，向下取整
  start.value = Math.floor(scrollTop / listSize.value);
  // 结束的下标就是起始的下标加上要展示的数据条数
  end.value = start.value + showList.value;
  //更新撑开元素高度
};
</script>

<style scoped>
.container {
  position: relative;
  overflow-y: scroll;
  width: 100%;
  font-size: 20px;
  font-weight: bold;
  line-height: 60px;
}
.virtualList {
  position: absolute;
  top: 0;
  width: 100%;
}
.photoList {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.cover_photo {
  height: 320px;
  width: 320px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ded2d2;
}
.cover_photo img {
  width: 100%;
}
</style>
