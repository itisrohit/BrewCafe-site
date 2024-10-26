document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector('.search-input');
    const contentDiv = document.querySelector('.content');
    const container = document.querySelector('.container');
  
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();
  
      if (query.length === 0) {
        location.reload(); 
        return;
      }
  
      fetch('https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-coffee')
        .then(response => response.json())
        .then(data => {
          if (data && data.data) {
            const filteredData = data.data.filter(item => 
              item.title.toLowerCase().includes(query)
            );
  
            contentDiv.innerHTML = ''; 
  
            
            contentDiv.style.cssText = `
              flex-grow: 1;
              padding: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 20px;
            `;
  
            if (filteredData.length === 0) {
              contentDiv.innerHTML = '<p>No results found.</p>';
              container.style.height = '100%'; 
              return;
            }
  
            if (filteredData.length > 1) {
              container.style.height = 'auto'; 
            } else {
              container.style.height = '100%'; 
            }
  
            filteredData.forEach(item => {
              const itemHTML = `
                <div class="cart-item" style="width: 70%; background-color: #fff; border: 1px solid #ccc; border-radius: 8px; padding: 20px; text-align: left; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); transition: transform 0.3s, box-shadow 0.3s; display: flex; align-items: center;">
                  <img src="${item.image}" alt="${item.title}" style="width: 300px; height: auto; object-fit: cover; border-radius: 8px; margin-right: 20px;">
                  <div style="flex-grow: 1;">
                    <h3 style="margin: 10px 0; font-size: 1.2em; color: #333;">${item.title}</h3>
                    <p style="margin: 5px 0; font-size: 1em; color: #666;">Price: ₹${item.price}</p>
                    <p style="margin: 5px 0; font-size: 1em; color: #666;">${item.description}</p>
                    <button class="add-to-cart" data-id="${item.id}" data-title="${item.title}" data-price="${item.price}" data-image="${item.image}" style="padding: 10px 20px; background-color: #28a745; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Add to Cart</button>
                  </div>
                </div>
              `;
  
              contentDiv.innerHTML += itemHTML;
            });
  
      
            document.querySelectorAll('.add-to-cart').forEach(button => {
              button.addEventListener('click', (event) => {
                const item = {
                  id: button.getAttribute('data-id'),
                  title: button.getAttribute('data-title'),
                  price: button.getAttribute('data-price'),
                  image: button.getAttribute('data-image')
                };
                addToCart(item);
              });
            });
          } else {
            contentDiv.innerHTML = '<p>Error loading coffee items.</p>';
            container.style.height = '100%'; 
          }
        })
        .catch(error => {
          console.error('Error fetching coffee data:', error);
          contentDiv.innerHTML = '<p>Error loading coffee items.</p>';
          container.style.height = '100%'; 
        });
    });
  

    function addToCart(item) {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const itemExists = cart.some(cartItem => cartItem.id === item.id);
  
      if (itemExists) {
        alert('Item is already in the cart.');
      } else {
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
      }
    }
  });