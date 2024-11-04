import { View, Text } from 'react-native';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_URL, API_VERSION, END_POINTS } from '@/configs/api.config';
import { useAuthContext } from './AuthContext';

const RoomContext = createContext();

const RoomProvider = ({ children }) => {

    const { userData } = useAuthContext();
    const [rooms, setRooms] = useState([]);
    const [room, setRoom] = useState([]);

	const createRoom = async (room_code, quiz_id, user_created_id, user_max, description) => {
		const response = await fetch(
			`${API_URL}${API_VERSION.V1}${END_POINTS.ROOM_CREATE}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-client-id': userData._id,
					authorization: userData.accessToken,
				},
                body: JSON.stringify({
                    room_code, 
                    quiz_id, 
                    user_created_id, 
                    user_max, 
                    description: description || 'no desc'
                })
			}
		);

		const data = await response.json();
        
		if (data.statusCode === 200) {
			setRoom(data.metadata);
		}
	};

	return (
		<RoomContext.Provider value={{ 
            room,
            rooms,
            createRoom,
            setRoom,
        }}>
			{children}
		</RoomContext.Provider>
	);
};

export const useRoomProvider = () => useContext(RoomContext);

export default RoomProvider;
