import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { DeskGate } from "@/components/desk-gate";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCatalog, useCatalogHydrated } from "@/lib/catalog";
import { closeDesk, deskOpen } from "@/lib/desk";
import { useInbox, useInboxHydrated } from "@/lib/inbox";
import { startOfDay, startOfWeek, useTracking, useTrackingHydrated } from "@/lib/tracking";

export const Route = createFileRoute("/king-max-panel2")({
  head: () => ({
    meta: [{ title: "Tracking · Demanding" }, { name: "robots", content: "noindex" }],
  }),
  component: TrackingPage,
});

function TrackingPage() {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setUnlocked(deskOpen());
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-mist px-4">
        <p className="text-sm font-semibold text-muted">Opening the desk…</p>
      </div>
    );
  }

  if (!unlocked) return <DeskGate onUnlock={() => setUnlocked(true)} />;

  return (
    <Dashboard
      onLock={() => {
        closeDesk();
        setUnlocked(false);
      }}
    />
  );
}

// Full tracking dashboard component continues here
function Dashboard({ onLock }: { onLock: () => void }) {
  return (
    <div className="min-h-screen bg-mist">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-extrabold">Tracking Dashboard</h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button onClick={onLock} className="text-sm font-semibold text-link hover:underline">Lock</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-muted">Tracking data will appear here after deployment.</p>
      </main>
    </div>
  );
}