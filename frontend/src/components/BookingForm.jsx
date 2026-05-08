import { useEffect, useMemo, useState } from "react";
import { getBookedSeats } from "../api/ticketingApi";

const ROWS = ["A", "B", "C", "D", "E"];
const COLS = [1, 2, 3, 4, 5, 6, 7, 8];
const MAX_SELECTABLE = 8;

function BookingForm({
  selectedMovie,
  editingBooking,
  onSubmit,
  onCancelEdit,
  isSubmitting
}) {
  const activeMovie = useMemo(
    () => selectedMovie || editingBooking?.movie || null,
    [selectedMovie, editingBooking]
  );
  const [showTime, setShowTime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(false);

  useEffect(() => {
    if (!activeMovie) return;
    if (editingBooking) {
      setShowTime(editingBooking.showTime);
      setSelectedSeats(editingBooking.seatNumbers || []);
      return;
    }
    setShowTime(activeMovie.showTimes[0] || "");
    setSelectedSeats([]);
  }, [activeMovie, editingBooking]);

  useEffect(() => {
    const fetchSeats = async () => {
      if (!showTime || !activeMovie?._id) return;
      try {
        setLoadingSeats(true);
        const response = await getBookedSeats(activeMovie._id, showTime);
        setBookedSeats(response.data.data || []);
      } catch (_error) {
        setBookedSeats([]);
      } finally {
        setLoadingSeats(false);
      }
    };

    fetchSeats();
  }, [showTime, activeMovie]);

  const allSeats = useMemo(
    () => ROWS.flatMap((row) => COLS.map((col) => `${row}${col}`)),
    []
  );

  const toggleSeat = (seatNumber) => {
    if (bookedSeats.includes(seatNumber) && !selectedSeats.includes(seatNumber)) return;

    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((seat) => seat !== seatNumber);
      }
      if (prev.length >= MAX_SELECTABLE) return prev;
      return [...prev, seatNumber];
    });
  };

  const handleConfirm = () => {
    if (!showTime || selectedSeats.length === 0) return;
    onSubmit({ showTime, seatNumbers: selectedSeats });
  };

  if (!activeMovie) {
    return (
      <section className="panel">
        <h2>Seat Booking</h2>
        <p>Select a movie to continue.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>{editingBooking ? "Update Seat Selection" : "Choose Slot & Seats"}</h2>
        <p>Select time slot first, then pick seats.</p>
      </div>

      <div className="slot-row">
        {activeMovie.showTimes.map((slot) => (
          <button
            key={slot}
            type="button"
            className={`slot-btn ${showTime === slot ? "active" : ""}`}
            onClick={() => setShowTime(slot)}
          >
            {slot}
          </button>
        ))}
      </div>

      <div className="screen-badge">Screen This Side</div>

      {loadingSeats ? <p>Loading seat availability...</p> : null}

      <div className="seat-grid">
        {allSeats.map((seatNumber) => {
          const isBooked = bookedSeats.includes(seatNumber) && !selectedSeats.includes(seatNumber);
          const isSelected = selectedSeats.includes(seatNumber);
          return (
            <button
              key={seatNumber}
              type="button"
              className={`seat-btn ${isSelected ? "selected" : ""} ${isBooked ? "booked" : ""}`}
              onClick={() => toggleSeat(seatNumber)}
              disabled={isBooked}
            >
              {seatNumber}
            </button>
          );
        })}
      </div>

      <p className="seat-summary">
        Selected: {selectedSeats.length ? selectedSeats.join(", ") : "None"} (max {MAX_SELECTABLE})
      </p>

      <div className="form-actions">
        <button
          className="primary-btn"
          type="button"
          disabled={isSubmitting || selectedSeats.length === 0 || !showTime}
          onClick={handleConfirm}
        >
          {isSubmitting ? "Saving..." : editingBooking ? "Update Booking" : "Confirm Seats"}
        </button>
        {editingBooking ? (
          <button type="button" className="secondary-btn" onClick={onCancelEdit}>
            Cancel Edit
          </button>
        ) : null}
      </div>
    </section>
  );
}

export default BookingForm;
