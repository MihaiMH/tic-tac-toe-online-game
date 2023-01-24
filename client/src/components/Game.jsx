import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "axios";
import server from "../data/server";

export default function Game() {

    const navigate = useNavigate();
    const { id } = useParams();
    const [room, setRoom] = useState({});
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");

    // Each time when the page renders, the player's name is taken from the sessionStorage and a request to the server is made every 2 seconds
    useEffect(() => {
        let aux = JSON.parse(sessionStorage.getItem("player"));
        setName(aux);
        const interval = setInterval(() => {
            refreshRoom();
        }, 2000);

        return () => clearInterval(interval);
    }, [])

    // A function which is designed to get all data about a specific room
    const refreshRoom = async () => {
        await Axios.post(server + "getRoom", { room_id: id }).then(
            (response) => {
                if (response.data != "NONE") {

                    setRoom(response.data);

                } else {
                    navigate("/");
                }
            }
        )
    }

    // Function which makes a request to the server when a players chooses to leave a room
    function leaveRoom() {
        const leaveR = async () => {
            setLoading(true);
            await Axios.post(server + "leaveRoom", { room_id: id, name: name }).then((response) => {
                if (response.data === "SUCCESS") {
                    navigate("/");
                } else {
                    alert("An error has occured! Please try again.");
                }
            })
            setLoading(false);
        }

        leaveR();
    }

    // Function which makes a request to the server when a player chooses to start the game
    function startGame() {
        const startG = async () => {
            await Axios.post(server + "startgame", { room_id: id }).then(
                (response) => {
                    if (response.data === "ERROR") {
                        alert("An error has occured! Please try again.");
                    } else if (response.data==="NOPLAYER2"){
                        alert("You need one more player in order to start the game.");
                    } else {
                        alert("Game starts!");
                    }
                }
            )
        }

        startG();
    }

    // Function which makes a request to the server when a player makes a move during the game
    function makeMove(x) {
        const makeM = async () => {
            await Axios.post(server + "makeMove", { x: x, room_id: id }).then(
                (response) => {
                    if (response.data === "OCCUPIED") {
                        alert("This cell is taken");
                    } else if (response.data != "ERROR") {
                        setRoom(response.data);
                    } else {
                        alert("An error has occured! Please try again");
                    }
                }
            )
        }

        makeM();
    }


    // The function which sets the text in the table
    function setText(x) {
        if (room.table[x] === "X") {
            return "X";
        }
        if (room.table[x] === "O") {
            return "O";
        }
        return "";
    }

    return (
        <>
            {
                loading === false ?
                    <div className="container-fluid">
                        <div className="card m-2 p-5 card-form d-flex flex-column">
                            <div className="top-content">
                                <div className="players-tab ca">
                                    <p>Player 1: {room.player1}</p>
                                    <p>Player 2: {room.player2}</p>
                                </div>
                                <div className="buttons-tab">
                                    <button onClick={() => { leaveRoom(); }}>Leave room</button>
                                    {
                                        (room.started === false && room.player1 === name) || (room.started === true && room.now === null && room.player1 === name) ?
                                            <button onClick={() => { startGame() }}>START</button>
                                            :
                                            <></>
                                    }
                                </div>
                            </div>
                            {
                                room.winner != null ? <h1>{room.winner} WINS!</h1> : <></>
                            }
                        </div>
                        
                        <div className="game">
                        {
                            room.started === true ?
                                <>
                                    {room.now != null ? <p>Now moves: {room.now}</p> : <></>}
                                    {
                                        room.now === name ?
                                            <table>
                                                <tr>
                                                    <td onClick={() => { makeMove(0) }}>{setText(0)}</td>
                                                    <td onClick={() => { makeMove(1) }}>{setText(1)}</td>
                                                    <td onClick={() => { makeMove(2) }}>{setText(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td onClick={() => { makeMove(3) }}>{setText(3)}</td>
                                                    <td onClick={() => { makeMove(4) }}>{setText(4)}</td>
                                                    <td onClick={() => { makeMove(5) }}>{setText(5)}</td>
                                                </tr>
                                                <tr>
                                                    <td onClick={() => { makeMove(6) }}>{setText(6)}</td>
                                                    <td onClick={() => { makeMove(7) }}>{setText(7)}</td>
                                                    <td onClick={() => { makeMove(8) }}>{setText(8)}</td>
                                                </tr>
                                            </table>
                                            :
                                            <table>
                                                <tr>
                                                    <td>{setText(0)}</td>
                                                    <td>{setText(1)}</td>
                                                    <td>{setText(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td>{setText(3)}</td>
                                                    <td>{setText(4)}</td>
                                                    <td>{setText(5)}</td>
                                                </tr>
                                                <tr>
                                                    <td>{setText(6)}</td>
                                                    <td>{setText(7)}</td>
                                                    <td>{setText(8)}</td>
                                                </tr>
                                            </table>

                                    }

                                </>
                                :
                                <></>
                        }
                        </div>




                    </div>
                    :
                    <h1>
                        Loading...
                    </h1>
            }
        </>
    )
}