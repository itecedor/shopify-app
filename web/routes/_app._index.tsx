import { useState } from "react";
import { AutoTable } from "@gadgetinc/react/auto/polaris";
import {
  Banner,
  BlockStack,
  Box,
  Button,
  Card,
  Layout,
  Link,
  Page,
  Text,
} from "@shopify/polaris";
import { api } from "../api";

export default function Index() {
  const [isCalling, setIsCalling] = useState(false);

  const handleResyncClick = async () => {
    setIsCalling(true);
    try {
      await api.resyncProducts();
      shopify.toast.show("Products resynced successfully!");
    } catch (err) {
      shopify.toast.show("Failed to resync products. Please try again.");
    } finally {
      setIsCalling(false);
    }
  };

  return (
    <Page title="Products on Sale (excluding Evergreen)">
      <Layout>
        <Layout.Section>
          <Box paddingBlockEnd="400">
            <Button
              variant="primary"
              tone="critical"
              loading={isCalling}
              disabled={isCalling}
              onClick={handleResyncClick}
            >
              {isCalling ? "Resyncing..." : "Resync All Products"}
            </Button>
          </Box>
          <Card padding="0">
            <AutoTable live
              model={api.shopifyProduct}
              initialSort={{ shopifyCreatedAt: "Ascending" }}
              filter={{
                NOT: {
                  tags: {
                    matches: "evergreen"
                  }
                }
              }}
              columns={[
                "title",
                {
                  header: "Price",
                  field: "variants.edges.node.price"
                },
                {
                  header: "Price",
                  field: "variants.edges.node.compareAtPrice"
                },
                {
                  header: "Compare At Price",
                  render: ({ record }) => {
                    if (record.compareAtPriceRange) {
                      return <div>${record.compareAtPriceRange.maxVariantCompareAtPrice.amount}</div>;
                    }
                  },
                },
                {
                  header: "Tags",
                  render: ({ record }) => {
                    const tagCount = record.tags.length;
                    let tagList = record.tags.map((eachTag, i) => {
                      if (i == (tagCount - 1)) {
                        return <span>{eachTag}</span>;
                      } else {
                        return <span>{eachTag}, </span>;
                      }
                    });
                    return <div>{tagList}</div>;
                  },
                },
                {
                  header: "Link",
                  render: ({ record }) => {
                    return <div><a href={"https://admin.shopify.com/store/i-heart-test-store/products/" + record.id} target="_blank">Edit Product</a></div>;
                  }
                },
              ]}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
