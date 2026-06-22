# Pinecone Vector Dimension Mismatch Fix

## Problem
You're getting the error: **"Vector dimension 768 does not match the dimension of the index 3072"**

This happens because:
- Your current embedding model `text-embedding-004` generates **768-dimensional** vectors
- Your Pinecone index is configured for **3072 dimensions**

## Solution Options

### Option 1: Recreate Pinecone Index (Recommended)

1. **Go to Pinecone Dashboard**
   - Visit [https://app.pinecone.io/](https://app.pinecone.io/)
   - Log in to your account

2. **Delete Current Index**
   - Find your current index (name: `shopmate`)
   - Click on it and delete it

3. **Create New Index**
   - Click "Create Index"
   - **Name**: `shopmate` (or whatever your PINECONE_INDEX env variable is set to)
   - **Dimensions**: `768`
   - **Metric**: `cosine` (recommended for text embeddings)
   - **Pod Type**: Choose based on your plan:
     - Starter: `p1.x1`
     - Serverless: `s1.x1`

4. **Test the Fix**
   - Run the indexing again from your AI Manager
   - It should now work without dimension errors

### Option 2: Change Embedding Model (Alternative)

If you prefer to keep your 3072-dimension index, you would need to:
1. Find an embedding model that produces 3072 dimensions
2. Update the `generateEmbedding` function in `server/services/aiservices.js`

**Note**: Google's `text-embedding-004` is currently one of the best models available, so Option 1 is recommended.

## Verification

After recreating your index, you can test the embedding dimensions by running:

```bash
cd server
node test-embedding-dimensions.js
```

This will show you the exact dimensions being generated and confirm compatibility.

## Files Updated

The following files have been updated with better error handling:
- `server/services/aiservices.js` - Enhanced embedding generation and indexing
- `server/controllers/ragController.js` - Better error messages for rule indexing
- `server/controllers/listingController.js` - Improved location indexing error handling

## Next Steps

1. Recreate your Pinecone index with 768 dimensions
2. Try the indexing operation again
3. The error should be resolved and indexing should work properly

## Support

If you continue to have issues after following these steps, the error messages will now provide more detailed information about what went wrong.