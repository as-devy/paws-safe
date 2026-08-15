"use client";

import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { deletePet, type DeletePetState } from "@/lib/actions";

const initialState: DeletePetState = { message: null };

type DeletePetButtonProps = {
  petId: string;
  petName: string;
  redirectTo?: "/profile" | "/adoption" | "/foster";
  variant?: "cta" | "card";
};

export default function DeletePetButton({
  petId,
  petName,
  redirectTo,
  variant = "cta",
}: DeletePetButtonProps) {
  const [state, formAction, pending] = useActionState(deletePet, initialState);
  const isCard = variant === "card";

  return (
    <form
      action={formAction}
      className={isCard ? "profile-pet__delete" : undefined}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Delete ${petName}'s listing? This cannot be undone.`,
        );
        if (!confirmed) event.preventDefault();
      }}
    >
      <input type="hidden" name="petId" value={petId} />
      {redirectTo ? <input type="hidden" name="next" value={redirectTo} /> : null}
      <button
        type="submit"
        className={isCard ? "profile-pet__btn profile-pet__btn--danger" : "pet-detail__delete"}
        disabled={pending}
      >
        <Trash2 className={isCard ? "h-4 w-4" : "h-5 w-5"} aria-hidden />
        {pending ? "Deleting…" : "Delete"}
      </button>
      {state.message ? (
        <p className={isCard ? "profile-pet__error" : "pet-detail__cta-note"} role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
