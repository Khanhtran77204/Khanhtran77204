import { gql } from 'apollo-server';

const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    price: Float!
    description: String
    categoryId: ID!
    category: Category
  }

  type Category {
    id: ID!
    name: String!
    products: [Product]
  }

  type Query {
    products: [Product]
    product(id: ID!): Product
    categories: [Category]
    category(id: ID!): Category
  }

  type Mutation {
    addProduct(name: String!, price: Float!, description: String, categoryId: ID!): Product
    updateProduct(id: ID!, name: String, price: Float, description: String, categoryId: ID): Product
    deleteProduct(id: ID!): Boolean
    
    addCategory(name: String!): Category
    updateCategory(id: ID!, name: String!): Category
    deleteCategory(id: ID!): Boolean
  }
`;

export default typeDefs;