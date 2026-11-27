import { useState } from "react";
import { DESK_PASSWORD, openDesk } from "@/lib/desk";

export function DeskGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  return (
    <div className="grid min-h-screen place-items-center bg-mist px-4">
      <form
        className="w-full max-w-md rounded-md border border-line bg-paper p-6 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          if (password.trim() === DESK_PASSWORD) {
            openDesk();
            onUnlock();
          } else {
            setError(true);
          }
        }}
      >
        <h1 className="text-xl font-extrabold">Enter the desk</h1>
        <p className="mt-1 text-sm text-muted">Password required for admin panels.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false); }}
          className="mt-4 w-full rounded-md border border-line px-3 py-2"
          placeholder="Password"
        />
        {error && <p className="mt-2 text-sm text-red-600">Wrong password</p>}
        <button type="submit" className="mt-4 w-full rounded-md bg-orange py-2 font-semibold text-black">
          Unlock
        </button>
      </form>
    </div>
  );
}