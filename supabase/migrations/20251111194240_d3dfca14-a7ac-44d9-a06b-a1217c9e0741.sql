-- Add unique constraints to prevent duplicate emails in each sector

-- Companies: One user can only own ONE company (owner_id must be unique)
ALTER TABLE companies 
ADD CONSTRAINT unique_company_owner UNIQUE (owner_id);

-- Staff: One user can only have ONE staff record (user_id must be unique)
ALTER TABLE staff 
ADD CONSTRAINT unique_staff_user UNIQUE (user_id);

-- Athletes: One email can only appear ONCE (email must be unique)
ALTER TABLE athletes 
ADD CONSTRAINT unique_athlete_email UNIQUE (email);

-- Add comments explaining the constraints
COMMENT ON CONSTRAINT unique_company_owner ON companies IS 
'Ensures a user can only be owner of one company';

COMMENT ON CONSTRAINT unique_staff_user ON staff IS 
'Ensures a user can only have one staff record across all companies';

COMMENT ON CONSTRAINT unique_athlete_email ON athletes IS 
'Ensures an email can only be registered once as an athlete';