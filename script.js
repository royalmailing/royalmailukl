// Switch between Send and Track tabs
function showForm(formId, element) {
  document.querySelectorAll('.form').forEach(f => f.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(formId).classList.add('active');
  element.classList.add('active');
}

/* === Utilities === */
function statusColor(status) {
  const s = String(status).toLowerCase();
  if (s.includes("deliver")) return "green";
  if (s.includes("in transit") || s.includes("out for")) return "orange";
  if (s.includes("pending") || s.includes("hold") || s.includes("delay")) return "red";
  return "black";
}
// Connect to Google Sheet Web App
const API_URL = "https://script.google.com/macros/s/AKfycbxVt-WcIcVvCwG-_g1xsjhrYbaK-aHqYIIExoSub35jSCwkYxRzHLU9m9k1AFEdAYfAvQ/exec"; 

async function getTrackingData(trackingNumber) {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    // Match tracking number entered by user
    const result = data.find(item => item.TrackingNumber === trackingNumber);

    return result || null;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// Track button event
document.getElementById("trackBtn").addEventListener("click", async () => {
  const trackingNumber = document.getElementById("trackingNumber").value.trim();
  const result = await getTrackingData(trackingNumber);

  if (result) {
    document.getElementById("trackingResult").innerHTML = `
      <p><strong>Tracking Number:</strong> ${result.TrackingNumber}</p>
      <p><strong>Name:</strong> ${result.Name}</p>
      <p><strong>Address:</strong> ${result.Address}</p>
      <p><strong>Email:</strong> ${result.Email}</p>
      <p><strong>From:</strong> ${result.From}</p>
      <p><strong>Delivery Date:</strong> ${result.DeliveryDate}</p>
      <p><strong>Status:</strong> ${result.Status}</p>
    `;
  } else {
    document.getElementById("trackingResult").innerHTML = `
      <p style="color:red;">Tracking number not found.</p>
    `;
  }
});

function buildTimelineHTML(timeline) {
  if (!Array.isArray(timeline) || timeline.length === 0) return "<p>No timeline available.</p>";
  let html = "<ul class='timeline'>";
  timeline.forEach(ev => {
    html += `<li><strong>${ev.date}:</strong> ${ev.step}</li>`;
  });
  html += "</ul>";
  return html;
}

function renderTrackingCard(data, input) {
  const timelineHTML = buildTimelineHTML(data.timeline);
  const color = statusColor(data.status);
  return `
    <div class="tracking-card">
      <h3>📦 Tracking Details</h3>
      <p><strong>Tracking Number:</strong> ${input}</p>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Address:</strong> ${data.address}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>From:</strong> ${data.from}</p>
      <p><strong>Status:</strong> <span class="status" style="color:${color}; font-weight:bold;">${data.status}</span></p>
      <p><strong>Delivery Date:</strong> ${data.deliveryDate}</p>
      <p><strong>Delivery Time:</strong> ${data.deliveryTime}</p>
      <h4>🚚 Delivery Timeline</h4>
      ${timelineHTML}
    </div>
  `;
}

/* === Main tracking function === */
function trackItem() {
  const inputEl = document.getElementById("tracking-number");
  const resultDiv = document.getElementById("tracking-result");

  if (!inputEl || !resultDiv) {
    console.warn("Tracker: DOM elements not found.");
    return;
  }

  const input = inputEl.value.trim();
  if (input === "") {
    resultDiv.innerHTML = `<p style="color:orange;">⚠️ Please enter a tracking number.</p>`;
    resultDiv.style.display = "block";
    return;
  }

  const data = trackingData[input];
  if (data) {
    resultDiv.innerHTML = renderTrackingCard(data, input);
  } else {
    resultDiv.innerHTML = `<p style="color:red;">❌ No tracking info found for <b>${input}</b>.</p>`;
  }
  resultDiv.style.display = "block";
}

/* Make trackItem available globally */
window.trackItem = trackItem;

/* Attach button event after DOM loads */
document.addEventListener("DOMContentLoaded", function () {
  const trackBtn = document.getElementById("track-btn") || document.querySelector("#track button");
  if (trackBtn) trackBtn.addEventListener("click", trackItem);
});
/* === Slideshow === */
let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  const slides = document.getElementsByClassName("slide");
  const dots = document.getElementsByClassName("dot");
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

// Auto slideshow
setInterval(() => { plusSlides(1); }, 5000); // 5 seconds
