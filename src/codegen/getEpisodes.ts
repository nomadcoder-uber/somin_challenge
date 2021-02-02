/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetEpisodesInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: getEpisodes
// ====================================================

export interface getEpisodes_getEpisodes_episodes {
  __typename: "Episode";
  title: string;
  category: string;
  createdAt: any;
}

export interface getEpisodes_getEpisodes {
  __typename: "EpisodesOutput";
  ok: boolean;
  episodes: getEpisodes_getEpisodes_episodes[] | null;
}

export interface getEpisodes {
  getEpisodes: getEpisodes_getEpisodes;
}

export interface getEpisodesVariables {
  input: GetEpisodesInput;
}
