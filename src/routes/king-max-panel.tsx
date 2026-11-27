import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DeskGate } from "@/components/desk-gate";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCatalog } from "@/lib/catalog";
import { closeDesk, deskOpen } from "@/lib/desk";

export const Route = createFileRoute("/king-max-panel")({
  component: DeskPage,
});

function DeskPage() {
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setUnlocked(deskOpen());
    setReady(true);
  }, []);

  if (!ready) return <div className="grid min-h-screen place-items-center">Loading…</div>;
  if (!unlocked) return <DeskGate onUnlock={() => setUnlocked(true)} />;

  return <Editor onLock={() => { closeDesk(); setUnlocked(false); }} />;
}

function Editor({ onLock }: { onLock: () => void }) {
  const products = useCatalog((s) => s.products);
  const addProducts = useCatalog((s) => s.addProducts);
  const removeProduct = useCatalog((s) => s.removeProduct);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !affiliateUrl) return;
    addProducts([{ title, description, affiliateUrl, imageDataUrl }]);
    setTitle("");
    setDescription("");
    setAffiliateUrl("");
    setImageDataUrl("");
  };

  return (
    <div className="min-h-screen bg-mist">
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-extrabold">Product Desk</h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button onClick={onLock} className="text-sm font-semibold text-link">Lock</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-8">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-md border border-line bg-paper p-6">
          <h2 className="text-lg font-bold">Create Product Page</h2>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Product title" className="w-full rounded border px-3 py-2" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" className="w-full rounded border px-3 py-2" rows={3} />
          <input value={affiliateUrl} onChange={(e) => setAffiliateUrl(e.target.value)} placeholder="Amazon affiliate link" className="w-full rounded border px-3 py-2" />
          <input type="file" accept="image/*" onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => setImageDataUrl(reader.result as string);
            reader.readAsDataURL(file);
          }} />
          <button type="submit" className="rounded bg-orange px-6 py-2 font-semibold text-black">Generate Page</button>
        </form>

        <section>
          <h2 className="mb-4 text-lg font-bold">Created Products</h2>
          <ul className="space-y-2">
            {products.map((p) => (
              <li key={p.id} className="flex items-center justify-between rounded border bg-paper p-3">
                <span>{p.title}</span>
                <button onClick={() => removeProduct(p.id)} className="text-sm text-red-600">Delete</button>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}