import { CommentCreateRequest } from 'climbingweb/types/request/post';
import { useState } from 'react';

interface CommentInputProps {
  refObj: React.RefObject<HTMLTextAreaElement>;
  parentCommentId?: string;
  onClickSubmit: (request: CommentCreateRequest) => void;
}

export const CommentInput = ({
  refObj,
  parentCommentId,
  onClickSubmit,
}: CommentInputProps) => {
  const INPUT_FONT_SIZE = 14;
  //등록 버튼 클릭 핸들러
  const [inputFocus, setInputFocus] = useState<boolean>(false);

  const handleInputFocus = () => {
    setInputFocus(true);
  };

  const handleInputFieldBlur = () => {
    //임시: blur 이벤트가 발생한 후에 inputFocus 를 false 로 변경하기 위해 setTimeout 사용
    setTimeout(() => setInputFocus(false), 0);
  };

  const handleSubmitButtonClick = () => {
    const content = refObj.current?.value;
    if (content) {
      onClickSubmit({
        parentCommentId: parentCommentId,
        content: refObj.current?.value,
      });
      refObj.current.value = '';
    }
    setInputFocus(false);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    if (textarea.scrollHeight > INPUT_FONT_SIZE * 5) {
      return;
    }
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  return (
    <div className={'bg-gray-100 w-full flex p-4 fixed bottom-0 mb-footer '}>
      <div
        className={`w-full z-10 border-[1px] rounded-lg bg-white flex ${
          inputFocus ? 'border-purple-500' : 'border-gray-300'
        }`}
      >
        <textarea
          ref={refObj}
          className="w-full m-4 resize-none focus:outline-none text-sm"
          placeholder={'댓글을 입력해 주세요.'}
          onFocus={handleInputFocus}
          onBlur={handleInputFieldBlur}
          onChange={handleTextareaChange}
          rows={1}
        />
        {inputFocus ? (
          <button
            className="bg-white min-w-max text-purple-500 rounded-lg p-4 mx-1 text-sm font-bold"
            onClick={handleSubmitButtonClick}
          >
            등록
          </button>
        ) : null}
      </div>
    </div>
  );
};
