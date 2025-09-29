export default function Features() {
  return (
    <section className="py-16 sm:py-24" id="features">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            How FinWell Works
          </h2>
          <p className="mt-4 text-lg text-white">
            FinWell combines behavioral finance principles with cutting-edge technology
            to provide personalized financial guidance.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            {
              icon: "insights",
              title: "Personalized Insights",
              desc: "Receive tailored insights into your financial behavior and spending patterns.",
            },
            {
              icon: "support_agent",
              title: "Proactive Coaching",
              desc: "Get proactive guidance and support to stay on track with your financial goals.",
            },
            {
              icon: "savings",
              title: "Goal-Oriented Approach",
              desc: "Set and achieve your financial goals with personalized action plans.",
            },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                <span className="material-symbols-outlined">{icon}</span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-base text-white">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
