
// This script runs after the page has fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookingForm");
  const message = document.getElementById("message");

  // Get the listing ID from the URL and store it into the hidden input field
  const urlParams = new URLSearchParams(window.location.search);
  const listingId = urlParams.get("listing_id");
  document.getElementById("listingId").value = listingId;

  // When the form is submitted
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect all the form input values
    const data = {
      listingId: document.getElementById("listingId").value,
      startDate: document.getElementById("startDate").value,
      endDate: document.getElementById("endDate").value,
      clientName: document.getElementById("clientName").value,
      email: document.getElementById("email").value,
      daytimePhone: document.getElementById("daytimePhone").value,
      mobile: document.getElementById("mobile").value,
      postalAddress: document.getElementById("postalAddress").value,
      homeAddress: document.getElementById("homeAddress").value,
    };

    try {
      // Send the booking data to the server using POST request
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      // Booking success: go to confirmation page with the booking ID in URL
      if (res.ok) {
        window.location.href = `confirmation.html?bookingId=${result.bookingID}`;
      } else {
        message.innerHTML = `<div class="alert alert-danger">${result.error}</div>`;
      }
    } catch (err) {
      console.error("Booking failed", err);
      message.innerHTML = `<div class="alert alert-danger">Something went wrong. Please try again.</div>`;
    }
  });
});
