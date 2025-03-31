query {
  products {
    id
    name
    price
    description
    category {
      id
      name
      price
    }
  }
}

mutation {
  addProduct(
    name: "iPhone 13", 
    price: 24990000, 
    description: "iPhone 13 mới nhất", 
    categoryId: "1"
  ) {
    id
    name
    price
    description
    category {
      id
      name
    }
  }
}