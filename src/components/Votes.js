import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import styled from "@emotion/styled";

import Vote from "./Vote";
import { listNotes as listVotes } from "../graphql/queries";
import { updateNote as updateVote, deleteNote as deleteVote } from "../graphql/mutations";

const Container = styled("div")`
  max-width: 800px;
  margin: 16px auto;
  width: 100%;
`;

export default () => {
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    const fetchVotes = async () => {
      const result = await API.graphql(graphqlOperation(listVotes));

      setVotes(
        result.data.listNotes.items.sort((a, b) => {
          if (a.updatedAt > b.updatedAt) return -1;
          else return 1;
        })
      );
    };

    fetchVotes();
  }, []);

  return (
    <Container>
      {votes.map(vote => (
        <Vote
          key={vote.id}
          {...vote}
          onSaveChanges={async values => {
            const result = await API.graphql(
              graphqlOperation(updateVote, {
                input: {
                  ...vote,
                  ...values
                }
              })
            );

            setVotes(
              votes.map(n => {
                return n.id === vote.id ? result.data.updateNote : n;
              })
            );
          }}
          onDelete={async () => {
            const result = await API.graphql(
              graphqlOperation(deleteVote, {
                input: {
                  id: vote.id
                }
              })
            );

            setVotes(votes.filter(n => n.id !== vote.id));
          }}
        />
      ))}
    </Container>
  );
};
