import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutMe() {
  return (
    <div className="min-h-screen theme-transition" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto theme-transition" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <CardContent className="p-8">
            <h1 className="text-4xl font-bold mb-8 text-center" style={{ color: 'var(--accent)' }}>
              Who is Samrat?
            </h1>
            
            <div className="prose prose-lg max-w-none" style={{ color: 'var(--text-primary)' }}>
              <p className="text-lg leading-relaxed mb-6">
                No one really knows. Some say he's just a Teenager with a Personal Computer and too much Time. 
                Others say he's an AI Prodigy and the last level of Prompt Engineering, still can't interpret it 
                about who is he. He completed all the levels in Backrooms and is back to the reality because he 
                was getting too boring. What we do know is this: whatever he builds, builds for fun somehow ends 
                up better than the "serious" stuff that corporations sweat over (sorry YouTube, sorry Amazon—your 
                UI needs a nap). ~[+∞ Aura]
              </p>

              <p className="text-lg leading-relaxed mb-6">
                He began his so-called "career" in June 2025—which basically means he stopped pretending school 
                made sense. College? Might not make it past 2026. Why? Because dreams don't wait, and this guy's 
                chasing his income goals like they owe him money. Will leave college as soon as the project starts 
                getting moneti~ Shhh~ Let's not tell anyone my 69th secret.
              </p>

              <div className="bg-gradient-to-r from-orange-100 to-orange-50 dark:from-orange-900 dark:to-orange-800 p-6 rounded-lg mb-6">
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--accent)' }}>
                  He lives by three rules:
                </h2>
                <ul className="list-disc list-inside space-y-2 text-lg">
                  <li>Family first.</li>
                  <li>Money next.</li>
                  <li>Mediocre knowledge? Leaving it in the recycling bin. Grades are just a way to earn societal fame.</li>
                </ul>
              </div>

              <p className="text-lg leading-relaxed mb-6">
                Samrat's brain is a cluttered museum of almost everything from ancient societies (half the world, 
                okay—maybe except Africa, long story... <span className="line-through text-gray-500">racist issues</span>) 
                to philosophy and quantum chaos. He knows a little about almost everything—except maybe what he's 
                actually supposed to be doing with his life.
              </p>

              <p className="text-lg leading-relaxed mb-8">
                One minute he's coding, the next he's learning the history of socks, and then somehow building a 
                website with soul. Confused? So is he. That's part of the charm.
              </p>

              <div className="bg-red-100 dark:bg-red-900 p-6 rounded-lg mb-6">
                <h2 className="text-xl font-bold mb-2 text-red-800 dark:text-red-200">
                  ⚠️ DO NOT follow him on Instagram: @stoic_sam_697
                </h2>
                <p className="text-red-700 dark:text-red-300">
                  He's either offline, ghosting the app, or staring at the login screen like it owes him answers.
                </p>
              </div>

              <div className="bg-green-100 dark:bg-green-900 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4 text-green-800 dark:text-green-200">
                  But if you want to join the madness, be trained by a chaotic genius, or just feel like sponsoring his next Coffee:
                </h2>
                <div className="space-y-2 text-green-700 dark:text-green-300">
                  <p>📧 samratvkamble@gmail.com</p>
                  <p>📱 +91 940 320 8670</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}