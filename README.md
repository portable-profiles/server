# Portable Profile Server

This library is a generic Typescript implementation of the Portable Profile Server API. It includes all of the logic for managing a Portable Profile server, without specifically integrating that logic to a particular server environment. 

To make queries against the server:

```ts
// Define our query, context, and variables; these should usually be provided by the user
const query = `
  query GetProfileQuery($id: String!) {
    profile(id: $id) {
      id
      nickname
      data
    }
  }
`;
const context = {};
const variables = { id: '1234' };

// Define our database; MemoryPersistence is just an in-memory js object that can be used for temporary storage. 
// For a real implementation, you'll want to implement the Persistence interface to support some type of
// data persistence. A database for example.
const memory = new MemoryPersistence();
const graphql = createGraphQL(memory);

// Execute our query and get a response
const response = graphql(query, context, variables);

// Get the result
console.log(response.data.profile);
```
