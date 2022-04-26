import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import Add from "./components/Add";
import Edit from "./components/Edit";
import Bookmark from "./models/Bookmark";

const Popup = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isAddMode, setIsAddMode] = useState<boolean>(false);
  const [isModifyMode, setIsModifyMode] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [id, setId] = useState<string>("");

  useEffect(() => {
    const bookmark = window.localStorage.getItem("bookmark")
      ? JSON.parse(localStorage.getItem("bookmark") || "")
      : ([] as Bookmark[]);
    setBookmarks([...bookmark]);
  }, []);

  const handleClickBookmark = (url: string) => () => {
    chrome.tabs.update({ url });
  };

  // 추가 폼
  const handleAddModeButton = () => setIsAddMode(true);
  const handleCancelAddModeButton = () => setIsAddMode(false);
  // 편집 폼
  const handleModifyModeButton = () => setIsModifyMode(true);
  const handleCancelModifyModeButton = () => setIsModifyMode(false);

  // 편집, 삭제 페이지
  const handleEditButton = () => setIsEditing(!isEditing);

  const handleAddBookmark = (bookmark: Bookmark) => {
    setBookmarks([...bookmarks, bookmark]);
    window.localStorage.setItem(
      "bookmark",
      JSON.stringify([...bookmarks, bookmark])
    );
    setIsAddMode(false);
  };

  const handleEditBookmark = (bookmark: Bookmark) => {
    const updatedBookmarks = bookmarks.map((item: Bookmark) => {
      if (item.id === id) {
        return { ...item, title: bookmark.title, url: bookmark.url };
      }
      return item;
    });
    setBookmarks(updatedBookmarks);
    window.localStorage.setItem("bookmark", JSON.stringify(updatedBookmarks));
    setIsModifyMode(false);
  };

  const handleChangeBookmark = (id: string) => () => {
    setId(id);
    setIsModifyMode(true);
  };
  const handleDeleteBookmark = (id: string) => () => {
    const bookmark = bookmarks.filter((item: Bookmark) => item.id !== id);
    setBookmarks([...bookmark]);
    window.localStorage.setItem("bookmark", JSON.stringify([...bookmark]));
  };

  const ListElement = (props: { item: Bookmark }) => {
    return !isEditing ? (
      <ItemLi key={props.item.id} onClick={handleClickBookmark(props.item.url)}>
        {/* TODO: https:// 붙여주는거 정규식 */}
        <BookmarkA href={props.item.url}>
          <Image
            src={`https://www.google.com/s2/favicons?sz=32&domain_url=${props.item.url}`}
            // whale://large-icon/32/https://www.naver.com
          />
          <br />
          <Title>{props.item.title}</Title>
        </BookmarkA>
      </ItemLi>
    ) : (
      <ItemLi2 key={props.item.id}>
        <ContentFrame>
          <Image
            src={`https://www.google.com/s2/favicons?sz=32&domain_url=${props.item.url}`}
            // whale://large-icon/32/https://www.naver.com
          />
          <br />
          <Title>{props.item.title}</Title>
        </ContentFrame>
        <ActionFramge>
          <UpdateItem onClick={handleChangeBookmark(props.item.id)}>
            <span>수정</span>
          </UpdateItem>
          <DeleteItem onClick={handleDeleteBookmark(props.item.id)}>
            <span>삭제</span>
          </DeleteItem>
        </ActionFramge>
      </ItemLi2>
    );
  };

  return (
    <div>
      {isModifyMode && (
        <Edit
          id={id}
          onEditBookmark={handleEditBookmark}
          onCancel={handleCancelModifyModeButton}
        />
      )}
      {!isModifyMode && !isAddMode ? (
        <Container>
          <Section>
            <ScrollBox>
              <ItemsUl>
                {bookmarks.length !== 0 &&
                  bookmarks.map((item: Bookmark) => (
                    <ListElement item={item} />
                  ))}
              </ItemsUl>
            </ScrollBox>
          </Section>
          <HR />
          <Button onClick={handleAddModeButton}>{"추가"}</Button>
          <Button onClick={handleEditButton}>
            {!isEditing ? "편집" : "취소"}
          </Button>
        </Container>
      ) : isModifyMode ? null : (
        <Add onAdd={handleAddBookmark} onCancel={handleCancelAddModeButton} />
      )}
    </div>
  );
};

const Container = styled.div``;

const Section = styled.div`
  width: 530px;
  height: 200px;
  display: flex;
  justify-content: flex-start;
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
  min-width: 98px;
  min-height: 65px;
  justify-content: center;
  margin: 2px;
  // padding: 5px;

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

const ItemLi2 = styled.li`
  display: flex;
  min-width: 98px;
  min-height: 65px;
  justify-content: center;
  margin: 2px;
  // padding: 5px;

  // border: 1px solid #000000;
  border-radius: 5px;
  // box-shadow: rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
  align-items: center;
  cursor: pointer;
  // &:hover {
  //   background: rgba(255, 255, 255, 0.3);
  // }
  &:hover img {
    opacity: 0.5;
  }
`;

const ContentFrame = styled.div`
  text-align: center;
  position: absolute;
  z-index: 1;
`;
const ActionFramge = styled.div`
  display: flex;
  min-width: 98px;
  min-height: 65px;
  border-radius: 5px;

  flex-direction: row;
  position: absolute;
  z-index: 2;
`;

const UpdateItem = styled.div`
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 49px;
  min-height: 55px;
  background: rgba(100, 146, 206, 0.4);
  border-radius: 5px 0 0 5px;
  & span {
    font-size: 0.4em;
    color: #ffffff;
  }
  &:hover {
    background: rgba(100, 146, 206, 0.8);
  }
`;
const DeleteItem = styled.div`
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 49px;
  min-height: 55px;
  border-radius: 0 5px 5px 0;
  background: rgba(206, 100, 100, 0.4);
  & span {
    font-size: 0.4em;
    color: #ffffff;
  }
  &:hover {
    background: rgba(206, 100, 100, 0.8);
  }
`;
// const UpdateIcon = styled.img.attrs({
//   src: "./change2.svg",
// })`
//   opacity: 0.5;
// `;

// const DeleteIcon = styled.img.attrs({
//   src: "./delete.png",
// })`
//   opacity: 0.5;
// `;

const Image = styled.img`
  min-width: 32px;
  min-height: 32px;
`;

const BookmarkA = styled.a`
  min-height: 51px;
  text-align: center;
  text-decoration: none;
  margin: 6px;
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
