import { gql, useLazyQuery, useQuery } from "@apollo/client";

export const GQL_QUERY_ME = gql`
  query QueryMe {
    me {
      id
      email
      role
    }
  }
`;

export const useMe = () => {
  return useQuery(GQL_QUERY_ME);
};

export const useLazyMe = () => {
  return useLazyQuery(GQL_QUERY_ME);
};
