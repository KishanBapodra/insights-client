import { useState, useEffect } from "react"
import { useHistory } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useUser } from '../context/user'
import AppBar from '../AppBar/bar'
import CreateRoomPopup from "./create.room.popup";
import JoinRoomPopup from "./join.room.popup";
import { AppBarButtons } from "./appbar.buttons";
import styles from './rooms.module.css'
import roomCovers from '../assets/room.covers'

export default function Rooms() {
	const [appBarStatus, setAppBarStatus] = useState(null);
	const { userData } = useUser()
	const [roomData, setRoomData] = useState({});
	const history = useHistory()
	console.log("Rooms component - context: ", userData)

	useEffect(() => {
		userData.data?.previousRooms.forEach(roomId => { 
			getDoc(doc(db, "virtual-spaces", roomId)).then(snap => {
				const room = snap.data()
				setRoomData(prev => {
					return {
						...prev,
						[roomId]: room
					}
				})
			})
		})
	}, [userData.data?.previousRooms]);

	function onStatusChange(e) {
		e.preventDefault()
		const val = e.target.id
		setAppBarStatus(val)
	}

	const handleJoinOldRoom = (e) => {
		e.preventDefault()
		const roomId = e.target.value;
		console.clear()
		history.push(`/app/vs/${roomId}`)
	}

	const hideForm = () => { 
		setAppBarStatus(null)
	}

	return (
		<>
			<AppBar onClickHandler={onStatusChange} buttons={AppBarButtons} />
			{
				appBarStatus === "create-new-room" ? <CreateRoomPopup onCancel={hideForm} /> : (
					appBarStatus === "join-new-room" && <JoinRoomPopup onCancel={hideForm} />
				)
			}
			<div className={styles["rooms-container"]}>
				{
					userData.data?.previousRooms.map((roomId, index) => {
						if (!roomData[roomId]) return <p key={index} >Loading...</p>
						const randomRoom = roomCovers[Math.floor(Math.random() * roomCovers.length)]
						const roomSize = roomData[roomId]?.owners.length
						const subheading = `${roomSize} member` + ( roomSize > 1 ? "s" : "")
						console.log(roomData[roomId], roomSize, subheading)
						return (
							<div className={styles['rooms-item-container']} key={index} value={roomId} onClick={handleJoinOldRoom}>
								<div className={styles['image']}><img alt="Room cover" src={randomRoom}></img></div>
								<div className={styles['title']}>
									{/* <h2>{roomData[roomId] ? `${roomData[roomId].owners[0]}'s Room` : "Loading..."}</h2> */}
									<p style={{color: "grey", fontSize: "smaller", fontWeight: "lighter"}}>Room</p>
									<p style={{fontWeight: "bolder"}}>{roomData[roomId] ? roomData[roomId].name : "Loading..."}</p>
									<p style={{color: "grey"}}>{roomData[roomId] ? subheading : "Loading..."}</p>
								</div>
								<div className={styles['button']}><button  value={roomId} onClick={handleJoinOldRoom}>Join Room</button></div>
							</div>
						)
					})
				}
			</div>
		</>
	)
}
