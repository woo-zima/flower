import instance from '../base';

export function addComment(data) {
  return instance.post('comment/addComment', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function getPhotoComment(id) {
  return instance({
    url: 'comment/getCommentByFid',
    method: 'get',
    params: {
      fid: id,
    },
  });
}
