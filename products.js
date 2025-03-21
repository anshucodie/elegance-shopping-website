fetch("http://localhost:3000/api/data")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Fetched Data:", data);

        let productHTML = '';
        Object.keys(data).forEach((coll) => {
            const collection = data[coll];
            collection.forEach((item) => {
                //Idhar HTML code aayega har ek product ka
                productHTML += `
                <div class="product-card">
                    <h3>${item.name}</h3>
                    <p>Price: $${item.price}</p>
                    <p>Category: ${item.category}</p>
                    <p>Ratings: ${item.ratings}</p>
                    <img src="${item.image}" alt="${item.name}" style="width:100px; height:auto;">
                </div>
            `;
            //Idhar tak
            });
        });
        document.querySelector('.js-main').innerHTML = productHTML;
    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });
