import { ApolloServer } from 'apollo-server';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import typeDefs from '../schema/schema';
import { productResolvers } from '../resolvers/productResolvers';
import { categoryResolvers } from '../resolvers/categoryResolvers';
import { merge } from 'lodash';

// Kết hợp các resolvers
const resolvers = merge(productResolvers, categoryResolvers);

// Tạo Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  plugins: [
       ApolloServerPluginLandingPageGraphQLPlayground()
     ]
});

// Khởi động server
server.listen().then(({ url }) => {
  console.log(`🚀 Server sẵn sàng tại ${url}`);
});