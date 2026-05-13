import ReviewsManagementClient from "@/components/admin/ReviewsManagementClient";

export const metadata = {
  title: 'Reviews Management | Green Hopper Admin',
};

export default function AdminReviewsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Reviews Management</h2>
          <p className="text-zinc-500 mt-1 text-sm sm:text-base">Moderate and manage client testimonials.</p>
        </div>
      </div>
      
      <ReviewsManagementClient />
    </div>
  );
}
