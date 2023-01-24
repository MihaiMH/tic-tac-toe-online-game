import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import server from "../data/server";

export default function Menu() {

    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

    // Every time when the page renders, a request to the server will be made every 2 seconds
    useEffect(() => {

        const interval = setInterval(() => {
            refreshRooms();
        }, 2000);

        return () => clearInterval(interval);
    }, [])

    // A function which makes a request and gets all the information about every room
    const refreshRooms = async () => {
        await Axios.get(server + "getRooms").then(
            (response) => {
                setRooms(response.data);
            }
        )
    }

    // A function which makes a request to the server when an user chooses to create a new room
    function createRoom() {
        const createR = async () => {
            setLoading(true);
            await Axios.post(server + "createRoom", {
                name: name
            }).then((response) => {
                if (response.data != "ERROR") {
                    alert("Room successfully created!")
                    navigate("/game/" + response.data.room_id);
                } else {
                    alert("An error has occured! Please try again!");
                }
            })
            setLoading(false);
        }

        if (name.replaceAll(" ", "") != "") {
            sessionStorage.setItem("player", JSON.stringify(name));
            createR();
        } else {
            alert("You need a nickname in order to create a room");
        }
    }

    // A function which makes a request to the server when the user chooses to join a room
    function joinRoom(room_id) {
        const joinR = async () => {
            setLoading(true);
            await Axios.post(server + "joinRoom", {
                name: name,
                room_id: room_id
            }).then((response) => {
                if (response.data === "NAME_ERROR") {
                    alert("Your name is the same as the opponent's. Please change it.");
                } else if (response.data === "ERROR") {
                    alert("An error has occured! Please try again later.");
                } else if (response.data === "FULL") {
                    alert("This room is already full");
                } else {
                    navigate("/game/" + response.data.room_id);
                }
            })
            setLoading(false);
        }

        if (name.replaceAll(" ", "") != "") {
            sessionStorage.setItem("player", JSON.stringify(name));
            joinR();
        } else {
            alert("You need a nickname in order to join a room");
        }
    }

    // A function which returns the number of the players in a room
    function countPlayers(room) {
        if (room.player2 != null) {
            return 2;
        } else return 1;
    }

    return (
        <>
            {loading === false ?
                <div className="container-fluid">
                    <div className="card m-2 p-5 card-form d-flex flex-column">
                        <h1>Tic Tac Toe Game</h1>
                        <p>By Mihai Mihaila</p>
                        <p className="form-label">Nickname:</p>
                        <input type="text" className="form-control card-form-input" value={name} onChange={(e) => { setName(e.target.value) }} maxLength={10}/>
                        <br></br>
                        <button className="btn btn-primary" onClick={() => { createRoom() }}>Create a room</button>
                    </div>
                    <div className="content">
                        <h1>Rooms:</h1>
                        {
                            rooms.length > 0 ?
                                <div className="rooms">
                                    {
                                        rooms.map((room) =>
                                            <div className="card m-2 p-5 card-form d-flex flex-column">
                                                <h3>{room.player1}'s room</h3>
                                                <p>{countPlayers(room)}/2 players</p>
                                                <button className="btn btn-primary" onClick={() => { joinRoom(room.room_id) }}>Join room</button>
                                            </div>
                                        )
                                    }
                                </div>
                                :
                                <h1>
                                    No rooms
                                </h1>
                        }
                    </div>
                </div>
                :
                <>
                    <h1>LOADING...</h1>
                </>
            }
        </>
    )
}