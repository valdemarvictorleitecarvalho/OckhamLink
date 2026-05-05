import { RedirectError } from "./components/redirect-error";
import { RedirectLoading } from "./components/redirect-loading";
import { useLinkResolver } from "./hooks/use-link-resolver";

/**
 * RedirectPage component serves as the main entry point for handling redirection based on short codes. It utilizes
 * the `useLinkResolver` hook to manage the resolution process and conditionally renders loading and error states.
 * The component itself does not contain any UI elements for successful redirection, as the actual redirection is
 * handled by the hook through a hard redirect (`window.location.replace`) when a valid original URL is retrieved.
 * This design ensures a seamless user experience, where users are either redirected to their destination or presented
 * with appropriate feedback if the link is invalid or expired.
 */
export const RedirectPage = () => {
  const { isLoading, isError } = useLinkResolver();

  if (isLoading) return <RedirectLoading />;

  if (isError) return <RedirectError />;

  return null;
};
