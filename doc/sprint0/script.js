// Redirect to quote page with selected genres as URL parameters
function redirectToQuotePage() {
    let checkboxes = document.querySelectorAll('input[name="genres"]:checked');
    let selectedGenres = Array.from(checkboxes).map(checkbox => checkbox.value);

    if (selectedGenres.length === 0) {
        alert("Please select at least one genre!");
        return;
    }

    // Encode selected genres and pass them in the URL
    let genreParams = encodeURIComponent(selectedGenres.join(","));
    window.location.href = `quote.html?genres=${genreParams}`;
}

// Extract genres from the URL and display them on the quote page
function displayGenresOnQuotePage() {
    let params = new URLSearchParams(window.location.search);
    let genres = params.get("genres");

    if (genres) {
        document.getElementById("selected-genres").textContent = `Selected Genres: ${genres.replace(/,/g, ", ")}`;
    } else {
        document.getElementById("selected-genres").textContent = "No genres selected.";
    }
}

// Handle going back to the homepage
function goBack() {
    window.location.href = "index.html";
}

// Check if we are on the quote page and display genres
if (window.location.pathname.includes("quote.html")) {
    displayGenresOnQuotePage();
}
