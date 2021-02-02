/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PodcastSearchInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: getPodcast
// ====================================================

export interface getPodcast_getPodcast_podcast_host {
  __typename: "User";
  email: string;
}

export interface getPodcast_getPodcast_podcast {
  __typename: "Podcast";
  title: string;
  category: string;
  description: string | null;
  host: getPodcast_getPodcast_podcast_host;
}

export interface getPodcast_getPodcast {
  __typename: "PodcastOutput";
  ok: boolean;
  podcast: getPodcast_getPodcast_podcast | null;
}

export interface getPodcast {
  getPodcast: getPodcast_getPodcast;
}

export interface getPodcastVariables {
  input: PodcastSearchInput;
}
