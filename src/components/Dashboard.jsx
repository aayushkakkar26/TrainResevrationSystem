import { useContext, useEffect, useState } from "react"
import axios from "../services/api"
import { AuthContext } from "../context/AuthContext"
import { toast } from "react-toastify";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext)
  const [seats, setSeats] = useState([])
  const [seatCount, setSeatCount] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSeats()
  }, [])

  const fetchSeats = async () => {
    try {
      const res = await axios.get("/seats")
    
      
      setSeats(res.data)
    } catch (err) {
      console.error("Error fetching seats", err)
     

    }
  }

  const handleBooking = async () => {
    try {
      setLoading(true)
      const res = await axios.post("/seats/book", { seatCount }, { withCredentials: true })
      await fetchSeats()
      toast.success("Successfully Booked!");
    } catch (err) {
      toast.error("Booking failded", err);
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async () => {
    try {
      await axios.post(
        "/seats/reset",
        {},
        {
          withCredentials: true,
        },
      )
      
      await fetchSeats()
      toast.success("Successfully Reset!");
    } catch (err) {
      toast.error("Unable to Reset!", err);
    }
  }

  const renderSeats = () => {
    return seats.map((seat) => {
      let bgColor = "bg-emerald-500" 
      let hoverEffect = "hover:bg-emerald-600"
      let label = "Available"

      if (seat.is_booked && seat.user_id === user?.id) {
        bgColor = "bg-blue-500" 
        hoverEffect = "hover:bg-blue-600"
        label = "Your seat"
      } else if (seat.is_booked && seat.user_id !== user?.id) {
        bgColor = "bg-gray-500" 
        hoverEffect = "hover:bg-gray-700"
        label = "Booked"
      }

      return (
        <div
          key={seat.id}
          className={`w-12 h-12 sm:w-14 sm:h-14  rounded-lg ${bgColor} ${hoverEffect} transition-colors duration-200 flex items-center justify-center relative group cursor-default`}
          aria-label={`Seat ${seat.id}: ${label}`}
        >
          <span className="text-white font-medium text-lg ">{seat.id}</span>
          <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded py-1 px-2 pointer-events-none transition-opacity duration-200">
            {label}
          </div>
        </div>
      )
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Train Reservation System</h1>
            <p className="text-gray-400">
              Welcome, <span className="text-blue-400 font-medium">{user?.username}</span>
            </p>
          </div>
          <button
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2"
            onClick={logout}
          >
            <span>Logout</span>
          </button>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Book Your Seats</h2>

          <div className="flex flex-wrap gap-3 items-center mb-6">
            <div className="flex items-center gap-2 w-1/3">
              <label htmlFor="seatCount" className="text-gray-300 text-sm">
                Number of seats:
              </label>
              <input
                id="seatCount"
                type="number"
                min="1"
                max="7"
                value={seatCount}
                onChange={(e) => setSeatCount(Number(e.target.value))}
                className="bg-gray-700 border border-gray-600 text-white px-3 py-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleBooking}
                disabled={loading}
                className={`${
                  loading ? "bg-emerald-700" : "bg-emerald-600 hover:bg-emerald-500"
                } text-white px-5 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-70`}
              >
                {loading ? "Booking..." : "Book Seats"}
              </button>

              <button
                onClick={handleReset}
                className="bg-red-700 hover:bg-red-600 text-white px-5 py-2 rounded-lg transition-colors duration-200"
              >
                Reset My Seats
              </button>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-gray-300">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-300">Your seats</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                <span className="text-sm text-gray-300">Booked by others</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Seat Map</h2>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-3 sm:gap-4">{renderSeats()}</div>
        </div>
      </div>
    </div>
  )
}
