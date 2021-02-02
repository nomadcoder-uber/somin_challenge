import { gql, useQuery } from "@apollo/client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleDown,
  faCheck,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import {
  podcastsQuery,
  podcastsQueryVariables,
} from "../../codegen/podcastsQuery";

const PODCASTS_QUERY = gql`
  query podcastsQuery($input: GetAllPodcastsInput!) {
    getAllPodcasts(input: $input) {
      error
      ok
      podcasts {
        id
        updatedAt
        title
        category
      }
    }
  }
`;

export const Podcasts = () => {
  const { data, loading } = useQuery<podcastsQuery, podcastsQueryVariables>(
    PODCASTS_QUERY,
    {
      variables: {
        input: {
          page: 1,
          pageSize: 10,
        },
      },
    }
  );
  return (
    <div className="w-screen h-full bg-gray-800 text-gray-300 ">
      <Header />
      {data?.getAllPodcasts.podcasts?.map((podcast: any) => (
        <div className="w-full h-50 px-6 pt-4 pb-2 border-b-2 border-gray-600">
          <div className="mb-2">
            <span>{podcast.updatedAt}</span>
          </div>
          <Link to={`/podcasts/${podcast.id}`}>
            <div className="font-bold text-2xl mb-4">
              <span>{podcast.title}</span>
            </div>
          </Link>
          <div className="flex w-full justify-start items-center">
            <div className="flex items-center text-lg rounded-full border-gray-600 w-32 h-14 text-center border-2 mr-3 justify-center">
              <p className="mb-1">{podcast.category} </p>
            </div>
            <FontAwesomeIcon
              icon={faCheck}
              className="text-2xl text-blue-500 mr-4"
            />
            <FontAwesomeIcon
              icon={faArrowAltCircleDown}
              className="text-2xl text-blue-500"
            />
          </div>
        </div>
      ))}
      <Footer />
    </div>
  );
};
