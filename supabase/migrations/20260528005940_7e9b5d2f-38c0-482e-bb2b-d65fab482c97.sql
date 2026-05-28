
CREATE OR REPLACE FUNCTION public.enforce_profile_update_rules()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_actor_role text;
  v_target_coach_role text;
BEGIN
  -- Role can never change via this path
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Changing role is not allowed';
  END IF;

  IF v_actor IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT role INTO v_actor_role FROM profiles WHERE id = v_actor;

  -- coach_id rules
  IF NEW.coach_id IS DISTINCT FROM OLD.coach_id THEN
    -- Only a coach acting on their own student can change coach_id
    IF v_actor_role <> 'coach' THEN
      RAISE EXCEPTION 'Only a coach can change coach_id';
    END IF;

    -- The new coach_id (if not null) must reference an actual coach
    IF NEW.coach_id IS NOT NULL THEN
      SELECT role INTO v_target_coach_role FROM profiles WHERE id = NEW.coach_id;
      IF v_target_coach_role IS DISTINCT FROM 'coach' THEN
        RAISE EXCEPTION 'coach_id must reference a profile with role = coach';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_profile_update_rules ON public.profiles;
CREATE TRIGGER enforce_profile_update_rules
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.enforce_profile_update_rules();
