export const run: ActionRun = async ({ params, logger, api, connections }) => {
  const shopId = connections.shopify.currentShopId;
  logger.info(`Starting product resync for shop ${shopId}`);
  
  // Get the shop record to get the domain
  const shop = await api.shopifyShop.findOne(shopId, {
    select: { domain: true }
  });
  
  // Step 1: Delete all existing shopifyProduct records
  let totalDeleted = 0;
  let hasMore = true;
  
  while (hasMore) {
    // Get a batch of products (max 250 at a time)
    const products = await api.shopifyProduct.findMany({
      filter: { shopId: { equals: shopId } },
      first: 250,
      select: { id: true }
    });
    
    if (products.length === 0) {
      hasMore = false;
      break;
    }
    
    // Delete the batch using bulk delete
    const productIds = products.map(p => p.id);
    await api.shopifyProduct.bulkDelete(productIds);
    totalDeleted += products.length;
    
    logger.info(`Deleted ${products.length} products (${totalDeleted} total)`);
    
    // If we got fewer than 250, we're done
    if (products.length < 250) {
      hasMore = false;
    }
  }
  
  logger.info(`Finished deleting ${totalDeleted} products`);
  
  // Step 2: Create and run a shopifySync to re-import products
  const sync = await api.shopifySync.run({
    domain: shop.domain,
    models: ["shopifyProduct"],
    shop: { _link: shopId }
  });
  
  logger.info(`Initiated sync with ID: ${sync.id}`);
  
  return {
    success: true,
    message: `Deleted ${totalDeleted} products and initiated sync`,
    deletedCount: totalDeleted,
    syncId: sync.id
  };
};
