document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("searchForm");
  const listingsContainer = document.getElementById("listingsContainer");

  fetchListings();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const location = document.getElementById("location").value;
    const propertyType = document.getElementById("propertyType").value;
    const bedrooms = document.getElementById("bedrooms").value;

    const query = new URLSearchParams();
    if (location) query.append("location", location);
    if (propertyType) query.append("propertyType", propertyType);
    if (bedrooms) query.append("bedrooms", bedrooms);

    fetchListings(query.toString());
  });

  async function fetchListings(queryString = "") {
    try {
      const res = await fetch(
        `/api/listings${queryString ? `?${queryString}` : ""}`
      );
      const listings = await res.json();
      displayListings(listings);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
      listingsContainer.innerHTML = "<p>Something went wrong.</p>";
    }
  }

  function displayListings(listings) {
    listingsContainer.innerHTML = "";

    if (!listings.length) {
      listingsContainer.innerHTML = "<p>No listings found.</p>";
      return;
    }

    listings.forEach((item) => {
      const card = document.createElement("div");
      card.className = "card mb-3";

      card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">
          <a href="booking.html?listing_id=${item._id}">
            ${item.name || "Unnamed Property"}
          </a>
        </h5>
        <p class="card-text">${item.summary || "No summary provided."}</p>
        <p class="card-text"><strong>Location:</strong> ${
          item.address?.market || "N/A"
        }</p>
        <p class="card-text"><strong>Bedrooms:</strong> ${item.bedrooms ?? "N/A"}</p>
        <p class="card-text"><strong>Property Type:</strong> ${
        item.property_type ?? "N/A"
        }</p>
        <p class="card-text"><strong>Daily Price:</strong> $${
          item.price || "N/A"
        }</p>
        <p class="card-text"><strong>Rating:</strong> ${
          item.rating || "N/A"
        }</p>

      </div>
    `;

      listingsContainer.appendChild(card);
    });
  }
});
