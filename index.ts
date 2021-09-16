import fs from 'fs';
const http = require('http');
// const https = require('https');
import axios from 'axios';

import https from 'https';


var privateKey  = fs.readFileSync('sslcert/key.key', 'utf8');
var certificate = fs.readFileSync('sslcert/certificate.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate, requestCert:true,rejectUnauthorized: false };
var express = require('express');
var app = express();

// your express configuration here

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8081,()=>{
    console.log('http server started on port 8081');
});
httpsServer.listen(8444,()=>{
    console.log('https server started on port 8444');
});

app.get('/',async (req:any,res:any)=>{

    console.log('called');
    

    try{

        // console.log(req.socket.getPeerCertificate(true).raw);
        

    let certDecoded = await fs.readFileSync('sslcert/certificate.crt', 'utf8');

    let keyDecoded = await fs.readFileSync('sslcert/key.key', 'utf8');

    console.log('called22');

    

    const options = {
        cert: certDecoded,
        key: keyDecoded,
        requestCert:true,
        rejectUnauthorized: false,
        keepAlive: false, // switch to true if you're making a lot of calls from this client
    };

    console.log('called3333');

    // we're creating a new Agent that will now use the certs we have configured
    const sslConfiguredAgent = Object.assign(new https.Agent(options),{});

    console.log('called4444');

    const body={
        're':'sd'
    }

    await axios({
        method: 'post',
        url: 'https://localhost:8443/',
        data:body,
        // httpsAgent:sslConfiguredAgent,
      }).then(function (response:any) {
            res.send('working...')
        }).catch((error:any)=>{
            res.send(error)
        });
    }catch(e:any){
        console.log(e);
        
        res.send(e)
    }

})