document.addEventListener("DOMContentLoaded", () => {
    const backBtn = document.querySelector(".backBtn");
    const resultElement = document.getElementById("result");

    // Back button functionality
    if (backBtn) {
        backBtn.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }

    // Form for date-based zodiac lookup
    const dateLookupForm = document.getElementById("dateLookupForm");
    if (dateLookupForm) {
        dateLookupForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const month = document.getElementById("monthSelect").value;
            const day = document.getElementById("dateInput").value;

            if (!month || !day) {
                resultElement.textContent =
                    "Please select both a month and date.";
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:8000/api/sign-by-date?day=${day}&month=${month}`,
                );
                const data = await response.text();

                resultElement.textContent = data;
                resultElement.style.opacity = "1"; // Show result
            } catch (error) {
                resultElement.textContent = "Error fetching zodiac sign.";
                console.error("Error:", error);
            }
        });
    }

    // Form for sign-based date range lookup
    const signLookupForm = document.getElementById("signLookupForm");
    if (signLookupForm) {
        signLookupForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const sign = document.getElementById("signSelect").value;

            if (!sign) {
                resultElement.textContent = "Please select a zodiac sign.";
                return;
            }

            try {
                const response = await fetch(
                    `http://localhost:8000/api/sign/${sign}`,
                );
                const data = await response.text();

                resultElement.textContent = data;
                resultElement.style.opacity = "1"; // Show result
            } catch (error) {
                resultElement.textContent =
                    "An error occurred. Please try again later.";
                console.error("Error:", error);
            }
        });
    }

    // Carousel zodiac signs
    const rightBtn = document.querySelector(".right-btn");
    const leftBtn = document.querySelector(".left-btn");
    const carouselCont = document.querySelector(".carousel-item-container");
    const items = document.querySelectorAll(".carousel-item");
    const itemWidthWithGap = 55; // gap + item width
    const maxIndex = items.length - 1;
    let currentIndex = 0; // Start at the first item

    // Update carousel position to center the current item
    function updateCarousel() {
        const translateX = -currentIndex * itemWidthWithGap + 40; // 40vw offset to center the first text item
        carouselCont.style.transform = `translateX(${translateX}vw)`;

        // Clear "active" class from all items and apply it to the current item
        items.forEach((item) => item.classList.remove("active"));
        items[currentIndex].classList.add("active");
    }

    carouselCont.style.transition = "transform 0.5s ease"; // Smooth transition
    updateCarousel(); // Set initial position

    // Right button click to move to the next item
    rightBtn.addEventListener("click", () => {
        if (currentIndex < maxIndex) {
            currentIndex += 1;
            updateCarousel();
            resultElement.style.opacity = "0"; // Hide result when navigating
        }
    });

    // Left button click to move to the previous item
    leftBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex -= 1;
            updateCarousel();
            resultElement.style.opacity = "0"; // Hide result when navigating
        }
    });

    // Fetch and display date range for the current zodiac sign in the carousel
    const fetchDateBtn = document.getElementById("fetchDateBtn");
    fetchDateBtn.addEventListener("click", async () => {
        const currentSign = items[currentIndex].getAttribute("data-sign");

        try {
            const response = await fetch(
                `http://localhost:8000/api/sign/${currentSign}`,
            );
            const data = await response.text();

            // Display the result and add fade in transition
            resultElement.textContent = data;
            resultElement.style.opacity = "1"; // Show result

            // Move the item up styling
            items[currentIndex].classList.add("active");
        } catch (error) {
            resultElement.textContent =
                "An error occurred. Please try again later.";
            console.error("Error:", error);
        }
    });
});
