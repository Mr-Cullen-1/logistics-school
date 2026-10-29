import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <Image
        src="/coliseum-logo-horizontal-light.svg"
        alt="Coliseum Logistics School"
        width={310}
        height={75}
        priority
      />
      <div className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Ingliz tili platformasi</h1>
        <p className="text-base text-[#A7A7A7]">Loyiha asosi tayyorlanmoqda.</p>
      </div>
    </main>
  );
}
