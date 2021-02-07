require('dotenv').config()
const express = require("express");
const fetch = require("node-fetch");
const cookie = require("cookie-session");
const app = express();

const client_id = process.env.GITHUB_CLIENT_ID;
const client_secret = process.env.GITHUB_CLIENT_SECRET;
const cookie_secret = process.env.COKKIE_SECRET
// console.log({ client_id, client_secret });

//NOw a redireact and call Back url

app.use(cookie({
    secret : cookie_secret
}))
app.get("/login/github", (req, res) => {
    const redirect_uri = "http://localhost:8080/login/github/callback";
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}`
    );

    console.log("github")
  });



async function getAccessToken({client_id, client_secret,code}) {
    const request = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        
        body: JSON.stringify({
            client_id,
            client_secret,
            code
        })
    });
   
    const data = await request.text();
    console.log({client_id, client_secret} +"tjos")
    console.log(data);
    const params = new URLSearchParams(data);
    console.log(params)
    const mytoken = params.get("access_token");
    console.log(mytoken);
    return mytoken;
    
}


async function getGIthubUser(access_token) {
  const req = await fetch("https://api.github.com/user", {
        headers: {
            Authorization : `bearer ${access_token}`
        }
  })
    const data = await req.json();
    return data;
}

app.get('/', (req, res) => {
    res.send("Simple Side Project")
})

app.get("/login/github/callback" ,async (req, res) => {
    const code = req.query.code;
    const token = await getAccessToken({ code, client_id, client_secret });
    const githubData = await getGIthubUser(token);
    if (githubData) {
        req.session.token = token;
        req.session.githubId = githubData.id;
        res.redirect('/admin')
       
    } else {
      res.send("Login did not succeed!");
    
    }

    res.json(githubData);
   

})

app.get("/admin", async (req, res) => {
    if (req.session && req.session.githubId === 31851961) {
      res.send("Hello Kevin <pre>" + JSON.stringify(req.session, null, 2));
      // Possible use "fetchGitHubUser" with the access_token
    } else {
      res.redirect("/login/github");
    }
  });
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Listing on ${PORT}`))