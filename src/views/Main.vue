<template>
  <el-config-provider :locale="locale">
    <div class="main_container Main">
      <div class="block">
        <el-date-picker v-model="monthValue" type="month" placeholder="选择花期月份" />
      </div>
      <!-- <div class="photo_c">
        <VirtualPhotoList
          :photoList="photoList"
          :listSize="listSize"
          :showList="showList"
        ></VirtualPhotoList>
      </div> -->
    </div>
    <MapPlaceInput></MapPlaceInput>
  </el-config-provider>
</template>

<script setup>
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import { ref, computed } from 'vue';

const locale = ref(zhCn);
const monthValue = ref('');
const listSize = ref(60);
const showList = ref(8);

const photoList = computed(() => {
  return Array(1000)
    .fill('')
    .map((item, index) => ({
      id: index,
      content: '列表项内容' + index,
    }));
});
</script>

<style scoped>
.main_container {
  position: relative;
}
.p_border {
  border-radius: 10px;
  border: 1px solid #ded2d2;
}
.photo_c {
  display: flex;
  /* margin: 20px 20px 0 20px; */
}
</style>
