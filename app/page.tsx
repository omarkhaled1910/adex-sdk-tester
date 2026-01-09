import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 dark:from-zinc-950 dark:via-rose-950/20 dark:to-zinc-900">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-zinc-900/70 border-b border-rose-200/50 dark:border-rose-800/30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/25">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-semibold text-zinc-800 dark:text-zinc-100 tracking-tight">
              Shell App
            </span>
            <div id="fb2df6c2-dd7f-4160-8f7f-2f68c60e814d"></div>
            <span className="px-2 py-1 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300 text-xs font-medium">
              Zone 1
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 rounded-full text-rose-600 dark:text-rose-400 font-medium text-sm hover:bg-rose-100 dark:hover:bg-rose-900/30 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/remote"
              className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium text-sm shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30 hover:scale-105 transition-all duration-300"
            >
              <span>Remote App</span>
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Floating shapes background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-40 left-20 w-72 h-72 bg-rose-300/30 dark:bg-rose-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-60 right-20 w-96 h-96 bg-orange-300/30 dark:bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-40 left-1/2 w-80 h-80 bg-amber-300/30 dark:bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Multi-Zone Micro-Frontend Shell
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
              Welcome to the{" "}
              <span className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                Shell App
              </span>
            </h1>

            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              This is the main host application using Next.js{" "}
              <strong>Multi-Zone Architecture</strong>. It orchestrates routing
              and seamlessly integrates the remote micro-frontend.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/remote"
                className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold text-lg shadow-2xl shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-105 transition-all duration-300"
              >
                <span>Go to Remote App</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>

            {/* Architecture Diagram */}
            <div className="mt-16 p-8 rounded-3xl bg-white/60 dark:bg-zinc-800/60 backdrop-blur-sm border border-rose-200/50 dark:border-rose-800/30">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">
                🏗️ How Multi-Zone Works
              </h3>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-900/20 border-2 border-rose-300 dark:border-rose-700 min-w-[200px]">
                  <p className="font-mono text-sm text-rose-700 dark:text-rose-300 font-bold">
                    Shell (Zone 1)
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">localhost:3000</p>
                  <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                    <div className="py-1">/ → Shell Home</div>
                    <div className="py-1 text-teal-600 dark:text-teal-400">
                      /remote/* → Rewrite
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <svg
                    className="w-8 h-8 text-zinc-400 rotate-90 md:rotate-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                  <span className="text-xs text-zinc-400 mt-1">rewrite</span>
                </div>

                <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-300 dark:border-teal-700 min-w-[200px]">
                  <p className="font-mono text-sm text-teal-700 dark:text-teal-300 font-bold">
                    Remote (Zone 2)
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">localhost:3001</p>
                  <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                    <div className="py-1">basePath: /remote</div>
                    <div className="py-1">/remote → Remote Home</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="group p-6 rounded-3xl bg-white/60 dark:bg-zinc-800/60 backdrop-blur-sm border border-rose-200/50 dark:border-rose-800/30 hover:border-rose-300 dark:hover:border-rose-700 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center mb-4 shadow-lg shadow-rose-500/25 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                  App Router Ready
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Both zones use Next.js App Router with full RSC support.
                </p>
              </div>

              <div className="group p-6 rounded-3xl bg-white/60 dark:bg-zinc-800/60 backdrop-blur-sm border border-orange-200/50 dark:border-orange-800/30 hover:border-orange-300 dark:hover:border-orange-700 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mb-4 shadow-lg shadow-orange-500/25 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                  Seamless Navigation
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Users navigate between zones without noticing the boundary.
                </p>
              </div>

              <div className="group p-6 rounded-3xl bg-white/60 dark:bg-zinc-800/60 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/30 hover:border-amber-300 dark:hover:border-amber-700 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                  Independent Teams
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  Each zone can be owned by different teams with separate repos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-zinc-500 dark:text-zinc-600 text-sm">
        <p>
          Shell App •{" "}
          <span className="font-mono text-rose-500">localhost:3000</span>
        </p>
      </footer>
    </div>
  );
}
