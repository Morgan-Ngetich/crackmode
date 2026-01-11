import IntroDoc from "@/components/docs/introduction.mdx";
import { createFileRoute } from "@tanstack/react-router";

function DocsIndex() {
  return (
      <IntroDoc />
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Route: any = createFileRoute("/_layout/docs/")({
  component: DocsIndex,
});
