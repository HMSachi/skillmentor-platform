export default function AboutPage() {
  return (
    <section className="container py-14 sm:py-20">
      <div className="max-w-3xl rounded-2xl border border-border bg-card p-6 sm:p-10 shadow-sm">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          About Us
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
          SkillMentor connects learners with experienced industry mentors for
          practical, career-focused sessions. We help you build confidence in
          certifications, interviews, and real-world skills through guided
          one-on-one mentorship.
        </p>
      </div>
    </section>
  );
}