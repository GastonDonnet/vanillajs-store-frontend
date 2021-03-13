// Elementos del DOM que son modificados
const productListElement = document.querySelector('.product-list');
const categoryListElement = document.querySelector('#category-list');
const searchElement = document.querySelector('#search');
const sortByPriceElement = document.querySelector('#price-sort');
const paginationElement = document.querySelector('.pagination')
const productLoaderElement = document.querySelector('#product-loader')

// Valor actual del price sort
let priceSort = ''

// Pagina actual
let currentPage = 1

// Productos x pagina (podria dar opcion al usuario de elegir cuantos se quiere mostrar)
const itemsPerPage = 10

// Variables que almacenan productos y categorias para ser usadas en otras funciones
const categories = {}
let products = {}

// Instancia clase Query que es usada para armar la query del producto.
const productQuery = new Query(getProducts)


//// Objects
// Loading reactivo que agrega o saca el "loading element" del DOM segun su valor de "value"
const productsLoading = new Proxy({}, {
    set: (obj, prop, value) => {
        console.log(obj, prop, value)
        if (prop == 'value') {
            if (value == true) {
                productLoaderElement.style = 'display: flex;'
            } else if (value == false) {
                productLoaderElement.style = 'display: none;'
            }
        }
    }
})


//// Funciones
// Obtiene productos
function getProducts(query) {
    productsLoading.value = true
    // Borra productos previos
    productListElement.innerHTML = ''

    fetch(`https://node-api-bsale.herokuapp.com/api/v1/product?${query}`)
        .then(res => res.json())
        .then(res => {
            console.log(res)
            products = res
            for (product of res.products) {
                const {
                    id,
                    name,
                    price,
                    url_image
                } = product

                productElement = new Product(id)
                    .setName(name)
                    .setPrice(price)
                    .setImage(url_image)
                    .build()
                    .getElement()

                productListElement.appendChild(productElement)
            }
        })
        .catch(error => {})
        .finally(() => {
            createPagination()
            productsLoading.value = false
        })
}

// Obtiene categorias para el filter
function getCategories() {
    fetch('https://node-api-bsale.herokuapp.com/api/v1/category')
        .then(res => res.json())
        .then(res => {
            console.log(res)

            for (category of res.categories) {
                const {
                    id,
                    name,
                } = category

                categories[id] = name

                const categoryElement = document.createElement('option')
                categoryElement.setAttribute('value', id)
                categoryElement.innerText = name
                categoryListElement.appendChild(categoryElement)
            }
        })
}


// Crea paginacion
function createPagination() {
    // Solo se crea una vez
    paginationElement.innerHTML = ''

    totalPages = Math.round(products.total / itemsPerPage)
    console.log(products, itemsPerPage)

    let i = 1
    while (i <= totalPages) {

        ((i) => {
            const pageElement = document.createElement('div')
            pageElement.innerText = i
            pageElement.style = "font-size: large;"
            pageElement.classList.add('p-10', 'pointer')

            if (i == currentPage) {
                pageElement.classList.add('current-page')
            }

            paginationElement.appendChild(pageElement)

            pageElement.addEventListener('click', () => {
                changePage(i)
            })
        })(i)

        i++
    }
}

// Cambia de pagina
function changePage(page) {
    const prevPage = currentPage
    currentPage = page
    productQuery.page(currentPage).execute()
}

//// Event Listeners
// Categorias
categoryListElement.addEventListener('change', (event) => {
    currentPage = 1
    categoryId = event.target.value

    if (categoryId == 0) {
        productQuery.filter(['category', '']).execute()
        return
    }

    categoryName = categories[categoryId]
    productQuery.filter(['category', categoryName]).execute()

})

// Buscador
searchElement.addEventListener('change', (event) => {
    currentPage = 1
    searchText = event.target.value

    if (searchText.length == 0) {
        productQuery.filter(['name', '']).execute()
        return
    }

    productQuery.filter(['name', searchText]).execute()
})

// Sort by Price
sortByPriceElement.addEventListener('click', () => {
    arrow = sortByPriceElement.children[1]
    console.log(priceSort)
    let sort = null

    if (priceSort == 'asc') {
        priceSort = 'desc';
        sort = '-price'
        arrow.style.transform = 'rotate(-90deg)'
        arrow.style.visibility = 'visible'
    } else if (priceSort == 'desc') {
        priceSort = ''
        arrow.style.visibility = 'hidden'
    } else if (priceSort == '') {
        priceSort = 'asc'
        sort = 'price'
        arrow.style.transform = 'rotate(90deg)'
        arrow.style.visibility = 'visible'
    }

    console.log(sort)
    productQuery.sort(sort).execute()
})

// Inicial
getProducts("page=1")
getCategories()