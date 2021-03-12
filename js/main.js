const productListElement = document.querySelector('.product-list');
const categoryListElement = document.querySelector('#category-list');
const searchElement = document.querySelector('#search');
const sortByPriceElement = document.querySelector('#price-sort');
const paginationElement = document.querySelector('.pagination')
let priceSort = ''
let currentPage = 1
const itemsPerPage = 10
const categories = {}
let products = {}
const productQuery = new Query(getProducts)


// Obtiene productos
function getProducts(query) {
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
        }).catch(error => {}).finally(() => createPagination())


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