import { useState, useEffect } from "react";
interface CounterProps{
    counter: {
        id: number;
        startTime: string;
        endTime: string | null;
        completed: boolean;
    };
}

export default function Counter({counter}: CounterProps){
    const [timeLeft, setTimeLeft] = useState(10);

    useEffect(() => {
        if(timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);
    
    return (
        <div style={{border: '1px solid #ccc', padding: '10px', margin: '5px'}}>
            <p>clock id: {counter.id}</p>
            <p>started {counter.startTime}</p>
        </div>
    );
}