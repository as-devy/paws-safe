-- Paws Safe — seed data (users, pets, pet_requests)
-- Prerequisites: run supabase/migrations/001_init.sql first.
-- Safe to re-run: clears seed-tagged emails / related rows first.

begin;

-- Wipe previous seed rows (by known seed emails)
delete from public.pet_requests
where requester_id in (
  select id from public.users where email like '%@seed.pawssafe.local'
)
or pet_id in (
  select p.id
  from public.pets p
  join public.users u on u.id = p.owner_id
  where u.email like '%@seed.pawssafe.local'
);

delete from public.pets
where owner_id in (
  select id from public.users where email like '%@seed.pawssafe.local'
);

delete from public.users
where email like '%@seed.pawssafe.local';

-- ---------------------------------------------------------------------------
-- users
-- Passwords are plain demo values for local/dev only — replace with auth later.
-- ---------------------------------------------------------------------------
insert into public.users
  (username, email, phone, country, city, password, role, verification_status)
values
  ('sara_admin', 'sara.admin@seed.pawssafe.local', '+201001111111', 'egypt', 'Cairo', 'Password123!', 'admin', 'approved'),
  ('omar_verified', 'omar@seed.pawssafe.local', '+201002222222', 'egypt', 'Giza', 'Password123!', 'user', 'approved'),
  ('nada_foster', 'nada@seed.pawssafe.local', '+201003333333', 'egypt', 'Alexandria', 'Password123!', 'user', 'approved'),
  ('karim_seeker', 'karim@seed.pawssafe.local', '+201004444444', 'egypt', 'Cairo', 'Password123!', 'user', 'none'),
  ('lina_seeker', 'lina@seed.pawssafe.local', '+447700900123', 'united kingdom', 'London', 'Password123!', 'user', 'pending'),
  ('youssef_owner', 'youssef@seed.pawssafe.local', '+201005555555', 'egypt', 'Mansoura', 'Password123!', 'user', 'approved');

-- ---------------------------------------------------------------------------
-- pets
-- ---------------------------------------------------------------------------
insert into public.pets (
  owner_id, category, img, name, age, gender, description,
  country, street_address, city, post_code,
  vaccines_prevention, health_history, diet, behavior,
  rehoming, foster, emergency, requested
)
values
  (
    (select id from public.users where email = 'omar@seed.pawssafe.local'),
    'dog',
    'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
    'Luna',
    2.0,
    'female',
    'Gentle rescue dog looking for a quiet forever home. Good with kids and already house-trained.',
    'egypt', '12 Nile Street', 'Cairo', '11511',
    'Up to date on rabies and DHPP. Monthly flea prevention.',
    'Spayed. No major surgeries.',
    'Adult dry food twice daily.',
    'Calm, loves walks, mild noise anxiety.',
    true, false, true, false
  ),
  (
    (select id from public.users where email = 'omar@seed.pawssafe.local'),
    'cat',
    'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg',
    'Milo',
    1.0,
    'male',
    'Playful indoor cat who needs temporary foster care while recovering. Loves sunny windowsills.',
    'egypt', '12 Nile Street', 'Cairo', '11511',
    'Vaccinated. Dewormed.',
    'Recovering from minor injury; needs calm space for 4–6 weeks.',
    'Wet food + dry kibble.',
    'Friendly, curious, no aggression.',
    false, true, true, false
  ),
  (
    (select id from public.users where email = 'nada@seed.pawssafe.local'),
    'rabbit',
    'https://images.pexels.com/photos/4588065/pexels-photo-4588065.jpeg',
    'Coco',
    3.0,
    'female',
    'Friendly rabbit seeking a calm forever home. Enjoys fresh greens and gentle handling.',
    'egypt', '8 Corniche Rd', 'Alexandria', '21532',
    'Vaccinated where applicable.',
    'Healthy. Neutered.',
    'Hay, leafy greens, pellets.',
    'Gentle and social.',
    true, false, false, false
  ),
  (
    (select id from public.users where email = 'nada@seed.pawssafe.local'),
    'dog',
    'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg',
    'Rex',
    4.0,
    'male',
    'Loyal companion looking for temporary foster while owner relocates.',
    'egypt', '8 Corniche Rd', 'Alexandria', '21532',
    'Fully vaccinated. Tick prevention current.',
    'Healthy. Neutered.',
    'Mixed dry food.',
    'Protective but trainable; best as only dog.',
    false, true, false, false
  ),
  (
    (select id from public.users where email = 'youssef@seed.pawssafe.local'),
    'bird',
    'https://images.pexels.com/photos/1661179/pexels-photo-1661179.jpeg',
    'Kiwi',
    1.5,
    'male',
    'Talkative budgie ready for adoption. Needs daily interaction and a spacious cage.',
    'egypt', '22 University St', 'Mansoura', '35516',
    'Healthy check recent.',
    'No known issues.',
    'Seeds + fresh greens.',
    'Vocal and affectionate.',
    true, false, false, false
  ),
  (
    (select id from public.users where email = 'youssef@seed.pawssafe.local'),
    'cat',
    'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg',
    'Nala',
    2.5,
    'female',
    'Sweet cat available for foster or adoption. Bonds quickly with calm households.',
    'egypt', '22 University St', 'Mansoura', '35516',
    'Vaccinated and flea treated.',
    'Spayed. Healthy.',
    'Grain-free dry food.',
    'Loves laps; shy at first.',
    true, true, false, false
  ),
  (
    (select id from public.users where email = 'sara.admin@seed.pawssafe.local'),
    'fish',
    'https://images.pexels.com/photos/128756/pexels-photo-128756.jpeg',
    'Bubbles',
    0.5,
    'female',
    'Community tank fish needing a new home. Setup guidance included.',
    'egypt', '1 Admin Plaza', 'Cairo', '11511',
    'N/A',
    'Healthy.',
    'Flake food.',
    'Peaceful.',
    true, false, false, false
  ),
  (
    (select id from public.users where email = 'omar@seed.pawssafe.local'),
    'dog',
    'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg',
    'Shadow',
    5.0,
    'male',
    'Senior-friendly dog seeking urgent rehoming due to housing change.',
    'egypt', '5 Pyramid View', 'Giza', '12511',
    'Vaccines up to date.',
    'Mild arthritis; managed with diet.',
    'Senior formula.',
    'Very gentle with people.',
    true, false, true, false
  );

-- ---------------------------------------------------------------------------
-- pet_requests (requested pets)
-- ---------------------------------------------------------------------------
insert into public.pet_requests (
  pet_id, requester_id, status, foster_duration, full_name, email, phone, message
)
values
  (
    (select id from public.pets where name = 'Luna' and owner_id = (select id from public.users where email = 'omar@seed.pawssafe.local') limit 1),
    (select id from public.users where email = 'karim@seed.pawssafe.local'),
    'pending',
    null,
    'Karim Hassan',
    'karim@seed.pawssafe.local',
    '+201004444444',
    'We have a fenced yard and experience with medium dogs.'
  ),
  (
    (select id from public.pets where name = 'Luna' and owner_id = (select id from public.users where email = 'omar@seed.pawssafe.local') limit 1),
    (select id from public.users where email = 'lina@seed.pawssafe.local'),
    'pending',
    null,
    'Lina Ahmed',
    'lina@seed.pawssafe.local',
    '+447700900123',
    'Looking to adopt a calm companion for our apartment.'
  ),
  (
    (select id from public.pets where name = 'Milo' and owner_id = (select id from public.users where email = 'omar@seed.pawssafe.local') limit 1),
    (select id from public.users where email = 'nada@seed.pawssafe.local'),
    'approved',
    '1-3 months',
    'Nada Farouk',
    'nada@seed.pawssafe.local',
    '+201003333333',
    'Happy to foster while Milo recovers.'
  ),
  (
    (select id from public.pets where name = 'Rex' and owner_id = (select id from public.users where email = 'nada@seed.pawssafe.local') limit 1),
    (select id from public.users where email = 'karim@seed.pawssafe.local'),
    'pending',
    '2-4 weeks',
    'Karim Hassan',
    'karim@seed.pawssafe.local',
    '+201004444444',
    'Can foster short-term during relocation period.'
  ),
  (
    (select id from public.pets where name = 'Coco' and owner_id = (select id from public.users where email = 'nada@seed.pawssafe.local') limit 1),
    (select id from public.users where email = 'lina@seed.pawssafe.local'),
    'pending',
    null,
    'Lina Ahmed',
    'lina@seed.pawssafe.local',
    '+447700900123',
    'Experienced with small pets; quiet home.'
  ),
  (
    (select id from public.pets where name = 'Nala' and owner_id = (select id from public.users where email = 'youssef@seed.pawssafe.local') limit 1),
    (select id from public.users where email = 'karim@seed.pawssafe.local'),
    'rejected',
    null,
    'Karim Hassan',
    'karim@seed.pawssafe.local',
    '+201004444444',
    'Interested in either foster or adopt.'
  ),
  (
    (select id from public.pets where name = 'Shadow' and owner_id = (select id from public.users where email = 'omar@seed.pawssafe.local') limit 1),
    (select id from public.users where email = 'nada@seed.pawssafe.local'),
    'pending',
    null,
    'Nada Farouk',
    'nada@seed.pawssafe.local',
    '+201003333333',
    'Can provide a calm home for a senior dog.'
  );

-- Mark pets with an approved request as requested = true
update public.pets p
set requested = true
where exists (
  select 1
  from public.pet_requests pr
  where pr.pet_id = p.id
    and pr.status = 'approved'
);

commit;
