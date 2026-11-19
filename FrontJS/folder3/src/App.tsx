import { useState } from "react";
import Counter from "./Counter";

interface CounterItem {
  id: number;
  startTime: string;
  endTime: string | null;
  completed: boolean;
}

export default function APP(){
  const [counters, setCounters] = useState<CounterItem[]>([]);

  const handleCreate = () => {
    const newCounter = {
      id: Date.now(),
      startTime: new Date().toLocaleTimeString(),
      endTime: null,
      completed: false
    };

    setCounters([...counters, newCounter]);
};

  return (
    <div style = {{padding: '20px'}}>
      <h1>Countdown Timers</h1>

      <button onClick = {handleCreate}>
        Create Counter
      </button>
      <div style = {{marginTop:'20px'}}>
        {counters.map((counter) => (
          <Counter key={counter.id} counter={counter} />
        ))}
      </div>
    </div>
  )
}