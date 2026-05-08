function BookingsList({
  bookings,
  onEdit,
  onDelete,
  onToggleCompleted,
  loadingActionId
}) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>My Bookings</h2>
        <p>Manage your bookings without page reload.</p>
      </div>

      {bookings.length === 0 ? (
        <p>No bookings yet. Create your first one.</p>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <article
              key={booking._id}
              className={`booking-card ${booking.completed ? "completed" : ""}`}
            >
              <h3>{booking.movie?.title}</h3>
              <p>
                <strong>Show:</strong> {booking.showTime}
              </p>
              <p>
                <strong>Seats:</strong> {(booking.seatNumbers || []).join(", ")}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {booking.completed ? "Completed" : "Pending"}
              </p>
              <div className="booking-actions">
                <button
                  className="secondary-btn"
                  type="button"
                  onClick={() => onEdit(booking)}
                >
                  Edit
                </button>
                <button
                  className="secondary-btn"
                  type="button"
                  onClick={() => onToggleCompleted(booking._id)}
                  disabled={loadingActionId === booking._id}
                >
                  Toggle Completed
                </button>
                <button
                  className="danger-btn"
                  type="button"
                  onClick={() => onDelete(booking._id)}
                  disabled={loadingActionId === booking._id}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default BookingsList;
