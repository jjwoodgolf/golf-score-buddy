
DROP POLICY IF EXISTS course_holes_insert ON public.course_holes;
DROP POLICY IF EXISTS course_holes_update ON public.course_holes;
DROP POLICY IF EXISTS course_holes_delete ON public.course_holes;

CREATE POLICY course_holes_insert ON public.course_holes
FOR INSERT
WITH CHECK (
  public.get_my_role() = 'coach'
  AND EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = course_holes.course_id AND c.created_by = auth.uid()
  )
);

CREATE POLICY course_holes_update ON public.course_holes
FOR UPDATE
USING (
  public.get_my_role() = 'coach'
  AND EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = course_holes.course_id AND c.created_by = auth.uid()
  )
)
WITH CHECK (
  public.get_my_role() = 'coach'
  AND EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = course_holes.course_id AND c.created_by = auth.uid()
  )
);

CREATE POLICY course_holes_delete ON public.course_holes
FOR DELETE
USING (
  public.get_my_role() = 'coach'
  AND EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = course_holes.course_id AND c.created_by = auth.uid()
  )
);
