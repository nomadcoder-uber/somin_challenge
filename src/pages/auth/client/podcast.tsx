import { gql, useQuery } from "@apollo/client";
import React from "react";

const PODCAST_QUERY = gql`
  query podcastsQuery {
    getAllPodcasts {
      ok
      error
      podcasts {
        id
        title
        category
        rating
        updatedAt
      }
    }
  }
`;

export const Podcast = () => {
  const { data, loading, error } = useQuery(PODCAST_QUERY);
  console.log(data);
  return <h1>Podcasts</h1>;
};
