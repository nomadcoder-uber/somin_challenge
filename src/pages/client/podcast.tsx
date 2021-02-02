import { gql, useQuery } from "@apollo/client";
import {
  faArrowAltCircleDown,
  faArrowLeft,
  faCheck,
  faEllipsisV,
  faGlobeAmericas,
  faPaw,
  faPlayCircle,
  faShareAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { getPodcast, getPodcastVariables } from "../../codegen/getPodcast";
import { Footer } from "../../components/Footer";
import { Episodes } from "./episode";

const PODCAST_QUERY = gql`
  query getPodcast($input: PodcastSearchInput!) {
    getPodcast(input: $input) {
      ok
      podcast {
        title
        category
        host {
          email
        }
      }
    }
  }
`;

interface IPodcastParams {
  id: string;
}

export const Podcast = () => {
  const params = useParams<IPodcastParams>();
  const { loading, data } = useQuery<getPodcast, getPodcastVariables>(
    PODCAST_QUERY,
    {
      variables: {
        input: {
          id: +params.id,
        },
      },
    }
  );
  return (
    <div>
      <Helmet>
        <title>{data?.getPodcast.podcast?.title || ""} | Podcast</title>
      </Helmet>
      <div className=" text-4xl text-gray-500 font-bold w-full px-7 py-4 bg-gray-800 flex justify-between">
        <Link to="/">
          <FontAwesomeIcon icon={faArrowLeft} className="cursor-pointer" />
        </Link>
        <FontAwesomeIcon icon={faEllipsisV} className="cursor-pointer" />
      </div>
      <div className="bg-gray-800 w-screen h-screen ">
        <div className="pt-6 px-10 pb-20 text-3xl border-b-2 border-gray-600">
          <h1 className="text-6xl text-gray-200">
            {data?.getPodcast.podcast?.title}
          </h1>
          <h2 className="text-2xl mt-4 text-blue-500">
            {data?.getPodcast.podcast?.host.email}
          </h2>
          <div className="mt-12 flex items-center">
            <div className="flex mr-8  justify-center rounded-full border-gray-600 border-2 w-56 h-14 items-center">
              <FontAwesomeIcon
                icon={faPaw}
                className="cursor-pointer mr-4 text-blue-500"
              />
              <p className="text-gray-200">Subscribe</p>
            </div>
            <FontAwesomeIcon
              icon={faGlobeAmericas}
              className="cursor-pointer mr-8 text-blue-500"
            />
            <FontAwesomeIcon
              icon={faShareAlt}
              className="cursor-pointer text-blue-500"
            />
          </div>
        </div>
        <Episodes />
        <Footer />
      </div>
    </div>
  );
};
