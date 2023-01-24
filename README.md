# tic-tac-toe-online-game

**General Information**

This project represents a website which allows users to play tic-tac-toe online with each other. Each player is able to choose a nickname, create a room or join other rooms. When there are 2 players in the room, the room creator is able to start the game.

**Technologies**

Front End (Client side):
- ReactJS
- Axios

Back End (Server side):
- NodeJS
- ExpressJS


**Setup**

NOTE: For this application to run without any troubles, make sure that the ports 3000 and 3001 are not taken.
1. Download and install ReactJS, NodeJS and npm
2. Open a terminal/console in the "tic-tac-toe-online-gam" directory
3. Go to the "server" directory (write "cd server" in the terminal)
4. In the "server" directory, write "npm start" in the terminal/console
5. Go back to the "tic-tac-toe-online-game" directory, then go to the "client directory" ( write "cd client" in the terminal)
6. In the "client" directory, write "npm start" in the terminal/console
7. If a browser window has not opened automatically, open it by yourself and go to the http://localhost:3000/ link.
8. If the link http://localhost:3000/ is not working, check which port has the ReactApp taken and replace it in the link http://localhost:[PORT]/

- If you want to change the port of the client part for the localhost, go to tic-tac-toe-online-game/client/src/data/server.js. There you will be able to change the port to the one which you like.
- If you want to change the port of the server part, go to tic-tac-toe-online-game/server/index.js. There you will see the line ``` const port = process.env.PORT || 3001; ``` , which contains the port. 
