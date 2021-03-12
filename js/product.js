class Product {
    constructor(id) {
        // Inicializa elemento
        this.element = document.createElement('div')
        this.element.className = 'product m-10'
        this.element.setAttribute('id', `product-${id}`)

        // Inicializa HTML
        this.template = `
        <div class="flex flex-col h-full px-10 py-10"">
           
                
                 <img src="{IMAGE}" class="my-auto" style="width: 100%;">
                    
                
                <div class="mt-auto">{NAME}</div>
    
                <div class="border-top flex flex-row py-10 px-10 items-center">
                    <div>$ {PRICE}</div>
                    <img src="./assets/icons/more.svg" class="ml-auto pointer" style="height: 20px;" />
                </div>
            
        </div>
        `
    }

    build() {
        // Agrega HTML al elemento
        this.element.innerHTML = this.template
        return this
    }

    getElement() {
        return this.element
    }

    setName(name) {
        this.template = this.template.replace('{NAME}', name)
        this.name = name
        return this
    }

    setPrice(price) {
        this.template = this.template.replace('{PRICE}', price)
        this.price = price
        return this
    }

    setImage(image) {
        if (!image) {
            image = './assets/no-image.png'
        }

        this.template = this.template.replace('{IMAGE}', image)
        this.image = image
        return this
    }

}