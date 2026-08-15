import HeaderSkeleton from "@/components/layout/HeaderSkeleton";
import PetDetailSkeleton from "@/components/pets/PetDetailSkeleton";
import "../../pet-detail.css";

export default function PetLoading() {
  return (
    <>
      <HeaderSkeleton />
      <PetDetailSkeleton />
    </>
  );
}
