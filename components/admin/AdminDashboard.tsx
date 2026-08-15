"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Mail,
  PawPrint,
  Pencil,
  Search,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import { adminDeletePet, adminDeleteUser } from "@/lib/actions";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { formatRelativeTime } from "@/lib/notifications";
import {
  adminPetEditHref,
  adminUserEditHref,
  petDetailHref,
  userProfileHref,
} from "@/lib/pets";
import type { AdminDashboardData, AdminPetRow, AdminUserRow } from "@/lib/admin-server";

type Tab = "pets" | "users";

function titleCase(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "PS";
}

export default function AdminDashboard({
  data,
  viewerId,
}: {
  data: AdminDashboardData;
  viewerId: string;
}) {
  const [tab, setTab] = useState<Tab>("pets");
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();

  const pets = useMemo(
    () => data.pets.filter((pet) => matchesPet(pet, needle)),
    [data.pets, needle],
  );
  const users = useMemo(
    () => data.users.filter((user) => matchesUser(user, needle)),
    [data.users, needle],
  );

  const { stats } = data;

  return (
    <main className="admin">
      <section className="admin__hero">
        <div className="admin__hero-inner">
          <p className="admin__kicker">Control center</p>
          <h1>Admin dashboard</h1>
          <p className="admin__crumb">
            <Link href="/">Home</Link>
            <span aria-hidden> &gt; </span>
            Admin
          </p>
        </div>
      </section>

      <div className="admin__frame">
        <section className="admin__stats" aria-label="Site overview">
          <article className="admin-stat">
            <span className="admin-stat__icon">
              <Users className="h-5 w-5" />
            </span>
            <div>
              <strong>{stats.users}</strong>
              <span>Users</span>
            </div>
          </article>
          <article className="admin-stat">
            <span className="admin-stat__icon">
              <PawPrint className="h-5 w-5" />
            </span>
            <div>
              <strong>{stats.pets}</strong>
              <span>Listings</span>
            </div>
          </article>
          <article className="admin-stat">
            <span className="admin-stat__icon">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div>
              <strong>{stats.adoption}</strong>
              <span>Adoption</span>
            </div>
          </article>
          <article className="admin-stat">
            <span className="admin-stat__icon">
              <PawPrint className="h-5 w-5" />
            </span>
            <div>
              <strong>{stats.foster}</strong>
              <span>Foster</span>
            </div>
          </article>
          <article className="admin-stat">
            <span className="admin-stat__icon is-urgent">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div>
              <strong>{stats.urgent}</strong>
              <span>Urgent</span>
            </div>
          </article>
          <article className="admin-stat">
            <span className="admin-stat__icon">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <strong>{stats.admins}</strong>
              <span>Admins</span>
            </div>
          </article>
        </section>

        <section className="admin-panel">
          <div className="admin-panel__head">
            <div className="admin-tabs" role="tablist" aria-label="Admin lists">
              <button
                type="button"
                role="tab"
                aria-selected={tab === "pets"}
                className={tab === "pets" ? "is-active" : ""}
                onClick={() => setTab("pets")}
              >
                Pets
                <em>{data.pets.length}</em>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "users"}
                className={tab === "users" ? "is-active" : ""}
                onClick={() => setTab("users")}
              >
                Users
                <em>{data.users.length}</em>
              </button>
            </div>

            <label className="admin-search">
              <Search className="h-4 w-4" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={
                  tab === "pets"
                    ? "Search pets, owners, cities…"
                    : "Search names, emails, cities…"
                }
              />
            </label>
          </div>

          {tab === "pets" ? (
            <PetsTable pets={pets} total={data.pets.length} />
          ) : (
            <UsersTable users={users} total={data.users.length} viewerId={viewerId} />
          )}
        </section>
      </div>
    </main>
  );
}

function matchesPet(pet: AdminPetRow, needle: string) {
  if (!needle) return true;
  return [
    pet.name,
    pet.category,
    pet.status,
    pet.city,
    pet.country,
    pet.ownerName,
    pet.ownerEmail,
  ]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(needle));
}

function matchesUser(user: AdminUserRow, needle: string) {
  if (!needle) return true;
  return [
    user.name,
    user.email,
    user.phone,
    user.city,
    user.country,
    user.role,
    user.verification,
  ]
    .filter(Boolean)
    .some((value) => String(value).toLowerCase().includes(needle));
}

function PetsTable({ pets, total }: { pets: AdminPetRow[]; total: number }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [target, setTarget] = useState<AdminPetRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (pets.length === 0) {
    return (
      <p className="admin-empty">
        {total === 0 ? "No pets have been listed yet." : "No pets match that search."}
      </p>
    );
  }

  return (
    <div className="admin-table-wrap">
      {error ? <p className="admin-inline-error">{error}</p> : null}
      <table className="admin-table">
        <thead>
          <tr>
            <th>Pet</th>
            <th>Type</th>
            <th>Status</th>
            <th>Owner</th>
            <th>Location</th>
            <th>Requests</th>
            <th>Listed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pets.map((pet) => (
            <tr key={pet.id}>
              <td>
                <Link href={petDetailHref(pet.id)} className="admin-pet">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pet.img} alt="" />
                  <span>
                    <strong>{titleCase(pet.name)}</strong>
                    <small>{titleCase(pet.category)}</small>
                  </span>
                </Link>
              </td>
              <td>
                <span className={`admin-pill is-${pet.status}`}>
                  {pet.status === "foster" ? "Foster" : "Adoption"}
                </span>
              </td>
              <td>
                <div className="admin-flags">
                  {pet.emergency ? (
                    <span className="admin-pill is-urgent">Urgent</span>
                  ) : null}
                  <span className={`admin-pill ${pet.requested ? "is-matched" : "is-open"}`}>
                    {pet.requested ? "Matched" : "Open"}
                  </span>
                </div>
              </td>
              <td>
                <Link href={userProfileHref(pet.ownerId)} className="admin-link">
                  {titleCase(pet.ownerName)}
                </Link>
                {pet.ownerEmail ? <small className="admin-sub">{pet.ownerEmail}</small> : null}
              </td>
              <td className="admin-cell-location">
                {[pet.city, pet.country].filter(Boolean).map(titleCase).join(", ") || "—"}
              </td>
              <td>{pet.requestCount}</td>
              <td>{formatRelativeTime(pet.createdAt)}</td>
              <td>
                <div className="admin-row-actions">
                  <Link href={adminPetEditHref(pet.id)} className="admin-icon-btn admin-icon-btn--edit" aria-label={`Edit ${pet.name}`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    className="admin-icon-btn is-danger"
                    aria-label={`Delete ${pet.name}`}
                    onClick={() => {
                      setError(null);
                      setTarget(pet);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <Link href={petDetailHref(pet.id)} className="admin-icon-btn admin-icon-btn--view" aria-label={`View ${pet.name}`}>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {target ? (
        <ConfirmModal
          title={`Delete ${titleCase(target.name)}?`}
          description="This listing will be removed for everyone. This cannot be undone."
          confirmLabel="Delete listing"
          tone="danger"
          icon={<Trash2 className="h-5 w-5" />}
          pending={pending}
          onCancel={() => setTarget(null)}
          onConfirm={() => {
            startTransition(async () => {
              const result = await adminDeletePet(target.id);
              if (!result.ok) {
                setError(result.message ?? "Could not delete this listing.");
                setTarget(null);
                return;
              }
              setTarget(null);
              router.refresh();
            });
          }}
        />
      ) : null}
    </div>
  );
}

function UsersTable({
  users,
  total,
  viewerId,
}: {
  users: AdminUserRow[];
  total: number;
  viewerId: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [target, setTarget] = useState<AdminUserRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (users.length === 0) {
    return (
      <p className="admin-empty">
        {total === 0 ? "No users yet." : "No users match that search."}
      </p>
    );
  }

  return (
    <div className="admin-table-wrap">
      {error ? <p className="admin-inline-error">{error}</p> : null}
      <table className="admin-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Contact</th>
            <th>Role</th>
            <th>Status</th>
            <th>Listings</th>
            <th>Requests</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isSelf = user.id === viewerId;
            return (
              <tr key={user.id}>
                <td>
                  <Link href={userProfileHref(user.id)} className="admin-user">
                    <span className="admin-avatar" aria-hidden>
                      {initials(user.name)}
                    </span>
                    <span>
                      <strong>{titleCase(user.name)}</strong>
                      <small>
                        {[user.city, user.country].filter(Boolean).map(titleCase).join(", ") ||
                          "No location"}
                      </small>
                    </span>
                  </Link>
                </td>
                <td>
                  {user.email ? (
                    <a href={`mailto:${user.email}`} className="admin-mail">
                      <Mail className="h-3.5 w-3.5" aria-hidden />
                      {user.email}
                    </a>
                  ) : (
                    "—"
                  )}
                  {user.phone ? <small className="admin-sub">{user.phone}</small> : null}
                </td>
                <td>
                  <span className={`admin-pill ${user.role === "admin" ? "is-admin" : "is-user"}`}>
                    {user.role === "admin" ? "Admin" : "User"}
                  </span>
                </td>
                <td>
                  <div className="admin-flags">
                    <span className={`admin-pill ${user.emailVerified ? "is-open" : "is-pending"}`}>
                      {user.emailVerified ? "Email verified" : "Unverified"}
                    </span>
                  </div>
                </td>
                <td>{user.listingCount}</td>
                <td>{user.requestCount}</td>
                <td>{formatRelativeTime(user.memberSince)}</td>
                <td>
                  <div className="admin-row-actions">
                    <Link
                      href={adminUserEditHref(user.id)}
                      className="admin-icon-btn admin-icon-btn--edit"
                      aria-label={`Edit ${user.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      className="admin-icon-btn is-danger"
                      aria-label={`Delete ${user.name}`}
                      disabled={isSelf}
                      title={isSelf ? "You cannot delete your own account" : `Delete ${user.name}`}
                      onClick={() => {
                        if (isSelf) return;
                        setError(null);
                        setTarget(user);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <Link href={userProfileHref(user.id)} className="admin-icon-btn admin-icon-btn--view" aria-label={`View ${user.name}`}>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {target ? (
        <ConfirmModal
          title={`Delete ${titleCase(target.name)}?`}
          description="Their listings, requests, and messages will be removed. This cannot be undone."
          confirmLabel="Delete user"
          tone="danger"
          icon={<Trash2 className="h-5 w-5" />}
          pending={pending}
          onCancel={() => setTarget(null)}
          onConfirm={() => {
            startTransition(async () => {
              const result = await adminDeleteUser(target.id);
              if (!result.ok) {
                setError(result.message ?? "Could not delete this account.");
                setTarget(null);
                return;
              }
              setTarget(null);
              router.refresh();
            });
          }}
        />
      ) : null}
    </div>
  );
}
