require('dotenv').config()
const express = require("express");
const app = express();

const client_id = process.env.GITHUB_CLIENT_ID;
const client_secret = process.env.GITHUB_CLIENT_SECRET;
// console.log({ client_id, client_secret });

//NOw a redireact and call Back url

app.get("/login/github", (req, res) => {
    const redirect_uri = "http://localhost:8080/login/github/callback";
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}`
    );

    console.log("github")
  });

app.get("/login/github/callback", (req, res) => {
    
})
app.get('/', (req, res) => {
    res.send("Simple Side Project")
})
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listing on ${PORT}`));