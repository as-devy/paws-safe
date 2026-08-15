import HeaderSkeleton from "@/components/layout/HeaderSkeleton";
import ListingSkeleton from "@/components/pets/ListingSkeleton";

export default function AdoptionLoading() {
  return (
    <>
      <HeaderSkeleton />
      <ListingSkeleton mode="adoption" />
    </>
  );
}
