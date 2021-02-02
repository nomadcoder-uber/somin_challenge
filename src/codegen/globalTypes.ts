/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum UserRole {
  Host = "Host",
  Listener = "Listener",
}

export interface GetAllPodcastsInput {
  page?: number | null;
  pageSize?: number | null;
}

export interface GetEpisodesInput {
  page?: number | null;
  pageSize?: number | null;
  podcastId: number;
}

export interface PodcastSearchInput {
  id: number;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
