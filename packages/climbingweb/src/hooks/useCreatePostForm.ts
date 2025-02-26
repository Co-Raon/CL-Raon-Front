import { RootState } from '../store/slices/index';
import { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  deleteReduxPostImageList,
  PostImage,
  setReduxPostData,
  addReduxPostImage,
  initReduxPost,
  addReduxDeleteImage,
} from '../store/slices/createFeed';
import { bindActionCreators } from 'redux';

const MAX_COUNT = 10;

export const useCreatePostForm = () => {
  const { postData, postImageList, deleteQueue } = useSelector(
    (state: RootState) => state.createFeed
  );

  const dispatch = useDispatch();
  const boundActionCreators = useMemo(
    () =>
      bindActionCreators(
        {
          setReduxPostData,
          addReduxPostImage,
          deleteReduxPostImageList,
          initReduxPost,
          addReduxDeleteImage,
        },
        dispatch
      ),
    [dispatch]
  );

  const {
    setReduxPostData: setPostData,
    addReduxPostImage: addPostImage,
    deleteReduxPostImageList: deletePostImageList,
    initReduxPost: initPost,
    addReduxDeleteImage: addDeleteImage,
  } = boundActionCreators;

  const selectImageList = (files: File[]) => {
    // 최대 개수 초과 시 입력 방지
    if (postImageList.length + files.length > MAX_COUNT) {
      alert('최대 개수를 초과하였습니다.');
      return;
    }
    files.forEach((file) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result?.toString();
        if (base64) {
          const image: PostImage = {
            file,
            thumbNail: base64,
          };
          addPostImage(image);
        }
      };
    });
  };

  const deleteImageList = (id: number) => {
    deletePostImageList(id);
  };

  const addExistedImageList = useCallback((urls: string[]) => {
    urls.forEach((url) => {
      console.log(`url: ${url}`);
      const existedImage: PostImage = {
        file: null,
        thumbNail: url,
      };
      addPostImage(existedImage);
    });
  }, []);
  const addDeleteQueue = useCallback((url: string) => {
    addDeleteImage(url);
  }, []);

  return {
    postData,
    setPostData,
    postImageList,
    selectImageList,
    deleteImageList,
    initPost,
    addExistedImageList,
    addDeleteQueue,
    deleteQueue,
  };
};
