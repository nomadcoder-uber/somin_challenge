import { gql, useQuery } from "@apollo/client";
import {
  faArrowAltCircleDown,
  faCheck,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useParams } from "react-router-dom";
import { getEpisodes, getEpisodesVariables } from "../../codegen/getEpisodes";

const EPISODE_QUERY = gql`
  query getEpisodes($input: GetEpisodesInput!) {
    getEpisodes(input: $input) {
      ok
      episodes {
        title
        category
        createdAt
      }
    }
  }
`;
interface IPodcastParams {
  id: string;
}
export const Episodes = () => {
  const params = useParams<IPodcastParams>();
  console.log(params);
  const { loading, data } = useQuery<getEpisodes, getEpisodesVariables>(
    EPISODE_QUERY,
    {
      variables: {
        input: {
          podcastId: +params.id,
        },
      },
    }
  );
  console.log(data);
  return (
    <div>
      <h1 className="text-gray-200 text-4xl px-10 pt-6">Episodes</h1>
      {data?.getEpisodes.episodes?.map((episode: any) => (
        <div className="w-full bg-gray-800 py-8 px-10 border-gray-600 border-b-2">
          <h1 className="text-gray-400 mb-3">{episode.createdAt}</h1>
          <h1 className="text-gray-200 text-3xl mb-5">{episode.title}</h1>
          <div className="flex w-full  justify-start items-center">
            <div className="flex items-center text-lg rounded-full border-gray-600 w-52 h-12 text-center border-2 mr-8 justify-center">
              <FontAwesomeIcon
                icon={faPlayCircle}
                className="text-2xl text-blue-500 mr-2"
              />
              <h1 className="text-gray-200 text-2xl">{episode.category}</h1>
            </div>
            <FontAwesomeIcon
              icon={faCheck}
              className="text-2xl text-blue-500 mr-8"
            />
            <FontAwesomeIcon
              icon={faArrowAltCircleDown}
              className="text-2xl text-blue-500"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
