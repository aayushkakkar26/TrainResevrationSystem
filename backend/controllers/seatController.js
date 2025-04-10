const pool = require("../db");

exports.getAllSeats = async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT id, row_number, seat_number, is_booked, user_id 
        FROM seats 
        ORDER BY row_number ASC, seat_number ASC
      `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching seats:", err);
    res.status(500).json({ message: "Server error while fetching seats" });
  }
};

exports.bookSeats = async (req, res) => {
  try {
    const { seatCount } = req.body;
    const userId = req.user.id;

    if (!seatCount || seatCount < 1 || seatCount > 7) {
      return res
        .status(400)
        .json({ message: "You can book between 1 to 7 seats." });
    }

    // 1️⃣ First try to find all seats in same row
    const sameRowQuery = `
        SELECT row_number
        FROM seats
        WHERE is_booked = false
        GROUP BY row_number
        HAVING COUNT(*) >= $1
        ORDER BY row_number
        LIMIT 1;
      `;
    const sameRowResult = await pool.query(sameRowQuery, [seatCount]);

    let seatsToBook = [];

    if (sameRowResult.rows.length > 0) {
      // Get exact seats from that row
      const rowNumber = sameRowResult.rows[0].row_number;
      const seatsQuery = `
          SELECT * FROM seats
          WHERE row_number = $1 AND is_booked = false
          ORDER BY seat_number
          LIMIT $2;
        `;
      const seatResult = await pool.query(seatsQuery, [rowNumber, seatCount]);
      seatsToBook = seatResult.rows;
    } else {
      // 2️⃣ Else, try closest rows combined
      const allSeatsQuery = `
          SELECT * FROM seats
          WHERE is_booked = false
          ORDER BY row_number, seat_number;
        `;
      const result = await pool.query(allSeatsQuery);
      const availableSeats = result.rows;

      // Group seats by row
      const rowMap = new Map();
      for (const seat of availableSeats) {
        if (!rowMap.has(seat.row_number)) rowMap.set(seat.row_number, []);
        rowMap.get(seat.row_number).push(seat);
      }

      // Try combinations of rows with enough total seats
      const rowNumbers = [...rowMap.keys()].sort((a, b) => a - b);

      for (let i = 0; i < rowNumbers.length; i++) {
        let tempSeats = [];
        for (let j = i; j < rowNumbers.length; j++) {
          tempSeats = tempSeats.concat(rowMap.get(rowNumbers[j]));
          if (tempSeats.length >= seatCount) {
            seatsToBook = tempSeats.slice(0, seatCount);
            break;
          }
        }
        if (seatsToBook.length === seatCount) break;
      }
    }

    if (seatsToBook.length < seatCount) {
      return res.status(400).json({ message: "Not enough seats available." });
    }

    const seatIds = seatsToBook.map((seat) => seat.id);

    // Mark seats as booked
    await Promise.all(
      seatIds.map((id) =>
        pool.query(
          `UPDATE seats SET is_booked = true, user_id = $1 WHERE id = $2`,
          [userId, id]
        )
      )
    );

    res
      .status(200)
      .json({ message: "Seats booked successfully", seats: seatIds });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.resetSeats = async (req, res) => {
  try {
    const userId = req.user.id;

    const resetQuery = `
        UPDATE seats
        SET is_booked = false,
            user_id = null
        WHERE user_id = $1
      `;

    const result = await pool.query(resetQuery, [userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "No seats found for this user." });
    }

    res.status(200).json({ message: "Your booked seats have been reset." });
  } catch (err) {
    console.error("Reset Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
