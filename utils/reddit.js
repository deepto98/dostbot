const fetch = require("node-fetch");

function fetchHotPostsFromSubreddit(subredditName) {
  let url = `https://www.reddit.com/r/${subredditName}/hot.json`;
  let settings = { method: "Get" };

  fetch(url, settings)
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
    })
    .catch((err) => console.error("error:" + err));
}

module.exports = {
  fetchHotPostsFromSubreddit,
};
