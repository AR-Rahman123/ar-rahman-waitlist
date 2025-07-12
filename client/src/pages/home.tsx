import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WaitlistForm } from "@/components/waitlist-form";
import { Box, Users, Target, Anchor, Heart, Star, Rocket } from "lucide-react";

export default function Home() {
  console.log("Home component rendering");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: waitlistCount } = useQuery({
    queryKey: ['/api/waitlist/count'],
  });

  const openWaitlistForm = () => setIsModalOpen(true);
  const closeWaitlistForm = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-spiritual-light">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Box className="text-spiritual-blue text-2xl" />
              <span className="text-2xl font-bold text-spiritual-dark">AR Rahman</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-spiritual-blue transition-colors">Home</a>
              <a href="#" className="text-gray-600 hover:text-spiritual-blue transition-colors">About</a>
              <a href="#" className="text-spiritual-blue font-medium">Waitlist</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="spiritual-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-red-600 text-white p-4 mb-6 rounded-lg">
            <p className="text-xl font-bold">🔴 TEST: If you see this red box, updates are working!</p>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Experience the Qur'an<br />
            <span className="text-blue-200">Like Never Before</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
            Be among the first to access an Augmented Reality tool that brings the meaning of the Qur'an to life — directly during your prayer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              onClick={openWaitlistForm}
              className="bg-spiritual-amber hover:bg-amber-600 text-white px-8 py-4 text-lg font-semibold"
            >
              Join the Waitlist
            </Button>
          </div>
          <div className="flex items-center justify-center space-x-2 text-blue-200">
            <Users className="w-5 h-5" />
            <span className="font-medium">
              {waitlistCount?.count || 1000}+ believers on the waitlist
            </span>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-spiritual-dark mb-4">Experience AR Prayer Technology</h2>
            <p className="text-gray-600 text-lg">See how AR technology transforms your prayer experience</p>
          </div>
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              src="https://www.youtube.com/embed/f1pqhZO3Lik?si=ja1kjRrIDW_N3mKg"
              title="AR Rahman Prayer Experience"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Why This Matters */}
      <section className="py-20 bg-spiritual-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-spiritual-dark mb-6">Why This Matters</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how real-time Qur'anic understanding can transform your spiritual journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-spiritual-blue rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-spiritual-dark mb-4">Supercharge Your Focus</h3>
                <p className="text-gray-600">
                  Experience unprecedented concentration as the meaning unfolds before you in real-time
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-spiritual-emerald rounded-full flex items-center justify-center mx-auto mb-6">
                  <Anchor className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-spiritual-dark mb-4">Prevent Mind Drifting</h3>
                <p className="text-gray-600">
                  Stay present and engaged with divine guidance that keeps your heart anchored
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-spiritual-amber rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-spiritual-dark mb-4">Deepen Spiritual Awareness</h3>
                <p className="text-gray-600">
                  Unlock layers of meaning that transform your understanding of each verse
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-semibold text-spiritual-dark mb-4">Achieve Ihsan</h3>
                <p className="text-gray-600">
                  Achieve the highest level of worship through conscious, mindful connection
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Presence Matters */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-spiritual-dark mb-6">Why Presence in Salah Matters</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Uncover how complete presence and attentiveness during prayer, guided by the revealed text, can transform your inner and outer life.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Islamic geometric pattern representing inner transformation"
                className="rounded-xl shadow-lg w-full h-64 object-cover mb-6"
              />
              <h3 className="text-2xl font-bold text-spiritual-dark mb-4">Inner Transformation</h3>
              <p className="text-gray-600 text-lg">
                Experience profound spiritual awakening as each word resonates with deeper meaning and purpose.
              </p>
            </div>

            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Beautiful mosque interior representing heart connection"
                className="rounded-xl shadow-lg w-full h-64 object-cover mb-6"
              />
              <h3 className="text-2xl font-bold text-spiritual-dark mb-4">Heart Connection</h3>
              <p className="text-gray-600 text-lg">
                Forge an unbreakable bond with Allah through conscious, mindful engagement with His words.
              </p>
            </div>

            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                alt="Peaceful mountain path representing divine guidance"
                className="rounded-xl shadow-lg w-full h-64 object-cover mb-6"
              />
              <h3 className="text-2xl font-bold text-spiritual-dark mb-4">Life Guidance</h3>
              <p className="text-gray-600 text-lg">
                Let divine wisdom illuminate your path, bringing clarity and peace to every aspect of your life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 spiritual-gradient text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Join the Waitlist</h2>
          <p className="text-xl mb-8 text-blue-100">
            Be part of our early access community and help shape the future of spiritually intelligent technology.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <Rocket className="text-3xl mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Early Access</h3>
              <p className="text-blue-100">Be the first to experience this revolutionary spiritual technology</p>
            </div>
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <Users className="text-3xl mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Shape the Future</h3>
              <p className="text-blue-100">Your feedback will directly influence the development process</p>
            </div>
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <Heart className="text-3xl mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-blue-100">Connect with like-minded believers on this spiritual journey</p>
            </div>
          </div>

          <Button
            onClick={openWaitlistForm}
            className="bg-spiritual-amber hover:bg-amber-600 text-white px-12 py-4 text-xl font-bold"
          >
            Join the Waitlist
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-spiritual-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Box className="text-spiritual-amber text-2xl" />
              <span className="text-2xl font-bold">AR Rahman</span>
            </div>
            <div className="text-gray-300">
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
