// components/CountdownTimer.js
import { useState, useEffect } from 'react';
import { getTimeRemaining } from '../services/contestUtilityService';

export default function CountdownTimer({ targetTime, type }) {
    const [timeRemaining, setTimeRemaining] = useState('00:00:00');

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const target = new Date(targetTime);

            if (now >= target) {
                setTimeRemaining('00:00:00');
                return;
            }

            setTimeRemaining(getTimeRemaining(target, now));
        };

        // Initial update
        updateTimer();

        // Update every second
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [targetTime]);

    const getTypeText = () => {
        return type === 'start' ? 'Starts in: ' : 'Ends in: ';
    };

    const getTypeClass = () => {
        return type === 'start' ? 'text-blue-600' : 'text-green-600';
    };

    return (
        <div className={`font-medium ${getTypeClass()}`}>
            {getTypeText()} {timeRemaining}
        </div>
    );
}