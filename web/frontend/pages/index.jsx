import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  Link,
  Text,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";
import { useEffect } from "react";
import { ProductsCard } from "../components/ProductsCard";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
import { useState } from "react";
import AddFleuriste from "../components/AddFleuriste";

export default function HomePage() {
  return (
    <Page narrowWidth>
      <TitleBar title='Fleuriste App' primaryAction={null} />
      <Layout>
        <AddFleuriste />
      </Layout>
    </Page>
  );
}
