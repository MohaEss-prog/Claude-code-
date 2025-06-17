import { useState } from "react";

export default function Terminal() {
  const [history, setHistory] = useState([]);
  const [command, setCommand] = useState("");

  const runCommand = async () => {
    if (!command.trim()) return;
    const newHistory = [...history, { type: "input", text: command }];
    setHistory(newHistory);
    setCommand("");

    const res = await fetch("/api/terminal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: command }),
    });

    const data = await res.json();
    setHistory((prev) => [...prev, { type: "output", text: data.response }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      runCommand();
    }
  };

  return (
    <div>
      {history.map((entry, i) => (
        <div key={i} className="mb-2">
          <span className="block">
            {entry.type === "input" ? `$ ${entry.text}` : entry.text}
          </span>
        </div>
      ))}
      <div className="flex">
        <span className="mr-2">$</span>
        <input
          className="bg-transparent border-none outline-none text-green-400 w-full"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      </div>
    </div>
  );
}
