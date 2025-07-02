import type { GadgetModel } from "gadget-server";

// This file describes the schema for the "shopifyProduct" model, go to https://products-sale-app.gadget.app/edit to view/edit your model in Gadget
// For more information on how to update this file http://docs.gadget.dev

export const schema: GadgetModel = {
  type: "gadget/model-schema/v1",
  storageKey: "DataModel-Shopify-Product",
  fields: { test: { type: "string", storageKey: "RnCtye1gzh4E" } },
  shopify: {
    fields: [
      "body",
      "category",
      "compareAtPriceRange",
      "handle",
      "hasVariantsThatRequiresComponents",
      "productType",
      "publishedAt",
      "shop",
      "shopifyCreatedAt",
      "shopifyUpdatedAt",
      "tags",
      "title",
      "variants",
    ],
  },
};
