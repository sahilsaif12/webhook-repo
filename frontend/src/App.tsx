import React, { useEffect, useState } from "react";
import "./App.css";

interface Event {
  _id: string;
  author: string;
  action_type: string;
  from_branch?: string;
  to_branch?: string;
  timestamp: string;
}

const App: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [countdown, setCountdown] = useState(15);
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;

    const fetchEvents = async () => {
      try {
    const res = await fetch(`${SERVER_URL}/events`);
        const data = await res.json();        
        setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    };

    const startPolling = () => {
      fetchEvents().then(() => {
        setCountdown(15);
      });
    };

    startPolling();

    timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          startPolling();
          return 0; 
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatEvent = (event: Event) => {
    const date = new Date(event.timestamp);
    const formattedDate = date.toLocaleString("en-us", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "UTC",
      timeZoneName: "short"
    });
  

    switch (event.action_type) {
      case "push":
        return (
          <>
            <span className="icon push">🔵</span>
            " {event.author} " pushed to " {event.to_branch} " on {formattedDate}
          </>
        );
      case "pull_request":
        return (
          <>
            <span className="icon pr">🟡</span>
            " {event.author} " submitted a pull request from " {event.from_branch} " to " {event.to_branch} " on {formattedDate}
          </>
        );
      case "merge":
        return (
          <>
            <span className="icon merge">🟢

            </span>
           " {event.author} " merged branch " {event.from_branch} " to " {event.to_branch} " on {formattedDate}
          </>
        );
      }
    }
  return (
    <div className="root">

    <div className="container">
      <h1>GitHub Webhook Events Viewer</h1>
      <div className="refresh-timer">Refreshing in {countdown} second{countdown !== 1 ? "s" : ""}</div>
      <div className="log-container">
        {events.length === 0 ? (
          <p>No events yet.</p>
        ) : (
          events.map((e) => (
            <div key={e._id} className="log-item">
              {formatEvent(e)}
            </div>
          ))
        )}
      </div>
    </div>
    </div>
  );

}

export default App;
