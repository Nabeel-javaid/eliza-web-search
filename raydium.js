const axios = require('axios');
const fs = require('fs');

// Raydium API endpoint for fetching tokens
const RAYDIUM_API_URL = 'https://api.raydium.io/v2/sdk/token/raydium.mainnet.json';

// Fetch all tokens listed on Raydium
async function fetchRaydiumTokens() {
  try {
    console.log('Fetching tokens from Raydium...');
    const response = await axios.get(RAYDIUM_API_URL);

    // Log the full API response for debugging
    console.log('API Response:', response.data);

    // Check if the response data is an object and contains the expected structure
    if (typeof response.data !== 'object' || response.data === null) {
      throw new Error('API response is not an object');
    }

    // Extract token data from the response
    const tokens = Object.values(response.data).map((token) => ({
      symbol: token.symbol, // Token symbol (e.g., RAY, SOL)
      mintAddress: token.mint, // Token mint address
    }));

    console.log('Tokens fetched successfully!');
    return tokens;
  } catch (error) {
    console.error('Failed to fetch tokens from Raydium:', error);
    return [];
  }
}

// Save all tokens to a file
function saveTokensToFile(tokens, filename = 'tokens.json') {
  try {
    // Convert tokens array to JSON string
    const data = JSON.stringify(tokens, null, 2); // Pretty-print with 2 spaces

    // Write to file
    fs.writeFileSync(filename, data);
    console.log(`All tokens saved to ${filename}`);
  } catch (error) {
    console.error('Failed to save tokens to file:', error);
  }
}

// Run the script
async function main() {
  const tokens = await fetchRaydiumTokens();

  if (tokens.length === 0) {
    console.log('No tokens found.');
  } else {
    console.log(`Fetched ${tokens.length} tokens.`);

    // Save all tokens to a file
    saveTokensToFile(tokens);
  }
}

main().catch((error) => console.error(error));