import Chat from "@/components/chat";

export default function Home() {
  return (
    <main className="relative container flex flex-col min-h-screen">
      <div className="flex flex-1 py-4">
        <div className="w-full">
          <Chat />
        </div>
      </div>
    </main>
  );
}
