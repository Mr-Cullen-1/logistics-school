import Image from "next/image";
import Link from "next/link";

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
        <p className="text-base text-steel">Platforma bosqichma-bosqich tayyorlanmoqda.</p>
      </div>
      <Link href="/design-system" className="inline-flex min-h-11 items-center rounded-[8px] border border-gold bg-gold px-5 text-sm font-semibold text-charcoal transition hover:-translate-y-px hover:bg-[#E2BF90] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
        Dizayn tizimini ko‘rish
      </Link>
    </main>
  );
}
