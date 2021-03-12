class Query {
    constructor(cb) {
        this.cb = cb
        this.filterDic = {}
        this.pageValue = "&page=1"
    }

    sort(sort) {
        if (sort) {
            this.sortValue = `&sort=${sort}`
        } else {
            this.sortValue = "&sort=price"
        }
        return this
    }

    page(page) {
        if (page) {
            this.pageValue = `&page=${page}`
        } else {
            this.pageValue = "&page=1"
        }
        return this
    }

    limit(limit) {
        if (limit) {
            this.limitValue = `&limit=${limit}`
        } else {
            this.limitValue = ""
        }
        this.pageValue = "&page=1"
        return this
    }

    filter(...filterFields) {

        if (filterFields.length > 0) {
            for (const [field, value] of filterFields) {
                this.filterDic[field] = value
            }
        } else {
            this.filterDic = {}
        }
        this.pageValue = "&page=1"
        return this
    }

    execute() {

        this.loading = true

        let query = ''
        this.sortValue ? query += this.sortValue : null
        this.pageValue ? query += this.pageValue : null
        this.limitValue ? query += this.limitValue : null

        for (const key in this.filterDic) {
            const value = this.filterDic[key]
            value ? query += `&${key}=${value}` : null
        }

        this.cb(query)


        console.log(query)
    }


}