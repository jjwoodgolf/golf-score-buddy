
-- 1) Prevent privilege escalation on profile self-insert
DROP POLICY IF EXISTS profiles_insert ON public.profiles;
CREATE POLICY profiles_insert ON public.profiles
  FOR INSERT TO public
  WITH CHECK (id = auth.uid() AND role = 'student');

-- Also prevent users from changing their own role via UPDATE
DROP POLICY IF EXISTS profiles_update ON public.profiles;
CREATE POLICY profiles_update ON public.profiles
  FOR UPDATE TO public
  USING ((id = auth.uid()) OR ((get_my_role() = 'coach') AND (coach_id = auth.uid())))
  WITH CHECK (
    ((id = auth.uid()) OR ((get_my_role() = 'coach') AND (coach_id = auth.uid())))
    AND role = (SELECT p.role FROM public.profiles p WHERE p.id = profiles.id)
  );

-- Harden the new-user trigger to ignore client-supplied 'coach' role from signUp metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO profiles (id, role, full_name, email)
  VALUES (
    NEW.id,
    'student',
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END; $function$;

-- 2) DELETE policies mirroring ownership of existing INSERT/UPDATE policies
CREATE POLICY rounds_delete ON public.rounds
  FOR DELETE TO public
  USING (
    (student_id = auth.uid())
    OR ((get_my_role() = 'coach') AND EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = rounds.student_id AND p.coach_id = auth.uid()
    ))
  );

CREATE POLICY holes_played_delete ON public.holes_played
  FOR DELETE TO public
  USING (
    EXISTS (
      SELECT 1 FROM rounds r
      WHERE r.id = holes_played.round_id
        AND (
          r.student_id = auth.uid()
          OR ((get_my_role() = 'coach') AND EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = r.student_id AND p.coach_id = auth.uid()
          ))
        )
    )
  );

CREATE POLICY shots_delete ON public.shots
  FOR DELETE TO public
  USING (
    EXISTS (
      SELECT 1 FROM holes_played hp
      JOIN rounds r ON r.id = hp.round_id
      WHERE hp.id = shots.hole_played_id
        AND (
          r.student_id = auth.uid()
          OR ((get_my_role() = 'coach') AND EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = r.student_id AND p.coach_id = auth.uid()
          ))
        )
    )
  );
