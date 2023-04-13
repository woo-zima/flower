import { ref, reactive, toRefs } from 'vue';
import $api from '@/api';

export default function (id = 0, id2 = 0) {
  const follow = reactive({
    followId: id,
    followedId: id2,
    follow: true,
  });
  const linkFollow = async () => {
    const fid = follow.followId,
      fdid = follow.followedId;
    const res = await $api.user.addFollow(uid, fid);
    if (res.status == 200) {
      ElMessage({
        showClose: true,
        message: res.data,
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
  const cancelFollow = async () => {
    const res = await $api.user.cancelFollowByIds(follow.followId, follow.followedId);
    if (res.status == 200) {
      ElMessage({
        showClose: true,
        message: res.data,
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
    ...toRefs(follow),
    linkFollow,
    cancelFollow,
  };
}
