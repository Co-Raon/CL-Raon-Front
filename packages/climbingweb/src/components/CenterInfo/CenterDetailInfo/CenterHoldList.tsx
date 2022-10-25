import { HoldInfoResponse } from 'climbingweb/src/hooks/queries/center-controller/useFindCenter';
import Image from 'next/image';
import React from 'react';

interface CenterHoldListProps {
  holdInfoList: HoldInfoResponse[];
  holdInfoImg: string;
}

const CenterHoldList = ({ holdInfoList, holdInfoImg }: CenterHoldListProps) => {
  //TODO : 이미지로 보기 클릭 시?
  const handleShowImageButtonClick = () => {
    console.dir(holdInfoImg);
  };
  return (
    <div className="flex flex-col gap-2">
      <div className={'flex justify-between'}>
        <h2 className={'font-semibold text-sm'}>홀드 정보</h2>
        <button
          className={'bg-none text-sm text-purple-500'}
          onClick={handleShowImageButtonClick}
        >
          이미지로 보기
        </button>
      </div>
      <div className={'h-20 flex'}>
        {holdInfoList.map((value, index) => (
          <div
            key={`centerHoldListImage_${index}`}
            className="h-8 w-8 mx-1 relative"
          >
            <Image
              layout="fill"
              objectFit="scale-down"
              src={value.image}
              alt={value.name}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CenterHoldList;