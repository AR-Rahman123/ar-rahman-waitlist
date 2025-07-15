const serverless = require('serverless-http');
const path = require('path');

// Import the Express app from the built server
const handler = async (event, context) => {
  try {
    // Try different paths to find the Express app
    const possiblePaths = [
      '../../dist/index.js',
      './dist/index.js', 
      '../dist/index.js',
      path.join(__dirname, '../../dist/index.js')
    ];
    
    let app;
    for (const appPath of possiblePaths) {
      try {
        const imported = await import(appPath);
        app = imported.default;
        console.log(`Successfully imported app from: ${appPath}`);
        break;
      } catch (importError) {
        console.log(`Failed to import from ${appPath}:`, importError.message);
      }
    }
    
    if (!app) {
      throw new Error('Could not find Express app at any expected path');
    }
    
    // Create serverless handler
    const serverlessHandler = serverless(app);
    return await serverlessHandler(event, context);
  } catch (error) {
    console.error('Serverless function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        stack: error.stack
      })
    };
  }
};

module.exports = { handler };