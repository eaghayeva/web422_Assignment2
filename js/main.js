/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: ___Emiliya Aghayeva___________________ Student ID: _____148398217_____________ Date: _______02/06/2023_____________
*
* Cyclic: https://azure-rattlesnake-shoe.cyclic.app
*
* Github:
********************************************************************************/ 


// Variables
let page = 1;
const perPage = 10;

// Functions
function loadMovieData(title = null) {
    // Loading The Data
    let url = `https://dull-frock-cow.cyclic.app/api/movies?page=${page}&perPage=${perPage}`;
    if (title !== null) {
        url += `&title=${title}`;
        page = 1;
        const paginationElement = document.querySelector('.pagination');
        paginationElement.classList.add('d-none');
    } else {
        const paginationElement = document.querySelector('.pagination');
        paginationElement.classList.remove('d-none');
    }

    fetch(url)
    .then(response => response.json())
    .then(data => {
        // Creating the <tr> Elements
        let tableRows = `
            ${data.map(movie => (
                `<tr data-id="${movie._id}">
                    <td>${movie.year}</td>
                    <td>${movie.title}</td>
                    <td>${movie.plot || 'N/A'}</td>
                    <td>${movie.rated || 'N/A'}</td>
                    <td>${Math.floor(movie.runtime / 60)}:${(movie.runtime % 60).toString().padStart(2, '0')}</td>
                </tr>`
            )).join('')}
        `;
            

            // Adding <tr> Elements to the Table
            const tbodyElement = document.querySelector('table#moviesTable tbody');
            tbodyElement.innerHTML = tableRows.join('');

            // Updating the "Current Page"
            const currentPageElement = document.querySelector('#current-page');
            currentPageElement.textContent = page.toString();

            // Adding Click Events & Loading / Displaying Movie Data
            const rows = document.querySelectorAll('table.moviesTable tbody tr');
            rows.forEach(row => {
                row.addEventListener('click', () => {
                    const movieId = row.dataset.id;
                    const movieUrl = `/api/movies/${movieId}`;

                    fetch(movieUrl)
                        .then(response => response.json())
                        .then(movieData => {
                            const { title, poster, directors, fullplot, cast, awards, imdb } = movieData;

                            const modalTitleElement = document.querySelector('.modal-title');
                            modalTitleElement.textContent = title;

                            const modalBodyElement = document.querySelector('.modal-body');
                            modalBodyElement.innerHTML = `
                <img class="img-fluid w-100" src="${poster}"><br><br>
                <strong>Directed By:</strong> ${directors.join(', ')}<br><br>
                <p>${fullplot}</p>
                <strong>Cast:</strong> ${cast ? cast.join(', ') : 'N/A'}<br><br>
                <strong>Awards:</strong> ${awards.text}<br>
                <strong>IMDB Rating:</strong> ${imdb.rating} (${imdb.votes} votes)
              `;

                            // Show the modal
                            $('#detailsModal').modal('show');
                        })
                        .catch(error => console.log(error));
                });
            });
        })
        .catch(error => console.log(error));
}

// DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Click event for the "previous page" pagination button
    const prevPageButton = document.querySelector('.pagination .previous');
    prevPageButton.addEventListener('click', () => {
        if (page > 1) {
            page--;
            loadMovieData();
        }
    });

    // Click event for the "next page" pagination button
    const nextPageButton = document.querySelector('.pagination .next');
    nextPageButton.addEventListener('click', () => {
        page++;
        loadMovieData();
    });

    // Submit event for the "searchForm" form
    const searchForm = document.querySelector('#searchForm');
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.querySelector('#title').value;
        loadMovieData(title);
    });

    // Click event for the "clearForm" button
    const clearFormButton = document.querySelector('#clearForm');
    clearFormButton.addEventListener('click', () => {
        document.querySelector('#title').value = '';
        loadMovieData();
    });

    // Initial data load
    loadMovieData();
});
