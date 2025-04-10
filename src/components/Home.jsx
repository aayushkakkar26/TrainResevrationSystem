

import { Link } from "react-router-dom"
import { ChevronRight, Train, User, UserPlus } from "lucide-react"
import trainLogo from "../assets/train.png"
const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
  
      <div className="container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center gap-12">
        <div className="lg:w-1/2 space-y-8">
          <div
            className="inline-block bg-blue-600/20 rounded-full p-2 mb-4"
            style={{
              animation: "bounce 3s infinite",
            }}
          >
            <Train className="w-6 h-6 text-blue-400" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Train Seat</span>{" "}
            Reservation System
          </h1>

          <p className="text-gray-300 text-lg max-w-xl">
            Book your train tickets effortlessly, choose your preferred seat, and manage your journey seamlessly – all
            in one place.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Link to="/login">
              <button className="group relative overflow-hidden bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>Login</span>
                <ChevronRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </button>
            </Link>
            <Link to="/signup">
              <button className="group relative overflow-hidden bg-gray-800 border border-gray-700 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-all duration-300 flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                <span>Sign Up</span>
                <ChevronRight className="w-5 h-5 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </button>
            </Link>
          </div>
        </div>

        <div className="lg:w-1/2 relative">
          <div className="absolute -inset-1 bg-blue-500/20 rounded-2xl blur-xl"></div>
          <img
            src={trainLogo}
            alt="Train"
            className="relative w-[90] rounded-2xl  shadow-2xl object-cover"
            style={{
              transform: "scale(1)",
              transition: "transform 500ms",
            }}
            onMouseEnter={(e) => (e.target.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
          />
          <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg">
            <p className="font-bold">Book Now</p>
            <p className="text-sm text-blue-100">Fast & Secure</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Easy Booking", description: "Book tickets in just a few clicks" },
            { title: "Seat Selection", description: "Choose your preferred seat with our interactive map" },
            { title: "Manage Journeys", description: "Change or cancel your bookings hassle-free" },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800/50 p-6 rounded-xl hover:bg-gray-800 transition-all duration-300 border border-gray-700"
            >
              <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mb-4">
                <span className="text-blue-400 font-bold">{index + 1}</span>
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(-5%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
      `}</style>
    </div>
  )
}

export default Home
