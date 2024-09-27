const cron = require('node-cron');
const { fetchAssetsFromDeriv} = require("../controller/user/assests.controller");
const Asset = require("../models/assests.model");

// Schedule a task to run every minute
cron.schedule('* * * * * *', async () => {
    console.log("Cron job started...");
    
    try {
        const assets = await fetchAssetsFromDeriv(); // Wait for the WebSocket to return assets
        const bulkOps = assets.map(asset => ({
            updateOne: {
              filter: { symbol: asset.symbol },
              update: { $set: asset },
              upsert: true, // Corrected: set as a boolean
            },
          }));
          
          // Execute bulk write operation
          const result = await Asset.bulkWrite(bulkOps);
          console.log('Bulk update successful:', result);
    } catch (error) {
        console.error('Error fetching assets:', error);
    }
});