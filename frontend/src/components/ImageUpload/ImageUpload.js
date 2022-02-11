import React, { useState } from "react";
import ReactImageUploading from "react-images-uploading";
import styled from "styled-components";
import { Flex } from "../../globalStyles";

export default function ImageUpload({ image, setImage, style }) { 
const [imgVal, setImgVal] = useState()
  const onChange = (image, addUpdateIndex) => { 
    setImage(image);
    setImgVal(image);
  };
  return (
    <>
      <ReactImageUploading
        value={imgVal}
        onChange={onChange}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          // write your building UI
          <UploadImgWrap
            style={style}
            onClick={onImageUpload}
            {...dragProps}
            className={`${isDragging ? "is-dragging" : ""} ${imageList.length !==0 && "image-upload"}`}
          >
            {imageList.map((image, index) => (
              <>
                <img src={image.data_url} alt="" width="100" />
                <div className="image-item__btn-wrapper">
                  {/* <button onClick={() => onImageUpdate(index)}>Update</button>
                  <button onClick={() => onImageRemove(index)}>Remove</button> */}
                </div>
              </>
            ))}
            {
                imageList.length == 0 && <p>Upload Image</p>
            }
          </UploadImgWrap>
        )}
      </ReactImageUploading>
    </>
  );
}

const UploadImgWrap = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100px;
  ${Flex}
  margin: 10px 0;
  border-radius: 5px;
  font-weight: 300;
   &.image-upload{
        background: transparent !important;
    }
  &.is-dragging{
    border: 1px dashed #ccc;
  }
    img{
        width: 45%;
        border: 1px dashed #ccc;

    }
`;
