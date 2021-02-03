/** @jsx jsx */

import React, { useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { Predictions } from "aws-amplify";
import { keyframes, css, jsx } from "@emotion/core";
import styled from "@emotion/styled";
import {
  FaMicrophone,
  FaMicrophoneAlt,
  FaMicrophoneAltSlash
} from "react-icons/fa";
import mic from "microphone-stream";
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';

import RecordingEditor from "./Recording-Editor";
import { createNote } from "../graphql/mutations";

const Container = styled("div")`
  margin: 16px auto;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.3;
  }

  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

export default props => {
  const [isRecording, setIsRecording] = useState(false);
  const [showRecordingEditor, setShowRecordingEditor] = useState(false);
  const [recordingText, setRecordingText] = useState("");
  const [isConverting, setIsConverting] = useState("");
  const [micStream, setMicStream] = useState();
  const [audioBuffer] = useState(
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

  const startRecording = async () => {
    const stream = await window.navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true
    });
    const startMic = new mic();

    startMic.setStream(stream);
    startMic.on("data", chunk => {
      var raw = mic.toRaw(chunk);
      if (raw == null) {
        return;
      }
      audioBuffer.addData(raw);
    });

    setMicStream(startMic);
    setIsRecording(true);
  };

  const stopRecording = async () => {
    micStream.stop();
    setIsRecording(false);
    setIsConverting(true);

    const buffer = audioBuffer.getData();
    const result = await Predictions.convert({
      transcription: {
        source: {
          bytes: buffer
        }
      }
    });

    setMicStream(null);
    audioBuffer.reset();
    setRecordingText(result.transcription.fullText);
    setIsConverting(false);
    setShowRecordingEditor(true);
  };

  return (
    <Container>
      <div
        css={css`
          position: relative;
          justify-content: center;
          align-items: center;
          width: 120px;
          height: 120px;
        `}
      >
        <div
          css={[
            css`
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
              position: absolute;

              border-radius: 50%;
              background-color: #74b49b;
            `,
            isRecording || isConverting
              ? css`
                  animation: ${pulse} 1.5s ease infinite;
                `
              : {}
          ]}
        />
        <div
          css={css`
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            position: absolute;
            border-radius: 50%;
            background-color: #74b49b;
            display: flex;
            cursor: pointer;
          `}
          onClick={() => {
            if (!isRecording) {
              startRecording();
            } else {
              stopRecording();
            }
          }}
        >
          <MDBTable striped>
            <MDBTableHead>
              <tr>
                <th>#</th>
                <th>First</th>
                <th>Last</th>
                <th>Handle</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Larry</td>
                <td>the Bird</td>
                <td>@twitter</td>
              </tr>
            </MDBTableBody>
          </MDBTable>
        </div>
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
