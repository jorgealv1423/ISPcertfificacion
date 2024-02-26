"use client";
import { useEffect, useState } from 'react';

import axios from 'axios';

type TEvents = {
    id?: number;
    start_time: string;
    end_time: string;
    name: string;
    place: string;
}
type TRes = {
    msg: string;
    data?: any
}


const headers = {
    headers: {
        "Content-Type": "application/json",
    }
}

export default function CrudEventsPage() {
    useEffect(() => {
        getEvents();
    }, []);

    const [events, setEvents] = useState<TEvents[]>([]);
    const [event, setEvent] = useState<TEvents>({
        start_time: "00:00",
        end_time: "00:00",
        name: "",
        place: ""
    });

    const [isEditable, setIsEditable] = useState(false);

    const onChange = (e: any) => {
        const data: any = event;
        data[e.target.name] = e.target.value;
        setEvent(data);
    }



    const getEvents = async () => {
        try {
            const response = await axios.get<TRes>(`${process.env.NEXT_PUBLIC_API_REST_URL}/get`);

            if (response.data.data) {
                setEvents(response.data.data);
            }
        } catch (error) {
            alert(`Hubo un error al realizar la peticion: ${error}`);
        }
    }

    const createEvents = async () => {
        try {
            await axios.post<TRes>(`${process.env.NEXT_PUBLIC_API_REST_URL}/create`, event, headers);
            getEvents();
        } catch (error) {
            alert(`Hubo un error al realizar la peticion: ${error}`);
        }
    }

    const updateEvent = async (id:number) => {
        try {
            await axios.put<TRes>(
                `${process.env.NEXT_PUBLIC_API_REST_URL}/update/${id}`,
                event,
                headers
            );
            getEvents();
            setIsEditable(false);
        } catch (error) {
            alert(`Hubo un error al realizar la peticion: ${error}`);
        }
    }

    const deleteEvent = async (id: number) => {
        try {
            await axios.delete<TRes>(
                `${process.env.NEXT_PUBLIC_API_REST_URL}/delete/${id}`,
            );
            getEvents();
        } catch (error) {
            alert(`Hubo un error al realizar la peticion: ${error}`);
        }
    }

    const preUpdate = (e:TEvents) => {
        setEvent(e);
        setIsEditable(true);
    }

    return (
        <div>
            <h1>CRUD De Eventos</h1>
            <div>
                <label htmlFor="name">Ingresa el nombre del evento:</label><br />
                <input
                    type="text"
                    onChange={(e) => onChange(e)}
                    name='name'
                    placeholder='Nombre'
                /><br/>
                <label htmlFor="start_time">Ingresa el inicio del evento:</label><br />
                <input
                    type="text"
                    onChange={(e) => onChange(e)}
                    name='start_time'
                    placeholder='Inicio'
                /><br/>
                <label htmlFor="end_time">Ingresa el final del evento:</label><br />
                <input
                    type="text"
                    onChange={(e) => onChange(e)}
                    name='end_time'
                    placeholder='Fin'
                /><br/>
                <label htmlFor="place">Ingresa el lugar del evento:</label><br />
                <input
                    type="text"
                    onChange={(e) => onChange(e)}
                    name='place'
                    placeholder='Lugar'
                /><br/>
            </div>
            <button onClick={createEvents}>Agregar evento</button>
            <table>
                <tr>
                    <th>Nombre</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Lugar</th>
                    <th>Opciones</th>
                </tr>
                {events.map((event, index) => (
                    <tr key={index}>
                        <td>{event.name}</td>
                        <td>{event.start_time}</td>
                        <td>{event.end_time}</td>
                        <td>{event.place}</td>
                        <td>
                            <button onClick={() => deleteEvent(event.id ?? 0)}>Delete</button>
                        </td>
                        <td>
                            <button onClick={() => preUpdate(event)}>Update</button>
                        </td>
                    </tr>
                ))}
            </table>

            {
                isEditable && (
                    <div>
                        <h2>Formulario para actualizar</h2>
                        <label htmlFor="name">Ingresa el nombre del evento:</label><br />
                        <input
                            type="text"
                            onChange={(e) => onChange(e)}
                            defaultValue={event.name}
                            name='name'
                        /><br/>
                        <label htmlFor="start_time">Ingresa el inicio del evento:</label><br />
                        <input
                            type="text"
                            onChange={(e) => onChange(e)}
                            defaultValue={event.start_time}
                            name='start_time'
                        /><br/>
                        <label htmlFor="end_time">Ingresa el final del evento:</label><br />
                        <input
                            type="text"
                            onChange={(e) => onChange(e)}
                            defaultValue={event.end_time}
                            name='end_time'
                        /><br/>
                        <label htmlFor="place">Ingresa el lugar del evento:</label><br />
                        <input
                            type="text"
                            onChange={(e) => onChange(e)}
                            defaultValue={event.place}
                            name='place'
                        /><br/>
                        <button onClick={() => updateEvent(event.id ?? 0)}>Guardar</button>
                    </div>
                )
            }
        </div>
    );
}