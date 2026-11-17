import { ServicePage, serviceMetadata } from "@/components/services/service-page";

const SLUG = "ppf-paint-protection-film-rohini";

export const metadata = serviceMetadata(SLUG);

export default function Page() {
  return <ServicePage slug={SLUG} />;
}
