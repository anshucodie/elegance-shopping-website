let allProducts = [];

fetch("http://localhost:3000/api/data")
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        if (data && typeof data === "object") {
            Object.keys(data).forEach((coll) => {
                const collection = data[coll];
                if (Array.isArray(collection)) {
                    allProducts = allProducts.concat(collection);
                }
            });

            // Sort products alphabetically by name after fetching
            allProducts.sort((a, b) => a.name.localeCompare(b.name));
            console.log("All Products:", allProducts); // Debugging
        }
    })
    .catch((error) => {
        console.error("Error fetching products:", error);
    });

// Binary Search Function
function binarySearch(allProducts, prefix) {
    let left = 0, right = allProducts.length - 1;
    let results = [];

    while (left <= right) {
        let mid = Math.floor((left + right) / 2);
        let midProduct = allProducts[mid].name.toLowerCase();

        if (midProduct.startsWith(prefix.toLowerCase())) {
            let i = mid;
            while (i >= 0 && allProducts[i].name.toLowerCase().startsWith(prefix.toLowerCase())) {
                results.push(allProducts[i]);
                i--;
            }

            i = mid + 1;
            while (i < allProducts.length && allProducts[i].name.toLowerCase().startsWith(prefix.toLowerCase())) {
                results.push(allProducts[i]);
                i++;
            }

            return results;
        } else if (midProduct < prefix.toLowerCase()) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return results;
}

document.addEventListener("DOMContentLoaded", function () {
    const searchBar = document.getElementById("search-bar-input");

    searchBar.addEventListener("input", function (e) {
        const searchTerm = e.target.value.toLowerCase();
        console.log("Search Term:", searchTerm);

        const filteredProducts = binarySearch(allProducts, searchTerm);
        console.log("Search Results:", filteredProducts);

        renderProducts(filteredProducts);
    });
});

// Function to render products
function renderProducts(products) {
    const mainContainer = document.querySelector(".js-main");
    if (!mainContainer) {
        console.error("Element with class 'js-main' not found.");
        return;
    }

    if (products.length === 0) {
        mainContainer.innerHTML = "<p>No products match your search.</p>";
        return;
    }

    let productHTML = "";
    products.forEach((item) => {
        productHTML += `
            <div class="product">
                <a href="/individual_page/main.html?id=${item._id}" class="product-link">
                    <img src="${item.image}" alt="Product Name">
                    <div class="product-info">
                        <h3 title="${item.name}">${item.name}</h3>
                        <p>Price: <span>₹${item.price}</span> </p>
                        <p>Rating: <i class="fa-regular fa-star" style="color: #000205;"></i> ${item.ratings}</p>
                    </div>
                </a>
                <button class="add-to-cart-btn" data-product-id="${item._id}" data-product-name="${item.name}" data-product-price="${item.price}" data-product-image="${item.image}">Add to Cart</button>
            </div>
        `;
    });

    mainContainer.innerHTML = productHTML;
}

function clearSearchAndRenderAll() {
    const searchBar = document.getElementById("search-bar-input");
    searchBar.value = ""; // Clear the search bar
    renderProducts(window.allProducts); // Render all products
}