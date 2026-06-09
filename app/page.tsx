import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 sm:px-12 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          nudge
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors inline-block">
            Log In
          </Link>
          <Link href="/signup" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow inline-block">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 sm:px-12 sm:py-32 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Stay Organized, Get More Done
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            TaskFlow helps you manage your tasks efficiently with an intuitive, beautiful interface designed for productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-2xl transition-all transform hover:scale-105 text-center">
              Start for Free
            </Link>
            <button className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg hover:border-blue-600 dark:hover:border-blue-500 transition-colors">
              Learn More
            </button>
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative w-full aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 sm:px-12 py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-16">
            Powerful Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Quick & Easy
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create and manage tasks in seconds with our intuitive interface.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Stay Focused
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Prioritize your tasks and focus on what matters most today.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Track Progress
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Visualize your productivity with detailed progress tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 sm:px-12 py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Boost Your Productivity?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of users already using TaskFlow to manage their tasks.
        </p>
        <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:shadow-2xl transition-all transform hover:scale-105">
          Start Free Trial
        </button>
      </section>

      {/* Footer */}
      <footer className="px-6 sm:px-12 py-12 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2026 TaskFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
