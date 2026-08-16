/**
 * Seed Supabase with users, pets, and pet_requests.
 *
 * Usage:
 *   1. Put SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env
 *   2. Run schema once: paste supabase/migrations/001_init.sql in SQL Editor
 *   3. npm run seed
 *
 * Prefer the SQL file (supabase/seed.sql) if you only want the SQL Editor.
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnvFile() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env"), "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // .env optional if vars already exported
  }
}

loadEnvFile();

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(`
Missing env for seeding.

You already have the Connect keys (URL + publishable). Seeding also needs the
service role key (bypasses RLS):

  1. Supabase Dashboard → Project Settings → API Keys
  2. Copy "service_role" (secret) — NOT the publishable/anon key
  3. Put it in .env as:
       SUPABASE_SERVICE_ROLE_KEY=eyJ...

Then: npm run seed
`);
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const SEED_DOMAIN = "@seed.pawssafe.local";

const users = [
  {
    username: "sara_admin",
    email: `sara.admin${SEED_DOMAIN}`,
    phone: "+201001111111",
    country: "egypt",
    city: "Cairo",
    password: "Password123!",
    role: "admin",
    verification_status: "approved",
    email_verified: true,
  },
  {
    username: "omar_verified",
    email: `omar${SEED_DOMAIN}`,
    phone: "+201002222222",
    country: "egypt",
    city: "Giza",
    password: "Password123!",
    role: "user",
    verification_status: "approved",
    email_verified: true,
  },
  {
    username: "nada_foster",
    email: `nada${SEED_DOMAIN}`,
    phone: "+201003333333",
    country: "egypt",
    city: "Alexandria",
    password: "Password123!",
    role: "user",
    verification_status: "approved",
    email_verified: true,
  },
  {
    username: "karim_seeker",
    email: `karim${SEED_DOMAIN}`,
    phone: "+201004444444",
    country: "egypt",
    city: "Cairo",
    password: "Password123!",
    role: "user",
    verification_status: "pending",
    email_verified: true,
  },
  {
    username: "lina_seeker",
    email: `lina${SEED_DOMAIN}`,
    phone: "+447700900123",
    country: "united kingdom",
    city: "London",
    password: "Password123!",
    role: "user",
    verification_status: "pending",
    email_verified: true,
  },
  {
    username: "youssef_owner",
    email: `youssef${SEED_DOMAIN}`,
    phone: "+201005555555",
    country: "egypt",
    city: "Mansoura",
    password: "Password123!",
    role: "user",
    verification_status: "approved",
    email_verified: true,
  },
];

function petsFor(ids) {
  return [
    {
      owner_id: ids.omar,
      category: "dogs",
      img: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg",
      name: "Luna",
      age: 2,
      gender: "female",
      description:
        "Gentle rescue dog looking for a quiet forever home. Good with kids and already house-trained.",
      country: "egypt",
      street_address: "12 Nile Street",
      city: "Cairo",
      post_code: "11511",
      vaccines_prevention: "Up to date on rabies and DHPP. Monthly flea prevention.",
      health_history: "Spayed. No major surgeries.",
      diet: "Adult dry food twice daily.",
      behavior: "Calm, loves walks, mild noise anxiety.",
      rehoming: true,
      foster: false,
      emergency: true,
      requested: false,
    },
    {
      owner_id: ids.omar,
      category: "cats",
      img: "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg",
      name: "Milo",
      age: 1,
      gender: "male",
      description:
        "Playful indoor cat who needs temporary foster care while recovering. Loves sunny windowsills.",
      country: "egypt",
      street_address: "12 Nile Street",
      city: "Cairo",
      post_code: "11511",
      vaccines_prevention: "Vaccinated. Dewormed.",
      health_history: "Recovering from minor injury; needs calm space for 4–6 weeks.",
      diet: "Wet food + dry kibble.",
      behavior: "Friendly, curious, no aggression.",
      rehoming: false,
      foster: true,
      emergency: true,
      requested: false,
    },
    {
      owner_id: ids.nada,
      category: "rabbits",
      img: "https://images.pexels.com/photos/4588065/pexels-photo-4588065.jpeg",
      name: "Coco",
      age: 3,
      gender: "female",
      description:
        "Friendly rabbit seeking a calm forever home. Enjoys fresh greens and gentle handling.",
      country: "egypt",
      street_address: "8 Corniche Rd",
      city: "Alexandria",
      post_code: "21532",
      vaccines_prevention: "Vaccinated where applicable.",
      health_history: "Healthy. Neutered.",
      diet: "Hay, leafy greens, pellets.",
      behavior: "Gentle and social.",
      rehoming: true,
      foster: false,
      emergency: false,
      requested: false,
    },
    {
      owner_id: ids.nada,
      category: "dogs",
      img: "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg",
      name: "Rex",
      age: 4,
      gender: "male",
      description:
        "Loyal companion looking for temporary foster while owner relocates.",
      country: "egypt",
      street_address: "8 Corniche Rd",
      city: "Alexandria",
      post_code: "21532",
      vaccines_prevention: "Fully vaccinated. Tick prevention current.",
      health_history: "Healthy. Neutered.",
      diet: "Mixed dry food.",
      behavior: "Protective but trainable; best as only dog.",
      rehoming: false,
      foster: true,
      emergency: false,
      requested: false,
    },
    {
      owner_id: ids.youssef,
      category: "birds",
      img: "https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg",
      name: "Kiwi",
      age: 1.5,
      gender: "male",
      description:
        "Talkative budgie ready for adoption. Needs daily interaction and a spacious cage.",
      country: "egypt",
      street_address: "22 University St",
      city: "Mansoura",
      post_code: "35516",
      vaccines_prevention: "Healthy check recent.",
      health_history: "No known issues.",
      diet: "Seeds + fresh greens.",
      behavior: "Vocal and affectionate.",
      rehoming: true,
      foster: false,
      emergency: false,
      requested: false,
    },
    {
      owner_id: ids.youssef,
      category: "cats",
      img: "https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg",
      name: "Nala",
      age: 2.5,
      gender: "female",
      description:
        "Sweet cat available for foster or adoption. Bonds quickly with calm households.",
      country: "egypt",
      street_address: "22 University St",
      city: "Mansoura",
      post_code: "35516",
      vaccines_prevention: "Vaccinated and flea treated.",
      health_history: "Spayed. Healthy.",
      diet: "Grain-free dry food.",
      behavior: "Loves laps; shy at first.",
      rehoming: true,
      foster: true,
      emergency: false,
      requested: false,
    },
    {
      owner_id: ids.sara,
      category: "fish",
      img: "https://images.pexels.com/photos/128756/pexels-photo-128756.jpeg",
      name: "Bubbles",
      age: 0.5,
      gender: "female",
      description:
        "Community tank fish needing a new home. Setup guidance included.",
      country: "egypt",
      street_address: "1 Admin Plaza",
      city: "Cairo",
      post_code: "11511",
      vaccines_prevention: "N/A",
      health_history: "Healthy.",
      diet: "Flake food.",
      behavior: "Peaceful.",
      rehoming: true,
      foster: false,
      emergency: false,
      requested: false,
    },
    {
      owner_id: ids.omar,
      category: "dogs",
      img: "https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg",
      name: "Shadow",
      age: 5,
      gender: "male",
      description:
        "Senior-friendly dog seeking urgent rehoming due to housing change.",
      country: "egypt",
      street_address: "5 Pyramid View",
      city: "Giza",
      post_code: "12511",
      vaccines_prevention: "Vaccines up to date.",
      health_history: "Mild arthritis; managed with diet.",
      diet: "Senior formula.",
      behavior: "Very gentle with people.",
      rehoming: true,
      foster: false,
      emergency: true,
      requested: false,
    },
  ];
}

async function clearSeedData() {
  const { data: seedUsers, error } = await supabase
    .from("users")
    .select("id, email")
    .like("email", `%${SEED_DOMAIN}`);

  if (error) throw error;
  if (!seedUsers?.length) return;

  const userIds = seedUsers.map((u) => u.id);

  const { data: seedPets, error: petsLookupError } = await supabase
    .from("pets")
    .select("id")
    .in("owner_id", userIds);

  if (petsLookupError) throw petsLookupError;

  const petIds = (seedPets ?? []).map((p) => p.id);

  if (petIds.length) {
    const { error: reqErr } = await supabase
      .from("pet_requests")
      .delete()
      .in("pet_id", petIds);
    if (reqErr) throw reqErr;
  }

  const { error: reqByUserErr } = await supabase
    .from("pet_requests")
    .delete()
    .in("requester_id", userIds);
  if (reqByUserErr) throw reqByUserErr;

  if (userIds.length) {
    const { error: petsErr } = await supabase
      .from("pets")
      .delete()
      .in("owner_id", userIds);
    if (petsErr) throw petsErr;
  }

  const { error: usersErr } = await supabase
    .from("users")
    .delete()
    .in("id", userIds);
  if (usersErr) throw usersErr;
}

async function main() {
  console.log("Clearing previous seed rows…");
  await clearSeedData();

  console.log("Inserting users…");
  const { data: insertedUsers, error: usersError } = await supabase
    .from("users")
    .insert(users)
    .select("id, email, username");

  if (usersError) throw usersError;

  const byEmail = Object.fromEntries(
    insertedUsers.map((u) => [u.email, u.id]),
  );

  const ids = {
    sara: byEmail[`sara.admin${SEED_DOMAIN}`],
    omar: byEmail[`omar${SEED_DOMAIN}`],
    nada: byEmail[`nada${SEED_DOMAIN}`],
    karim: byEmail[`karim${SEED_DOMAIN}`],
    lina: byEmail[`lina${SEED_DOMAIN}`],
    youssef: byEmail[`youssef${SEED_DOMAIN}`],
  };

  console.log("Inserting pets…");
  const { data: insertedPets, error: petsError } = await supabase
    .from("pets")
    .insert(petsFor(ids))
    .select("id, name, owner_id");

  if (petsError) throw petsError;

  const petId = (name, ownerId) =>
    insertedPets.find((p) => p.name === name && p.owner_id === ownerId)?.id;

  const requests = [
    {
      pet_id: petId("Luna", ids.omar),
      requester_id: ids.karim,
      status: "pending",
      foster_duration: null,
      full_name: "Karim Hassan",
      email: `karim${SEED_DOMAIN}`,
      phone: "+201004444444",
      message: "We have a fenced yard and experience with medium dogs.",
    },
    {
      pet_id: petId("Luna", ids.omar),
      requester_id: ids.lina,
      status: "pending",
      foster_duration: null,
      full_name: "Lina Ahmed",
      email: `lina${SEED_DOMAIN}`,
      phone: "+447700900123",
      message: "Looking to adopt a calm companion for our apartment.",
    },
    {
      pet_id: petId("Milo", ids.omar),
      requester_id: ids.nada,
      status: "approved",
      foster_duration: "1-3 months",
      full_name: "Nada Farouk",
      email: `nada${SEED_DOMAIN}`,
      phone: "+201003333333",
      message: "Happy to foster while Milo recovers.",
    },
    {
      pet_id: petId("Rex", ids.nada),
      requester_id: ids.karim,
      status: "pending",
      foster_duration: "2-4 weeks",
      full_name: "Karim Hassan",
      email: `karim${SEED_DOMAIN}`,
      phone: "+201004444444",
      message: "Can foster short-term during relocation period.",
    },
    {
      pet_id: petId("Coco", ids.nada),
      requester_id: ids.lina,
      status: "pending",
      foster_duration: null,
      full_name: "Lina Ahmed",
      email: `lina${SEED_DOMAIN}`,
      phone: "+447700900123",
      message: "Experienced with small pets; quiet home.",
    },
    {
      pet_id: petId("Nala", ids.youssef),
      requester_id: ids.karim,
      status: "rejected",
      foster_duration: null,
      full_name: "Karim Hassan",
      email: `karim${SEED_DOMAIN}`,
      phone: "+201004444444",
      message: "Interested in either foster or adopt.",
    },
    {
      pet_id: petId("Shadow", ids.omar),
      requester_id: ids.nada,
      status: "pending",
      foster_duration: null,
      full_name: "Nada Farouk",
      email: `nada${SEED_DOMAIN}`,
      phone: "+201003333333",
      message: "Can provide a calm home for a senior dog.",
    },
  ].filter((r) => r.pet_id && r.requester_id);

  console.log("Inserting pet requests…");
  const { data: insertedRequests, error: requestsError } = await supabase
    .from("pet_requests")
    .insert(requests)
    .select("id, pet_id, status");

  if (requestsError) throw requestsError;

  const approvedPetIds = [
    ...new Set(
      insertedRequests.filter((r) => r.status === "approved").map((r) => r.pet_id),
    ),
  ];

  if (approvedPetIds.length) {
    const { error: flagError } = await supabase
      .from("pets")
      .update({ requested: true })
      .in("id", approvedPetIds);
    if (flagError) throw flagError;
  }

  console.log("Seed complete:");
  console.log(`  users:         ${insertedUsers.length}`);
  console.log(`  pets:          ${insertedPets.length}`);
  console.log(`  pet_requests:  ${insertedRequests.length}`);
  console.log("\nDemo logins (password for all: Password123!):");
  for (const u of users) {
    console.log(`  ${u.email}  (${u.role}, ${u.verification_status})`);
  }
}

main().catch((err) => {
  console.error("Seed failed:", err.message || err);
  process.exit(1);
});
