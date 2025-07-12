import serverless from 'serverless-http';

// Import the Express app from the built server
const handler = async (event, context) => {
  // Dynamic import of the built Express app
  const { default: app } = await import('../../dist/index.js');
  
  // Create serverless handler
  const serverlessHandler = serverless(app);
  return serverlessHandler(event, context);
};

export { handler };