<template>
  <div class="container" style="height: calc(100vh - 92px)" ref="container">
    <div class="virtualList">
      <div
        v-for="(item, index) in showData"
        :key="index"
        :style="{ height: listSize + 'px' }"
        class="Sitem"
      >
        <div v-for="i in item" @click="toDetail(i)" class="sitem_it">
          <img :src="'http://localhost:3000/files/' + i.furl" alt="" />
          <div class="ifooter">
            {{ i.ftitle }}
            <span>赏花时间{{ i.fmoon }}月</span>
          </div>
        </div>
      </div>

      <!-- 用于撑开高度的元素 -->
      <!-- <div class="bar" :style="{ height: barHeight }"></div> -->
    </div>
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
const router = useRouter();
// 使用 toRefs 包裹 props，让解构获得的父组件传递的参数变为响应式的
const { photoList, listSize, showList } = toRefs(props);

const container = ref(null); // 页面 container 节点

const showData = computed(() => photoList.value); // 最终筛选出的要展示的数据
//const containerHeight = computed(() => listSize.value * showList.value + 'px'); // 容器的高度

watch(
  () => photoList.value,
  newVal => {
    // console.log(newVal);
    // console.log(showData);
  },
  { deep: true }
);

// 容器的滚动事件
// const handleScroll = () => {
//   // 获取容器顶部滚动的尺寸
//   const scrollTop = container.value.scrollTop;
//   // 计算卷去的数据条数，用计算的结果作为获取数据的起始和结束下标
//   // 起始的下标就是卷去的数据条数，向下取整
//   start.value = Math.floor(scrollTop / listSize.value);
//   // 结束的下标就是起始的下标加上要展示的数据条数
//   end.value = start.value + showList.value;
//   //更新撑开元素高度
// };
//点击详情页面
const toDetail = item => {
  console.log(item);
  router.push({
    name: 'des',
    params: {
      fid: item.fid,
    },
  });
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
  margin-top: 5px;
}
.Sitem {
  display: flex;
  flex-direction: row;
  justify-content: start;
  margin-bottom: 17px;
}
.Sitem .sitem_it {
  height: 100%;
  padding: 5px;
  border-radius: 3px;
  cursor: pointer;
  border: 1px solid #d8d8d8;
}
.Sitem .sitem_it img {
  height: 90%;
}
.ifooter {
  text-align: center;
}
.ifooter span {
  font-size: 10px;
}
</style>
