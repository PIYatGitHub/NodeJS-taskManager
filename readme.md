# Task manager app
<em> Created by Peter Y during the following course: <a href ="https://www.udemy.com/the-complete-nodejs-developer-course-2/">
NodeJS Mastery</a> as supervised by Mr. Andrew J. Mead </em>

## Getting started for users
This app supports full user auth

## Getting started for devs
All the standard moves like ``npm install`` are highly recommended.
There is an environment config file, which is called ``dev.env``, which is not committed and
holds some data needed for the app to run in development mode. This file is located in the ``config`` folder of the project, which is 
<strong>located in the root of the project</strong>. The list of needed variables is: 
 <ul>
    <li>PORT</li>
    <li>EMAIL_API_KEY</li>
    <li>JWT_SECRET</li>    
    <li>DB_URL</li>
 </ul>
Do not forget not to use any text formatting while you type out your version of the file. <br>
Also it is <b>very important</b> to have the following command at ``package.json`` since it will fail otherwise: 
``env-cmd -f ./config/dev.env nodemon src/index.js``. 
