import { ServicePage, serviceMetadata } from "@/components/services/service-page";

const SLUG = "monthly-car-care-package-rohini";

export const metadata = serviceMetadata(SLUG);

export default function Page() {
  return <ServicePage slug={SLUG} />;
}
