import HeaderSkeleton from "@/components/layout/HeaderSkeleton";
import ListingSkeleton from "@/components/pets/ListingSkeleton";

export default function FosterLoading() {
  return (
    <>
      <HeaderSkeleton />
      <ListingSkeleton mode="foster" />
    </>
  );
}
