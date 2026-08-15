"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useState } from "react";
import { HeartHandshake, PawPrint, X } from "lucide-react";
import { requestPet, type RequestPetState } from "@/lib/actions";
import RequestSelect from "@/components/pets/RequestSelect";

const initialState: RequestPetState = { message: null };

type RequestPetButtonProps = {
  petId: string;
  petName: string;
  isFoster: boolean;
  isLoggedIn: boolean;
  loginHref: string;
  requestStatus?: string | null;
  alreadyMatched?: boolean;
  emailVerified?: boolean;
};

function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  if (!errors?.length) return null;
  return (
    <div id={id} aria-live="polite">
      {errors.map((error) => (
        <p className="request-modal__error" key={error}>
          {error}
        </p>
      ))}
    </div>
  );
}

function requestCtaLabel(isFoster: boolean, status?: string | null) {
  if (status === "pending") return "Request sent";
  if (status === "approved") return "Request approved";
  if (status === "rejected") return "Request declined";
  if (status === "withdrawn") return "Request withdrawn";
  return isFoster ? "Foster Pet" : "Adopt Pet";
}

export default function RequestPetButton({
  petId,
  petName,
  isFoster,
  isLoggedIn,
  loginHref,
  requestStatus = null,
  alreadyMatched = false,
  emailVerified = true,
}: RequestPetButtonProps) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [state, formAction, pending] = useActionState(requestPet, initialState);
  const titleId = useId();
  const values = state.values;
  const errors = state.errors;
  const ctaLabel = requestCtaLabel(isFoster, requestStatus);
  const locked = Boolean(requestStatus);

  function closeModal() {
    setVisible(false);
  }

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setVisible(true));
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeModal();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (alreadyMatched) {
    return null;
  }

  const icon = isFoster ? (
    <PawPrint className="h-5 w-5" aria-hidden />
  ) : (
    <HeartHandshake className="h-5 w-5" aria-hidden />
  );

  if (!isLoggedIn) {
    return (
      <Link href={loginHref} className="pet-detail__cta">
        {icon}
        {isFoster ? "Foster Pet" : "Adopt Pet"}
      </Link>
    );
  }

  if (!emailVerified) {
    return (
      <Link href="/verify-email" className="pet-detail__cta">
        {icon}
        Verify email to request
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        className="pet-detail__cta"
        disabled={locked}
        onClick={() => {
          if (!locked) setOpen(true);
        }}
      >
        {icon}
        {ctaLabel}
      </button>

      {open ? (
        <div
          className={`request-modal${visible ? " is-open" : ""}`}
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
          onTransitionEnd={(event) => {
            if (event.target === event.currentTarget && !visible) {
              setOpen(false);
            }
          }}
        >
          <div
            className="request-modal__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <button
              type="button"
              className="request-modal__close"
              aria-label="Close request form"
              onClick={closeModal}
            >
              <X className="h-4 w-4" aria-hidden />
            </button>

            <div className="request-modal__head">
              <span className="request-modal__icon" aria-hidden>
                {isFoster ? (
                  <PawPrint className="h-5 w-5" />
                ) : (
                  <HeartHandshake className="h-5 w-5" />
                )}
              </span>
              <div>
                <p className="request-modal__kicker">
                  {isFoster ? "Foster request" : "Adoption request"}
                </p>
                <h2 id={titleId}>Request {petName}</h2>
                <p>
                  A few details about your home. Contact is shared only if the
                  owner approves.
                </p>
              </div>
            </div>

            <form className="request-modal__form" action={formAction} noValidate>
              <input type="hidden" name="petId" value={petId} />

              <div className="request-modal__body">
                <p className="request-modal__section">Your home</p>
                <div className="request-modal__grid">
                  <div className="request-modal__field">
                    <span>Are pets allowed in your residence?</span>
                    <RequestSelect
                      name="petsAllowed"
                      required
                      defaultValue={values?.petsAllowed ?? ""}
                      describedBy="request-pets-allowed-error"
                      options={[
                        { value: "yes", label: "Yes" },
                        { value: "no", label: "No" },
                        { value: "not_sure", label: "Not sure" },
                      ]}
                    />
                    <FieldError
                      id="request-pets-allowed-error"
                      errors={errors?.petsAllowed}
                    />
                  </div>

                  <div className="request-modal__field">
                    <span>Who else lives in your home?</span>
                    <RequestSelect
                      name="household"
                      required
                      defaultValue={values?.household ?? ""}
                      describedBy="request-household-error"
                      options={[
                        { value: "alone", label: "I live alone" },
                        { value: "adults", label: "Adults" },
                        { value: "children", label: "Children" },
                        { value: "roommates", label: "Roommates" },
                        { value: "adults_children", label: "Adults and children" },
                        { value: "adults_roommates", label: "Adults and roommates" },
                        { value: "family", label: "Adults, children, and roommates" },
                      ]}
                    />
                    <FieldError
                      id="request-household-error"
                      errors={errors?.household}
                    />
                  </div>

                  <div className="request-modal__field">
                    <span>Do you currently have other pets?</span>
                    <RequestSelect
                      name="otherPets"
                      required
                      defaultValue={values?.otherPets ?? ""}
                      describedBy="request-other-pets-error"
                      options={[
                        { value: "no", label: "No" },
                        { value: "yes_dog", label: "Yes, a dog" },
                        { value: "yes_cat", label: "Yes, a cat" },
                        { value: "yes_other", label: "Yes, other pets" },
                      ]}
                    />
                    <FieldError
                      id="request-other-pets-error"
                      errors={errors?.otherPets}
                    />
                  </div>

                  <div className="request-modal__field">
                    <span>Have you owned or cared for pets before?</span>
                    <RequestSelect
                      name="petExperience"
                      required
                      defaultValue={values?.petExperience ?? ""}
                      describedBy="request-experience-error"
                      options={[
                        { value: "yes", label: "Yes" },
                        { value: "no", label: "No" },
                      ]}
                    />
                    <FieldError
                      id="request-experience-error"
                      errors={errors?.petExperience}
                    />
                  </div>
                </div>

                <p className="request-modal__section">Care & availability</p>
                <div className="request-modal__grid">
                  {isFoster ? (
                    <div className="request-modal__field request-modal__field--full">
                      <span>How long are you available to foster?</span>
                      <RequestSelect
                        name="fosterDuration"
                        required
                        defaultValue={values?.fosterDuration ?? ""}
                        describedBy="request-foster-duration-error"
                        options={[
                          { value: "short_term", label: "Short-term (a few weeks)" },
                          { value: "long_term", label: "Long-term (several months or more)" },
                          { value: "emergency", label: "Emergency fostering" },
                          { value: "not_sure", label: "Not sure yet" },
                        ]}
                      />
                      <FieldError
                        id="request-foster-duration-error"
                        errors={errors?.fosterDuration}
                      />
                    </div>
                  ) : null}

                  <label className="request-modal__field">
                    <span>Daily time you can give</span>
                    <input
                      type="text"
                      name="timeCommitment"
                      required
                      placeholder="E.g., 2–3 hours, full-time"
                      defaultValue={values?.timeCommitment ?? ""}
                      aria-describedby="request-time-error"
                    />
                    <FieldError
                      id="request-time-error"
                      errors={errors?.timeCommitment}
                    />
                  </label>

                  <div className="request-modal__field">
                    <span>Financially prepared for pet care?</span>
                    <RequestSelect
                      name="financialPrepared"
                      required
                      defaultValue={values?.financialPrepared ?? ""}
                      describedBy="request-financial-error"
                      options={[
                        { value: "yes", label: "Yes" },
                        { value: "no", label: "No" },
                        { value: "unsure", label: "Unsure" },
                      ]}
                    />
                    <FieldError
                      id="request-financial-error"
                      errors={errors?.financialPrepared}
                    />
                  </div>
                </div>
              </div>

              <div className="request-modal__foot">
                <label className="request-modal__terms">
                  <input
                    type="checkbox"
                    name="terms"
                    value="on"
                    required
                    defaultChecked={values?.terms === "on"}
                    aria-describedby="request-terms-error"
                  />
                  <span>
                    I agree to the{" "}
                    <Link href="/terms" target="_blank" rel="noreferrer">
                      Terms and Conditions
                    </Link>
                  </span>
                </label>
                <FieldError id="request-terms-error" errors={errors?.terms} />

                {state.message ? (
                  <p className="request-modal__error" role="alert">
                    {state.message}
                  </p>
                ) : null}

                <button
                  type="submit"
                  className="request-modal__submit"
                  disabled={pending}
                >
                  {pending ? "Sending request…" : "Send request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
