import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WaitlistForm } from "@/components/waitlist-form";
import { Box, Users, Target, Anchor, Heart, Star, Rocket } from "lucide-react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: waitlistCount } = useQuery({
    queryKey: ['/api/waitlist/count'],
  });

  const openWaitlistForm = () => setIsModalOpen(true);
  const closeWaitlistForm = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Box className="text-teal-400 text-2xl" />
              <span className="text-2xl font-bold text-white">AR Rahman</span>
            </div>
            <div className="hidden md:flex">
              <Button
                onClick={openWaitlistForm}
                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-6 py-2 border-0"
              >
                Join Waitlist
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Side-by-Side Layout */}
      <section className="relative py-20 overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-violet-800/30 to-teal-900/40"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="text-left">
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold mb-6 leading-tight text-white">
                Experience the<br />
                <span className="bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">Qur'an</span> Like<br />
                Never Before
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed max-w-2xl">
                Be among the first to access an Augmented Reality tool that brings the meaning of the Qur'an to life — directly during your prayer.
              </p>
              <p className="text-lg mb-10 text-gray-300 leading-relaxed max-w-2xl">
                We're pioneering a revolutionary approach to deepen your connection with Allah through cutting-edge Augmented Reality. 
                Imagine understanding the divine words as they flow through your heart — experiencing real-time comprehension while you stand in prayer. 
                This is the future of spiritual immersion, where technology serves the soul.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  onClick={openWaitlistForm}
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-8 py-4 text-lg font-semibold border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Join the Waitlist
                </Button>
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
                >
                  Visit Main Site
                </Button>
              </div>
              <div className="flex items-center space-x-2 text-teal-300">
                <Users className="w-5 h-5" />
                <span className="font-medium">
                  {waitlistCount?.count || 1000}+ believers on the waitlist
                </span>
              </div>
            </div>

            {/* Right Side - Video */}
            <div className="relative">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10">
                <div style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
                  <iframe
                    src="https://player.vimeo.com/video/1100864847?badge=0&autopause=0&player_id=0&app_id=58479"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    title="AR Rahman Intro Video"
                  />
                </div>
                <script src="https://player.vimeo.com/api/player.js"></script>
              </div>
              <p className="text-center text-gray-300 text-sm mt-4">
                Experience how AR technology transforms your prayer experience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Why This Matters</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover how real-time Qur'anic understanding can transform your spiritual journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Supercharge Your Focus</h3>
                <p className="text-gray-300">
                  Experience unprecedented concentration as the meaning unfolds before you in real-time
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Anchor className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Prevent Mind Drifting</h3>
                <p className="text-gray-300">
                  Stay present and engaged with divine guidance that keeps your heart anchored
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Deepen Spiritual Awareness</h3>
                <p className="text-gray-300">
                  Unlock layers of meaning that transform your understanding of each verse
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-violet-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Achieve Ihsan</h3>
                <p className="text-gray-300">
                  Achieve the highest level of worship through conscious, mindful connection
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Presence Matters */}
      <section className="py-20 bg-gradient-to-br from-purple-900 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">Why Presence in Salah Matters</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Uncover how complete presence and attentiveness during prayer, guided by the revealed text, can transform your inner and outer life.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="text-center bg-white/5 p-8 rounded-xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Islamic geometric pattern representing inner transformation"
                className="rounded-xl shadow-lg w-full h-64 object-cover mb-6"
              />
              <h3 className="text-2xl font-bold text-white mb-4">Inner Transformation</h3>
              <p className="text-gray-300 text-lg">
                Experience profound spiritual awakening as each word resonates with deeper meaning and purpose.
              </p>
            </div>

            <div className="text-center bg-white/5 p-8 rounded-xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <img
                src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Beautiful mosque interior representing heart connection"
                className="rounded-xl shadow-lg w-full h-64 object-cover mb-6"
              />
              <h3 className="text-2xl font-bold text-white mb-4">Heart Connection</h3>
              <p className="text-gray-300 text-lg">
                Forge an unbreakable bond with Allah through conscious, mindful engagement with His words.
              </p>
            </div>

            <div className="text-center bg-white/5 p-8 rounded-xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Peaceful mountain path representing divine guidance"
                className="rounded-xl shadow-lg w-full h-64 object-cover mb-6"
              />
              <h3 className="text-2xl font-bold text-white mb-4">Life Guidance</h3>
              <p className="text-gray-300 text-lg">
                Let divine wisdom illuminate your path, bringing clarity and peace to every aspect of your life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-teal-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Join the Waitlist</h2>
          <p className="text-xl mb-8 text-gray-300">
            Be part of our early access community and help shape the future of spiritually intelligent technology.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Rocket className="text-3xl mb-4 mx-auto text-teal-400" />
              <h3 className="text-xl font-semibold mb-2">Early Access</h3>
              <p className="text-gray-300">Be the first to experience this revolutionary spiritual technology</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Users className="text-3xl mb-4 mx-auto text-purple-400" />
              <h3 className="text-xl font-semibold mb-2">Shape the Future</h3>
              <p className="text-gray-300">Your feedback will directly influence the development process</p>
            </div>
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300">
              <Heart className="text-3xl mb-4 mx-auto text-pink-400" />
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-300">Connect with like-minded believers on this spiritual journey</p>
            </div>
          </div>

          <Button
            onClick={openWaitlistForm}
            className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-12 py-4 text-xl font-bold border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Join the Waitlist
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Box className="text-teal-400 text-2xl" />
              <span className="text-2xl font-bold">AR Rahman</span>
            </div>
            <div className="text-gray-400">
              <p>&copy; 2024 AR Rahman. Transforming spiritual connection through technology.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Waitlist Form Modal */}
      {isModalOpen && (
        <WaitlistForm onClose={closeWaitlistForm} />
      )}
    </div>
  );
}
