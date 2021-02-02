/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetAllPodcastsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: podcastsQuery
// ====================================================

export interface podcastsQuery_getAllPodcasts_podcasts {
  __typename: "Podcast";
  id: number;
  updatedAt: any;
  title: string;
  category: string;
}

export interface podcastsQuery_getAllPodcasts {
  __typename: "GetAllPodcastsOutput";
  error: string | null;
  ok: boolean;
  podcasts: podcastsQuery_getAllPodcasts_podcasts[] | null;
}

export interface podcastsQuery {
  getAllPodcasts: podcastsQuery_getAllPodcasts;
}

export interface podcastsQueryVariables {
  input: GetAllPodcastsInput;
}
