import { RefObject } from "react";

const validation = (
  titleInputRef: RefObject<HTMLInputElement>,
  urlInputRef: RefObject<HTMLInputElement>
) => {
  if (titleInputRef.current!.value.trim().length === 0) {
    titleInputRef.current!.focus();
    return false;
  }
  if (urlInputRef.current!.value.trim().length === 0) {
    urlInputRef.current!.focus();
    return false;
  }
  return true;
};

export { validation };
