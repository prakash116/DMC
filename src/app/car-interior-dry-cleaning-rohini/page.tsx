import { ServicePage, serviceMetadata } from "@/components/services/service-page";

const SLUG = "car-interior-dry-cleaning-rohini";

export const metadata = serviceMetadata(SLUG);

export default function Page() {
  return <ServicePage slug={SLUG} />;
}
