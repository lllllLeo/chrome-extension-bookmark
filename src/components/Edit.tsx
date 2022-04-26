import React, { FormEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { v4 as uuid } from "uuid";
import Bookmark from "../models/Bookmark";
import { validation } from "../utils/util";
let globalTimeout: null | ReturnType<typeof setTimeout> = null;

const Edit = (props: {
  id: string;
  onEditBookmark: (bookmark: Bookmark) => void;
  onCancel: () => void;
}) => {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const [viewImage, setViewImage] = useState<string>();
  const item = JSON.parse(window.localStorage.getItem("bookmark") || "").filter(
    (item: Bookmark) => item.id === props.id
  );
  useEffect(() => {
    titleInputRef.current!.value = item[0].title;
    urlInputRef.current!.value = item[0].url;
    titleInputRef.current!.focus();
    setUrlImage();
  }, []);

  const handleBlur = () => setUrlImage();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validation(titleInputRef, urlInputRef)) return;
    const bookmark = {
      id: item[0].id,
      title: titleInputRef.current!.value,
      url: urlInputRef.current!.value,
    };
    console.log(bookmark);
    props.onEditBookmark(bookmark);
  };

  const handleKeyUp = () => {
    if (globalTimeout != null) clearTimeout(globalTimeout);
    globalTimeout = setTimeout(setUrlImage, 700);
  };

  const setUrlImage = () => {
    globalTimeout = null;
    const url = urlInputRef.current!.value;
    url &&
      setViewImage(
        `https://www.google.com/s2/favicons?sz=32&domain_url=${url}`
      );
  };

  return (
    <Container>
      <Section>
        <ImageFrame>
          <Logo
            src={viewImage}
            // whale://large-icon/32/https://www.naver.com
          />
          <p></p>
        </ImageFrame>
        <Form onBlur={handleBlur}>
          <Input
            ref={titleInputRef}
            placeholder="이름"
            autoCapitalize="none"
            autoComplete="off"
            spellCheck="false"
          >
            {item.title}
          </Input>
          <br />
          <Input
            ref={urlInputRef}
            placeholder="URL"
            autoCapitalize="none"
            autoComplete="off"
            spellCheck="false"
            onKeyUp={handleKeyUp}
            value={item.url}
          >
            {item.url}
          </Input>
        </Form>
      </Section>
      <HR />
      <Button onClick={handleSubmit}>{"수정"}</Button>
      <Button onClick={props.onCancel}>{"취소"}</Button>
    </Container>
  );
};

const Container = styled.div``;
const Section = styled.div`
  width: 530px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // text-align: center;
`;

const ImageFrame = styled.div`
  // display: inline-block;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  width: 100px;
  height: 100px;
  // border: 1px solid #d5d5d5;
  border-radius: 5px;
  margin-bottom: 15px;
`;

const Logo = styled.img`
  border: 0px;
  width: "45px";
  height: "45px";
`;

const Form = styled.form``;

const Input = styled.input`
  width: 340px;
  height: 30px;
  margin: 3px;
  border: 1px solid #d5d5d5;
  border-radius: 5px;
  padding: 0 13px;
  &: focus {
    outline: none;
    border: 1px solid #000000;
  }
`;

const Button = styled.button`
  min-width: 50px;
  min-height: 23px;
  // border: 1px solid #d5d5d5;
  border-radius: 3px;
  border: 0px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  background: white;
  outline: 0;
  cursor: pointer;
  margin: 5px;
  &:hover {
    // border: 0px solid #000000;
    background: rgba(0, 0, 0, 0.05);
  }
`;

const HR = styled.hr`
  border: 0.5px solid #d5d5d5;
`;

export default Edit;
