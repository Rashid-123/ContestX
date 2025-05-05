"use client";

import { useState, useEffect } from "react";
import formatEvents from "../hooks/github"; // make sure this function is exported

const Github_activity = ({ user }) => {

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            if (!user?.github) return;
            setLoading(true);
            try {
                const formatted = await formatEvents(user.github);
                setEvents(formatted);
                // console.log(formatted);
            } catch (error) {
                console.error("Failed to fetch GitHub events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [user]);

    return (
        <div className="p-4 rounded-2xl bg-white shadow-md">
            <h2 className="text-xl font-semibold mb-4">GitHub Recent Activity</h2>

            {loading ? (
                <p>Loading events...</p>
            ) : events.length === 0 ? (
                <p>No recent activity found.</p>
            ) : (
                <ul className="space-y-4">
                    {events.map((event, index) => (
                        <li
                            key={index}
                            className="border p-4 rounded-xl hover:border-blue-500 transition"
                        >
                            <p className="text-sm text-gray-500">{new Date(event.created_at).toLocaleString()}</p>
                            <p className="font-medium">{event.type}</p>
                            <p>{event.detail}</p>
                            <a
                                href={event.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                View on GitHub →
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Github_activity;
