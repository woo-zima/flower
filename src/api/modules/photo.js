import instance from '../base';

export function addPhoto(data) {
  return instance.post('/upload', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
