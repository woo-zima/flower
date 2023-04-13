<template>
  <div id="load-content">
    <div class="photoUp">
      <div class="upContainer">
        <div class="upLeft">
          <el-upload
            ref="uploadFile"
            list-type="picture-card"
            multiple
            :action="state.uploadUrl"
            :on-change="changFile"
            :auto-upload="false"
            accept="image/jpeg,image/gif,image/png,image/bmp"
            :on-success="handleAvatarSuccess"
            :on-error="uploadError"
            :before-upload="beforeAvatarUpload"
            :limit="6"
          >
            <el-icon><Plus /></el-icon>

            <template #file="{ file }">
              <div>
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <el-icon><zoom-in /></el-icon>
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleDownload(file)"
                  >
                    <el-icon><Download /></el-icon>
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <el-icon><Delete /></el-icon>
                  </span>
                </span>
              </div>
            </template>
            <template #tip>
              <div class="el-upload__tip">jpg/png 文件最大不能超过2MB,最多支持上传6张</div>
            </template>
          </el-upload>
        </div>
      </div>

      <div class="previewP">
        <div class="upRight setP">
          <el-form ref="uploadForm" :model="state.uploadFormData" :rules="rules">
            <el-form-item prop="ptitle" class="scroll-itme" label="标题">
              <el-input
                v-model="state.uploadFormData.ptitle"
                clearable
                class="P_input"
                size="large"
                placeholder="起个吸引人的标题吧"
              />
            </el-form-item>
            <el-config-provider :locale="locale">
              <el-form-item class="scroll-itme" prop="moon" label="月份">
                <el-date-picker
                  v-model="state.uploadFormData.moon"
                  value-format="YYYYMMDD"
                  type="date"
                  placeholder="赏花月份"
                  size="large"
                  :disabledDate="disabledDate"
                  @change="changeDate"
                />
              </el-form-item>
            </el-config-provider>
            <el-form-item class="scroll-itme" prop="pdescribe" label="简介">
              <el-input
                v-model="state.uploadFormData.pdescribe"
                clearable
                class="P_input"
                size="large"
                type="textarea"
                :rows="5"
                placeholder="说说你对景点的看法。"
              />
            </el-form-item>
            <el-form-item class="scroll-item" prop="ptag" label="花品种">
              <el-select
                v-model="state.uploadFormData.ptag"
                filterable
                clearable
                allow-create
                default-first-option
                :reserve-keyword="false"
                placeholder="选择/输入新建花的品种"
              >
                <el-option
                  v-for="item in tagOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <MapPlaceInput ref="mapPlaceInput"></MapPlaceInput>
          <div>
            <el-button type="primary" @click="onSubmit(uploadForm)">上传</el-button>
            <el-button @click="resetForm(uploadForm)">取消</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <el-dialog v-model="dialogVisible">
    <img style="width: 100%" w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
  <!-- <Cropper :cropperInfo="cropperInfo" />
  <DialogMain :dialogConfig="state.dialogConfig" /> -->
</template>

<script setup>
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import { computed, inject, onMounted, reactive, ref, toRefs } from 'vue';
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue';
import { mainStore } from '@/store';

const locale = ref(zhCn);

const dialogImageUrl = ref('');
const dialogVisible = ref(false);
const disabled = ref(false);
const mapPlaceInput = ref(null); //获取子组件实例
const store = mainStore();
const uploadForm = ref();
const uploadFile = ref(null);
let imgFileFlag = {};
const state = reactive({
  uploadUrl: 'http://up-as0.qiniup.com',
  uploadFormData: {
    pname: '',
    moon: '',
    pdescribe: '',
    ptag: '',
    padress: '',
    uptime: new Date(),
    photoObj: [],
  },
});
const tagOptions = ref([]);
const $api = inject('$api');
const rules = reactive({
  ptitle: [{ required: true, message: '请输入作品标题', trigger: 'blur' }],
  moon: [{ required: true, message: '请输入月份', trigger: 'blur' }],
  pdescribe: [{ required: true, message: '请发布看法', trigger: 'blur' }],
});

onMounted(() => {
  //getToken();
  getTagOptions();
});
//获取品种类型
const getTagOptions = async () => {
  const res = await $api.photo.getTagOptions();
  if (res.status == 200) {
    res.data.forEach((item, i) => {
      tagOptions.value.push({ value: item.tdesp, label: item.tdesp });
    });
  } else {
    tagOptions.value.push({ value: null, label: '暂无数据' });
  }
  tagOptions.value.splice(9, tagOptions.value.length);
};
//删除照片项
const handleRemove = file => {
  state.uploadFormData.photoObj = state.uploadFormData.photoObj.filter(item => {
    return item.uid !== file.uid;
  });

  uploadFile.value.handleRemove(file);
  console.log(state.uploadFormData.photoObj);
};

const handlePictureCardPreview = file => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};

const handleDownload = file => {
  console.log(file);
};
//设置当前日期之后不能选
const disabledDate = time => {
  return time.getTime() > Date.now();
};

const changeDate = () => {
  console.log(state.uploadFormData.moon);
};

const changFile = (file, fileList) => {
  state.uploadFormData.photoObj.push(file.raw);
  const isPNG = file.raw.type === 'image/png';
  const isJPEG = file.raw.type === 'image/jpeg';
  const isJPG = file.raw.type === 'image/jpg';
  const isLt2M = file.raw.size / 1024 / 1024 < 2;
  if (!isPNG && !isJPEG && !isJPG) {
    ElMessage({
      showClose: true,
      message: '上传头像图片只能是 jpg、png、jpeg 格式!',
      type: 'error',
    });
    return false;
  }
  if (!isLt2M) {
    ElMessage({
      showClose: true,
      message: '上传头像图片大小不能超过 2MB!',
      type: 'error',
    });
    return false;
  }
  if (fileList.length > 5) {
    ElMessage({
      showClose: true,
      message: '上传文件最大数量为5!',
      type: 'error',
    });
    return false;
  }
  imgFileFlag = file;
  // console.log(uploadFile);
};
const handleAvatarSuccess = (res, file, fileList) => {
  console.log('上传成功', res, file, fileList);
  resetForm('uploadForm');
};

const beforeAvatarUpload = file => {
  console.log('before', file, typeof file);
};

//封装上传图片
const uploadPhoto = async file => {
  const pObj = toRefs(state.uploadFormData.photoObj);
  const formdata = new FormData();
  formdata.set('uid', store.userDeail.uid);
  formdata.set('fdesp', file.pdescribe);
  formdata.set('ftitle', file.ptitle);
  formdata.set('fmoon', file.moon);
  formdata.set('ftag', file.ptag);
  formdata.set('faddress', file.padress);
  for (let i = 0; i < pObj.length; i++) {
    formdata.append('images', pObj[i].value);
  }
  const res = await $api.photo.addPhoto(formdata);
  if (res.status === 201) {
    ElMessage({
      showClose: true,
      message: '上传成功',
      type: 'success',
    });
    resetForm('uploadForm');
  } else {
    ElMessage({
      showClose: true,
      message: res.data,
      type: 'error',
    });
  }
};

const uploadError = (err, file, fileList) => {
  console.log(err);
};
const onSubmit = async Form => {
  if (!Form) return;
  if (Object.keys(imgFileFlag).length === 0) {
    ElMessage({
      showClose: true,
      message: '还未选择图片！',
      type: 'error',
    });
    return;
  }
  mapPlaceInput.value.validatePlace();
  Form.validate(valid => {
    if (valid) {
      // uploadFile.value.submit();
      state.uploadFormData.padress = mapPlaceInput.value.sname;
      uploadPhoto(state.uploadFormData);
      // console.log(state.uploadMsgForm);
    } else {
      return false;
    }
  });
};
const resetForm = formEl => {
  if (!formEl) return;
  formEl.resetFields();
  mapPlaceInput.value.deletePlace();
};
</script>

<style scoped>
#load-content {
  margin-left: auto;
  margin-right: auto;
  width: 100%;
  height: calc(100vh - 120px);
  padding-bottom: 20px;
}
.photoUp {
  max-width: 100%;
  display: flex;
  justify-content: space-around;
  margin: 30px;
}
.photoUp .upContainer {
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  flex-direction: column;
  justify-content: center;
  min-width: 300px;
  background: #fff;
  box-shadow: 0 1px 5px #c7c7c7;
  min-height: calc(100vh - 55px - 60px);
  width: 60%;
  z-index: 1;
}
.previewP {
  height: 100%;
  margin-left: 20px;
  min-width: 240px;
  position: -webkit-sticky;
  position: sticky;
  top: 50px;
  width: 400px;
}
.previewP .setP {
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 1px 5px #c7c7c7;
  display: -webkit-box;
  display: flex;
  flex-basis: 100%;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  flex-flow: row wrap;
  padding: 20px 15px 10px;
}

.previewP span {
  cursor: pointer;
}
.upContainer .upLeft {
  padding: 0 7.1%;
  text-align: center;
}
.upLeft .previewList img {
  width: 50%;
}
.previewP .preview {
  padding: 4px 8px;
  margin-left: 5px;
  border: 1px solid;
  border-radius: 4px;
  color: #fff;
  background-color: #202d40;
}

.upRight {
  margin-top: 50px;
}
.upRight .P_input {
  min-width: 100px;
}

/* @media screen and (max-width: 730px) {
  .upRight .P_input {
    width: 50%;
  }
} */
@media screen and (max-width: 600px) {
  .previewP {
    min-width: 130px;
  }
  .scroll-itme {
    display: block;
  }
  .el-checkbox-button span {
    padding: 8px 7px;
  }
}
</style>
