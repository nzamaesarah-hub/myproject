import TestimonialSection from "@/components/TestimonialSection";
import { listPublicTestimonials } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default function TestimonialsPage() {
  return <TestimonialSection testimonials={listPublicTestimonials()} />;
}
