require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');


app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));
// route config
app.get('/', (req, res)=> {
    let originalUrl = req.url;
    if(!originalUrl.includes('?code=')){
        res.sendFile(path.join(__dirname, 'public/index.html'));
    }else{

        res.sendFile(path.join(__dirname, 'public/logged.html'));
    }
});

app.get('/profile', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public/playlists.html'))
});

app.get('/playlist/:id', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public/profile.html'))
});

app.post('/getToken', async(req, res)=>{
    let redirect = 'http://localhost:3000/';
    const details = {
        grant_type: "authorization_code",
        code: req.body.code,
        redirect_uri: redirect,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
    };
    var formBody = [];
    for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
   }
   formBody = formBody.join("&");
    let resp = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: formBody,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    let resJson = await resp.json();
    res.send(await resJson);
});

app.get('/spotiCom', (req, res)=>{
    let scopes = 'user-read-private playlist-read-collaborative playlist-read-private user-modify-playback-state';
    let redirect = 'http://localhost:3000/';
    res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + process.env.CLIENT_ID + '&scope=' + encodeURIComponent(scopes)+
    '&redirect_uri=' + encodeURIComponent(redirect));
});

//listening config
app.listen(port, ()=>{
    console.log('listening on 3000')
})