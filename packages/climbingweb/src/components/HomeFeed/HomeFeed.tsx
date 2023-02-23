import React, { useCallback } from 'react';
import FeedContent from './FeedContent/FeedContent';
import FeedHeader from './FeedHeader/FeedHeader';
import FeedSectorInfo from './FeedSectorInfo/FeedSectorInfo';
import ImageSlider from '../ImageSlider/ImageSlider';
import { PostDetailResponse } from 'climbingweb/types/response/post';
import { UserPostDetailResponse } from 'climbingweb/types/response/laon';
import ErrorContent from '../common/Error/ErrorContent';
import { useRouter } from 'next/router';
import {
  useCreateLike,
  useDeleteLike,
  useFindAllParentComment,
} from 'climbingweb/src/hooks/queries/post/queryKey';
import { FeedSkeleton } from '../common/skeleton/FeedSkeleton';

interface HomeFeedProps {
  postData: PostDetailResponse | UserPostDetailResponse;
  onChangePostId?: (id: string) => void;
  openBtSheet: () => void;
}

const HomeFeed = ({ postData, openBtSheet, onChangePostId }: HomeFeedProps) => {
  const router = useRouter();

  //피드 댓글 정보 fetch useQuery
  const {
    data: commentData,
    isError: isCommentError,
    error: commentError,
  } = useFindAllParentComment(postData.postId);

  //좋아요 추가 useMutation
  const { mutate: createLikeMutate } = useCreateLike(postData.postId);

  //좋아요 취소 useMutation
  const { mutate: deleteLikeMutate } = useDeleteLike(postData.postId);

  //redux에 postData를 저장하기 위하여 postData를 PostCreateRequest로 변환
  const responseToRequest: PostDetailRequest = useMemo(
    () => ({
      centerId: postData.centerId,
      climbingHistories: postData.climbingHistories.map((history) => ({
        climbingCount: history.climbingCount,
        holdId: history.holdId,
      })),
      content: postData.content,
      contentsList: postData.contentsList.map((c) => ({ url: c })),
      postId: postData.postId,
      centerName: postData.centerName,
    }),
    [postData]
  );

  //좋아요 아이콘 클릭 핸들러
  const handleLikeButtonClick = () => {
    if (postData.isLike) {
      deleteLikeMutate();
    } else {
      createLikeMutate();
    }
  };

  //댓글 더보기 클릭 핸들러
  const handleMoreCommentClick = () => {
    router.push(`/feed/${postData.postId}/comments`);
  };

  //옵션 도트 클릭 핸들러
  const handleOptionDotClick = useCallback(() => {
    openBtSheet();
    if (onChangePostId) onChangePostId(postData.postId);
  }, [postData]);

  if (isCommentError) return <ErrorContent error={commentError} />;

  if (commentData)
    return (
      <section className={'w-full mb-[17px]'}>
        <FeedHeader
          userImage={postData.userProfile}
          userName={postData.userNickname}
          userLocation={postData.centerName}
          handleOptionDotClick={handleOptionDotClick}
        />
        <ImageSlider imageList={postData.contentsList} />
        <FeedSectorInfo holdList={postData.climbingHistories} />
        <FeedContent
          isLiked={postData.isLike}
          likeCount={postData.likeCount}
          createdAt={postData.createdAt}
          content={postData.content}
          replyCount={commentData.pages[0].totalCount}
          onClickHeartIcon={handleLikeButtonClick}
          onClickMoreComment={handleMoreCommentClick}
        ></FeedContent>
      </section>
    );

  return <FeedSkeleton />;
};

export default HomeFeed;
