let allProducts = [];

fetch("http://localhost:3000/api/data")
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        let productHTML = "";

        if (data && typeof data === "object") {
            Object.keys(data).forEach((coll) => {
                const collection = data[coll];
                if (Array.isArray(collection)) {
                    allProducts = allProducts.concat(collection);
                }
            });
        }
    })

allProducts.sort((a, b) => a.name.localeCompare(b.name));

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