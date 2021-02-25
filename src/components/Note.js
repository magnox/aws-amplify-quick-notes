import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { FaStar, FaLaughWink } from "react-icons/fa";

const Note = styled("div")`
  background-color: #ffffff;
  border-radius: 4px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(116, 180, 155, 0.2);
`;

const Title = styled("h2")`
  color: #74b49b;
  margin-top: 0;
  margin-bottom: 8px;
  text-align: center;
`;

const Icon = styled("button")`
  padding: 8px 10px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: #74b49b;
  border: none;
  cursor: pointer;
  flex: 1;
  background-color: #ffffff;

  &:hover {
    color: #ffffff;
    background-color: #74b49b;
  }
`;

const Divider = styled("div")`
  height: 2px;
  background-color: #f4f9f4;
`;

const NoteActions = styled("div")`
  display: flex;
  justify-content: stretch;
  align-items: stretch;
  height: 50px;
  background-color: #74b49b;
`;

const Info = styled.div`
  padding: 24px;
`;

export default () => {
  const [] = useState(false);

  return (
    <Note>
      <Info>
        <Title>Tag 12</Title>
        {/* <Text>{props.text}</Text> */}
        <br/>
        <img width="600" src="day10.png" />
      </Info>
      <Divider />
      <NoteActions>
        <Icon>
        <FaLaughWink />&nbsp;&nbsp;FAKE
        </Icon>
        <Icon>
        <FaStar />&nbsp;&nbsp;ECHT
        </Icon>
      </NoteActions>
    </Note>
  );
};
