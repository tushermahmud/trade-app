"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [tradeInfo, setTradeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trading, setTrading] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4000");
    socket.onopen = function (e) {
      setWs(socket);
      socket.send("Hello Server!");
    };

    socket.onmessage = function (event) {
      setTradeInfo(JSON.parse(event.data));
      setLoading(false);
      setTrading(false);
    };

    socket.onclose = function (event) {
      if (event.wasClean) {
        console.log(
          `Connection closed cleanly, code=${event.code}, reason=${event.reason}`
        );
      } else {
        // e.g. server process killed or network down
        console.log("Connection died");
      }
    };

    socket.onerror = function (error) {
      console.log(`WebSocket error: ${error}`);
    };
    return () => socket.close();
  }, []);

  const handleTrade = () => {
    console.log(ws);
    if (ws) {
      setTrading(true);
      ws.send("Trade");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">Trading Platform</h1>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={handleTrade}
          disabled={trading}
        >
          {trading ? "Trading..." : "Trade"}
        </button>
        {loading ? (
          <div className="text-lg text-gray-500">Loading: Trading...</div>
        ) : trading ? (
          <div className="text-lg text-gray-500">Loading: Trading...</div>
        ) : tradeInfo ? (
          <div>
            <h2 className="text-xl font-semibold mb-2">Your Trade Details</h2>
            <pre className="bg-gray-200 p-4 rounded overflow-auto text-black">
              {JSON.stringify(tradeInfo, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="text-red-500">No trade information available.</div>
        )}
      </div>
    </div>
  );
}
