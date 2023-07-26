const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3093, () => {
      console.log("Server is Running");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

//api 1
app.get("/players/", async (request, response) => {
  const getAllPlayersQuery = `SELECT * FROM cricket_team;`;
  const playersList = await db.all(getAllPlayersQuery);
  response.send(playersList);
});

//api 2
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { player_id, player_name, jersey_number, role } = playerDetails;
  const addPlayerDetailsQuery = `Insert into cricket_team(playerName, jerseyNumber, role) 
    values ("Vishal", 17, "Bowler");`;

  const dbResponse = await db.run(addPlayerDetailsQuery);
  response.send("Player Added to Team");
});

//api 3
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerOnPlayerIdQuery = `select * from cricket_team where player_id = ${playerId};`;
  const player = await db.get(getPlayerOnPlayerIdQuery);
  response.send(player);
});

//api 4
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { player_id, player_name, jersey_number, role } = playerDetails;
  const updatePlayerQuery = `update cricket_team set
    playerName= "Maneesh",
    jerseyNumber: 54,
    role: "All-rounder" 
    where player_id = ${playerId};`;
  await db.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

//api 5
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    delete from cricket_team where player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

app.listen(3093);
module.exports = app;
