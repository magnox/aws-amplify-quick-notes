/** @jsx jsx */

import React, { useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { keyframes, css, jsx } from "@emotion/core";
import styled from "@emotion/styled";

import RecordingEditor from "./Recording-Editor";
import { createNote } from "../graphql/mutations";

const Container = styled("div")`
  margin: 16px auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

export default props => {
  const [showRecordingEditor, setShowRecordingEditor] = useState(false);
  const [recordingText, setRecordingText] = useState("");
  const [] = useState(
    (function() {
      let buffer = [];
      function add(raw) {
        buffer = buffer.concat(...raw);
        return buffer;
      }
      function newBuffer() {
        console.log("reseting buffer");
        buffer = [];
      }

      return {
        reset: function() {
          newBuffer();
        },
        addData: function(raw) {
          return add(raw);
        },
        getData: function() {
          return buffer;
        }
      };
    })()
  );

  return (
    <Container>
      <div
        css={css`
          position: relative;
          justify-content: center;
          align-items: center;
          width: 420px;
          height: 420px;
        `}
      >
        <table
          css={css`
            tr:nth-child(even) {background-color: #e2e2e2;}
            tr:nth-child(odd) {background-color: #c2c2c2;}

            font-family: verdana, arial, sans-serif;
            font-size: 11px;
            color: #333333;
            border-width: 1px;
            border-color: #3A3A3A;
            border-collapse: collapse;
            width:420px;
           
            th {
              border-width: 1px;
              padding: 8px;
              border-style: solid;
              border-color: #517994;
              background-color: #B2CFD8;
            }
           
            tr:hover td {
              background-color: #DFEBF1;
            }
           
            td {
              border-width: 1px;
              padding: 8px;
              border-style: solid;
              border-color: #517994;
              background-color: #ffffff;
            }
        `}
        >
          <tr>
            <th>Rang</th>
            <th>Name</th>
            <th>Punkte</th>
          </tr>
          <tr>
            <td>1</td>
            <td>Winnie Wilson</td>
            <td>12</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Dominique Dedios</td>
            <td>11</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Lonny Lu</td>
            <td>11</td>
          </tr>
          <tr>
            <td><b>4</b></td>
            <td><b>Gaston Gunning</b></td>
            <td><b>10</b></td>
          </tr>
          <tr>
            <td>5</td>
            <td>Melanie Muldrow</td>
            <td>8</td>
          </tr>
          <tr>
            <td>6</td>
            <td>Bryon Basilio</td>
            <td>7</td>
          </tr>
          <tr>
            <td>6</td>
            <td>Oliver Odegard</td>
            <td>5</td>
          </tr>
          <tr>
            <td>6</td>
            <td>Daisey Duggins</td>
            <td>5</td>
          </tr>
          <tr>
            <td>9</td>
            <td>Arnita Andrus</td>
            <td>5</td>
          </tr>
          <tr>
            <td>10</td>
            <td>Jeremiah Jaime</td>
            <td>3</td>
          </tr>
          <tr>
            <td>11</td>
            <td>Ben Bibeau</td>
            <td>0</td>
          </tr>
        </table>
      </div>
      {showRecordingEditor && (
        <RecordingEditor
          text={recordingText}
          onDismiss={() => {
            setShowRecordingEditor(false);
          }}
          onSave={async data => {
            await API.graphql(graphqlOperation(createNote, { input: data }));
            props.setTabIndex(0);
          }}
        />
      )}
    </Container>
  );
};
