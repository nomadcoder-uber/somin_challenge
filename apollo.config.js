module.exports = {
  client: {
    includes: ["./src/**/*.{tsx,ts}"],
    tagname: "gql",
    service: {
      name: "podcast-backend",
      url: "https://nuber-eats-challenge.herokuapp.com/graphql"
    }
  }
};
