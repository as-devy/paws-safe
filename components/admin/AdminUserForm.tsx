"use client";

import { useActionState } from "react";
import Link from "next/link";
import { COUNTRIES } from "@/lib/countries";
import { adminUpdateUser, type AdminUpdateUserState } from "@/lib/actions";
import type { AdminUserRecord } from "@/lib/admin-server";

const initialState: AdminUpdateUserState = { message: null };

export default function AdminUserForm({ user }: { user: AdminUserRecord }) {
  const [state, formAction, pending] = useActionState(adminUpdateUser, initialState);

  return (
    <form className="admin-form" action={formAction} noValidate>
      <input type="hidden" name="userId" value={user.id} />

      <div className="admin-form__grid">
        <label className="admin-field">
          <span>Name</span>
          <input name="username" defaultValue={user.username} required />
          {state.errors?.username?.map((error) => (
            <em key={error}>{error}</em>
          ))}
        </label>

        <label className="admin-field">
          <span>Email</span>
          <input name="email" type="email" defaultValue={user.email} required />
          {state.errors?.email?.map((error) => (
            <em key={error}>{error}</em>
          ))}
        </label>

        <label className="admin-field">
          <span>Phone</span>
          <input name="phone" type="tel" defaultValue={user.phone} />
        </label>

        <label className="admin-field">
          <span>City</span>
          <input name="city" defaultValue={user.city} />
        </label>

        <label className="admin-field">
          <span>Country</span>
          <select name="country" defaultValue={user.country}>
            <option value="">Country</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </label>

        <label className="admin-field">
          <span>Role</span>
          <select name="role" defaultValue={user.role}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </label>
      </div>

      <label className="admin-check">
        <input
          type="checkbox"
          name="emailVerified"
          defaultChecked={user.emailVerified}
        />
        Email verified
      </label>

      {state.message ? (
        <p className="admin-form__error" role="alert">
          {state.message}
        </p>
      ) : null}

      <div className="admin-form__actions">
        <Link href="/admin" className="confirm-modal__btn confirm-modal__btn--ghost">
          Cancel
        </Link>
        <button
          type="submit"
          className="confirm-modal__btn confirm-modal__btn--primary"
          disabled={pending}
        >
          {pending ? "Saving…" : "Save user"}
        </button>
      </div>
    </form>
  );
}
