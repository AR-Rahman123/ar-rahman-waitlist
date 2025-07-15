import serverless from 'serverless-http';

// Import the Express app from the built server
const handler = async (event, context) => {
  try {
    // Dynamic import of the built Express app
    const { default: app } = await import('../../dist/index.js');
    
    // Create serverless handler
    const serverlessHandler = serverless(app);
    return await serverlessHandler(event, context);
  } catch (error) {
    console.error('Serverless function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};

export { handler };