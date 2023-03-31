<template>
  <div class="result-list-wrapper" ref="resultWrapper">
    <ul class="result-list address" :data="result">
      <li
        class="result-item address"
        v-for="(item, index) in result"
        :key="item.index"
        @click="setLocation(item)"
        ref="resultItem"
      >
        <p class="result-name address" :class="{ active: index === activeIndex }">
          {{ item.name }}
        </p>
        <template v-if="item.address instanceof Array">
          <p class="result-adress address">{{ item.district }}</p>
        </template>
        <template v-else>
          <p class="result-adress address">{{ item.address }}</p>
        </template>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { defineProps, ref, onMounted } from 'vue';

const props = defineProps({
  result: {
    type: Array,
    default: null,
  },
  left: {
    // 输入框的offsetLeft
    type: Number,
    default: 0,
  },
  top: {
    // 输入框的offsetTop
    type: Number,
    default: 0,
  },
  width: {
    // 输入框的宽
    type: Number,
    default: 0,
  },
  height: {
    // 输入框的高
    type: Number,
    default: 0,
  },
});
const emit = defineEmits(['getLocation']);
const activeIndex = ref(0);
const resultWrapper = ref(null);
onMounted(() => {
  initPos();
  document.addEventListener('keydown', keydownSelect, false);
});
// 选择下拉的地址
const setLocation = item => {
  emit('getLocation', item);
};
// 初始化地址搜索下拉框位置
const initPos = () => {
  let body = document.getElementsByTagName('body');
  if (body) {
    body[0].appendChild(resultWrapper.value);
    let clientHeight = document.documentElement.clientHeight;
    let wrapHeight = 0;
    if (props.result && props.result.length > 5) {
      wrapHeight = 250;
    } else if (props.result && props.result.length <= 5) {
      wrapHeight = props.result.length * 50;
    }
    if (clientHeight - props.top < wrapHeight) {
      // 如果div高度超出底部，div往上移（减去div高度+input高度）
      resultWrapper.value.style.top = props.top - wrapHeight - props.height + 'px';
    } else {
      resultWrapper.value.style.top = props.top + 'px';
    }
    resultWrapper.value.style.left = props.left + 'px';
    resultWrapper.value.style.width = props.width + 'px';
  }
};
// 窗口resize时改变下拉框的位置
const changePost = (left, top, width, height) => {
  let clientHeight = document.documentElement.clientHeight;
  let wrapHeight = 0;
  if (result && result.length > 5) {
    wrapHeight = 250;
  } else if (result && result.length <= 5) {
    wrapHeight = result.length * 50;
  }
  if (clientHeight - top < wrapHeight) {
    // 如果div高度超出底部，div往上移（减去div高度+input高度）
    resultWrapper.value.style.top = top - wrapHeight - height + 'px';
  } else {
    resultWrapper.value.style.top = top + 'px';
  }
  resultWrapper.value.style.left = left + 'px';
  resultWrapper.value.style.width = width + 'px';
};
// 监听键盘上下方向键并激活当前选项
const keydownSelect = event => {
  let e = event || window.event || arguments.callee.caller.arguments[0];
  if (e && e.keyCode === 38) {
    //上
    if (resultWrapper.value) {
      let items = resultWrapper.value.querySelectorAll('.result-item');
      if (items && items.length > 0) {
        activeIndex.value--;
        // 滚动条往上滚动
        if (activeIndex.value < 5) {
          resultWrapper.value.scrollTop = 0;
        }
        if (activeIndex.value === 5) {
          resultWrapper.value.scrollTop = 250;
        }
        if (activeIndex.value === -1) {
          activeIndex.value = 0;
        }
      }
    }
  } else if (e && e.keyCode === 40) {
    //下
    if (resultWrapper.value) {
      let items = resultWrapper.value.querySelectorAll('.result-item');
      if (items && items.length > 0) {
        activeIndex.value++;
        // 滚动条往下滚动
        if (activeIndex.value === 5) {
          resultWrapper.value.scrollTop = 250;
        }
        if (activeIndex.value === 9) {
          // 防止最后一条数据显示不全
          resultWrapper.value.scrollTop = 300;
        }
        if (activeIndex.value === items.length) {
          activeIndex.value = 0;
          resultWrapper.value.scrollTop = 0;
        }
      }
    }
  } else if (e && e.keyCode === 13) {
    // 监听回车事件，并获取当前选中的地址的经纬度等信息
    if (result && result.length > activeIndex.value) {
      setLocation(result[activeIndex.value]);
    }
  }
};
</script>
<style scoped>
.result-list-wrapper {
  position: absolute;
  max-height: 250px;
  overflow: auto;
  z-index: 9999;
  border: 1px solid #ccc;
  background-color: #fff;
}

.result-list .result-item {
  padding: 5px;
  color: #666;
  border-bottom: 1px solid #ccc;
}

.result-list .result-item:hover {
  background-color: #f5f5f5;
  cursor: pointer;
}
</style>
