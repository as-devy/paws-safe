-- Structured questionnaire fields collected when requesting a pet.

alter table public.pet_requests
  add column if not exists pets_allowed text,
  add column if not exists household text,
  add column if not exists other_pets text,
  add column if not exists pet_experience text,
  add column if not exists time_commitment text,
  add column if not exists financial_prepared text;

alter table public.pet_requests
  drop constraint if exists pet_requests_pets_allowed_check,
  drop constraint if exists pet_requests_household_check,
  drop constraint if exists pet_requests_other_pets_check,
  drop constraint if exists pet_requests_pet_experience_check,
  drop constraint if exists pet_requests_financial_prepared_check;

alter table public.pet_requests
  add constraint pet_requests_pets_allowed_check
    check (pets_allowed is null or pets_allowed in ('yes', 'no', 'not_sure')),
  add constraint pet_requests_household_check
    check (
      household is null or household in (
        'alone',
        'adults',
        'children',
        'roommates',
        'adults_children',
        'adults_roommates',
        'family'
      )
    ),
  add constraint pet_requests_other_pets_check
    check (other_pets is null or other_pets in ('no', 'yes_dog', 'yes_cat', 'yes_other')),
  add constraint pet_requests_pet_experience_check
    check (pet_experience is null or pet_experience in ('yes', 'no')),
  add constraint pet_requests_financial_prepared_check
    check (financial_prepared is null or financial_prepared in ('yes', 'no', 'unsure'));
