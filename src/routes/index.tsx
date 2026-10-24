import { createFileRoute } from "@tanstack/react-router";
import { Search, ShieldCheck, Target, BellRing, MousePointerClick, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OppPilot — AI agent for scholarships, internships & schemes" },
      { name: "description", content: "OppPilot finds, verifies and prepares every scholarship, internship, hackathon and government scheme Indian students qualify for." },
      { property: "og:title", content: "OppPilot — Never miss an opportunity" },
      { property: "og:description", content: "An AI agent that finds, checks and prepares every opportunity you qualify for, before the deadline." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const features = [
  { title: "Discover", icon: Search, bg: "bg-mint", span: "md:col-span-2 md:row-span-2", text: "Scans scholarships, internships, hackathons and government schemes across India, every day, so you don't have to.", big: true },
  { title: "Verify", icon: ShieldCheck, bg: "bg-lavender", span: "md:col-span-2", text: "Checks every listing against official sources and flags scams before they reach you." },
  { title: "Match", icon: Target, bg: "bg-peach", span: "", text: "Ranks opportunities by your course, state, income and skills." },
  { title: "Prep & Remind", icon: BellRing, bg: "bg-sky", span: "", text: "Drafts essays, lists documents and nudges you before deadlines." },
  { title: "You always press submit", icon: MousePointerClick, bg: "bg-butter", span: "md:col-span-4", text: "OppPilot prepares everything, but never applies on your behalf. You review, you decide, you hit submit." },
];

function Index() {
  return (
    <main className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 fade-up">
        <div className="flex items-center gap-2 text-lg font-bold">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="h-5 w-5" /></span>
          OppPilot
        </div>
        <button className="btn-pop rounded-full bg-card px-5 py-2 text-sm font-medium">Sign in</button>
      </header>

      <section className="mx-auto max-w-4xl px-6 pb-16 pt-12 text-center md:pt-20">
        <span className="fade-up inline-block rounded-full bg-lavender px-4 py-1 text-sm font-medium">For Indian college students</span>
        <h1 className="fade-up mt-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl" style={{ animationDelay: "100ms" }}>
          An AI agent that finds, checks and prepares every opportunity you qualify for, <span className="text-primary">before the deadline</span>
        </h1>
        <p className="fade-up mx-auto mt-6 max-w-2xl text-lg text-muted-foreground" style={{ animationDelay: "200ms" }}>
          Scholarships, internships, hackathons and government schemes — matched to you and ready to apply.
        </p>
        <button className="btn-pop fade-up mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground" style={{ animationDelay: "300ms" }}>
          Get started <ArrowRight className="h-5 w-5" />
        </button>
      </section>

      <section className="mx-auto grid max-w-6xl auto-rows-[minmax(180px,auto)] grid-cols-1 gap-5 px-6 pb-24 md:grid-cols-4">
        {features.map((f, i) => (
          <article key={f.title} className={`card-soft fade-up flex flex-col justify-between p-7 ${f.bg} ${f.span}`} style={{ animationDelay: `${400 + i * 80}ms` }}>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-card"><f.icon className="h-6 w-6 text-primary" /></span>
            <div className="mt-6">
              <h2 className={`font-bold ${f.big ? "text-3xl md:text-4xl" : "text-xl"}`}>{f.title}</h2>
              <p className={`mt-2 text-muted-foreground ${f.big ? "text-lg" : ""}`}>{f.text}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
