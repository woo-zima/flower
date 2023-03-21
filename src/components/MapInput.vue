<template>
  <div>
    <el-form>
      <el-form-item label="地址" :required="true">
        <el-cascader
          size="large"
          ref="addPoint"
          placeholder="请选择"
          :props="City.cityProps"
          :options="City.cityOptions"
          clearable
          v-model="selectedOptions"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" :required="true">
        <el-input :width="300" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import axios from 'axios';

const Mapurl = ref(
  'https://restapi.amap.com/v3/config/district?keywords=&subdistrict=3&extensions=base&key=50d1721190af728bee089d4e78c7958b'
);
const selectedOptions = ref([]);

const City = reactive({
  cityOptions: [],
  cityProps: {
    expandTrigger: 'hover',
    label: 'name',
    value: 'name',
    children: 'districts',
  },
});

onMounted(() => {
  getCity();
});

const getCity = () => {
  axios.get(Mapurl.value).then(res => {
    City.cityOptions = res.data.districts[0].districts;
    console.log(City.cityOptions);
  });
};

const handleChange = value => {
  console.log(value);
};
</script>

<style scoped></style>
