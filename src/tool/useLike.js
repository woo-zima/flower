import { ref, reactive, toRefs } from 'vue';
import $api from '@/api';

export default function (id = 0, id2 = 0) {
  const like = reactive({
    uid: id,
    fid: id2,
  });
  const linkLike = async () => {
    const res = await $api.user.updateLikeById(like.uid, like.fid);
    if (res.status == 200) {
      ElMessage({
        showClose: true,
        message: res.data.msg,
        type: 'success',
      });
    } else {
      ElMessage({
        showClose: true,
        message: '系统出错QAQ',
        type: 'error',
      });
    }
  };
  return {
    ...toRefs(like),
    linkLike,
  };
}
