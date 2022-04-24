import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Add from "./components/Add";
import Bookmark from "./models/Bookmark";

const Popup = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    const bookmark = window.localStorage.getItem("bookmark")
      ? JSON.parse(localStorage.getItem("bookmark") || "")
      : ([] as Bookmark[]);
    setBookmarks([...bookmark]);
  }, []);
  // const [currentURL, setCurrentURL] = useState<string>();
  // title, id
  // useEffect(() => {
  //   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  //     setCurrentURL(tabs[0].url);
  //     // alert(tabs[0].title);
  //   });
  // }, []);
  const handleClickBookmark = (url: string) => () => {
    chrome.tabs.update({ url });
  };

  const handleClickEditButton = () => {
    // !isAdding ? setIsEditing(!isEditing) : setIsAdding(false);
    setIsEditing(!isEditing);
  };

  const handleClickAddButton = () => {
    setIsAdding(!isAdding);
  };

  const handleAddBookmark = (bookmark: Bookmark) => {
    setBookmarks([...bookmarks, bookmark]);
    window.localStorage.setItem(
      "bookmark",
      JSON.stringify([...bookmarks, bookmark])
    );
    setIsAdding(false);
  };

  return (
    <div>
      {!isAdding ? (
        <Container>
          <Section>
            <ScrollBox>
              <ItemsUl>
                {/* {data.map((item: Bookmark) => ( */}
                {bookmarks.length !== 0 &&
                  bookmarks.map((item: Bookmark) => (
                    <ItemLi
                      key={item.id}
                      onClick={handleClickBookmark(item.url)}
                    >
                      {/* TODO: https:// 붙여주는거 정규식 */}
                      <BookmarkA href={item.url}>
                        <ImageFrame
                          src={`https://www.google.com/s2/favicons?sz=32&domain_url=${item.url}`}
                          // whale://large-icon/32/https://www.naver.com
                        />
                        <br />
                        <Title>{item.title}</Title>
                      </BookmarkA>
                    </ItemLi>
                  ))}
              </ItemsUl>
            </ScrollBox>
          </Section>
          <HR />
          <Button onClick={handleClickAddButton}>{"추가"}</Button>
          <Button onClick={handleClickEditButton}>
            {!isEditing ? "편집" : "취소"}
          </Button>
        </Container>
      ) : (
        <Add
          onAddBookmark={handleAddBookmark}
          onClickAddButton={handleClickAddButton}
        />
      )}
    </div>
  );
};

const Container = styled.div``;

const Section = styled.div`
  width: 530px;
  height: 200px;
  display: flex;
  justify-content: center;
  overflow-y: auto;

  // display: scroll;
  // margin: 1px;
  // overflow: auto;
  // flex-direction: row;
  // justify-content: flex-start;
  // align-items: center;
  // background: wheat;
`;

const ScrollBox = styled.div`
  overflow-y: scroll;
  &::-webkit-scrollbar {
    background-color: transparent;
    width: 8px;
  }
  &:hover {
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background-color: rgba(0, 0, 0, 0.3);
    }
  }
  // width: 530px;
  // height: 200px;
  // background-color: #f6f6f6;
`;

const ItemsUl = styled.ul`
  margin: 0 0 0 8px;
  padding: 0px;
  // width: 500px;
  // height: 200px;
  align-items: center;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  flex-flow: wrap;
  list-style: none;
`;
const ItemLi = styled.li`
  display: flex;
  min-width: 88px;
  min-height: 55px;
  // flex: 1 1 75px;
  // flex: 15%;
  justify-content: center;
  margin: 2px;
  padding: 5px;

  // border: 1px solid #000000;
  border-radius: 5px;
  // box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  align-items: center;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  &:hover img {
    opacity: 0.5;
  }
  &:hover span {
    opacity: 0.5;
  }
`;

const ImageFrame = styled.img`
  min-width: 32px;
  min-height: 32px;
`;

const BookmarkA = styled.a`
  text-align: center;
  text-decoration: none;
  color: black;
`;

const Title = styled.span`
  width: 80px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.8em;
`;

const Footer = styled(React.Fragment)`
  // display: flex;
  // justify-content: flex-start;
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

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
