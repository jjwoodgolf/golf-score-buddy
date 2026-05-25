import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CoachNav } from "@/components/CoachNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authed/coach/courses")({
  head: () => ({ meta: [{ title: "Course Manager — FairwayIQ" }] }),
  component: CoursesPage,
});

type Course = {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  total_par: number | null;
  total_yards: number | null;
};

type HoleRow = { hole_number: number; par: number; yardage: string; handicap_index: string };

function emptyHoles(): HoleRow[] {
  return Array.from({ length: 18 }, (_, i) => ({
    hole_number: i + 1, par: 4, yardage: "", handicap_index: "",
  }));
}

function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [holes, setHoles] = useState<HoleRow[]>(emptyHoles());
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; holes?: string }>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadCourses = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data, error } = await supabase
      .from("courses")
      .select("id,name,city,state,total_par,total_yards")
      .eq("created_by", user.id)
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setCourses(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { loadCourses(); }, [loadCourses]);

  const openNew = () => {
    setEditingId(null);
    setName(""); setCity(""); setState("");
    setHoles(emptyHoles());
    setErrors({});
    setOpen(true);
  };

  const openEdit = async (c: Course) => {
    setEditingId(c.id);
    setName(c.name); setCity(c.city ?? ""); setState(c.state ?? "");
    setErrors({});
    const { data, error } = await supabase
      .from("course_holes")
      .select("hole_number,par,yardage,handicap_index")
      .eq("course_id", c.id)
      .order("hole_number");
    if (error) { toast.error(error.message); return; }
    const base = emptyHoles();
    (data ?? []).forEach((h) => {
      const idx = h.hole_number - 1;
      if (idx >= 0 && idx < 18) {
        base[idx] = {
          hole_number: h.hole_number,
          par: h.par,
          yardage: String(h.yardage ?? ""),
          handicap_index: h.handicap_index != null ? String(h.handicap_index) : "",
        };
      }
    });
    setHoles(base);
    setOpen(true);
  };

  const updateHole = (i: number, patch: Partial<HoleRow>) => {
    setHoles((prev) => prev.map((h, idx) => (idx === i ? { ...h, ...patch } : h)));
  };

  const save = async () => {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = "Course name is required";
    if (holes.some((h) => h.yardage === "" || isNaN(Number(h.yardage)))) {
      errs.holes = "All 18 holes must have a yardage";
    }
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const total_par = holes.reduce((s, h) => s + Number(h.par || 0), 0);
      const total_yards = holes.reduce((s, h) => s + Number(h.yardage || 0), 0);

      let courseId = editingId;
      if (editingId) {
        const { error } = await supabase.from("courses")
          .update({ name: name.trim(), city: city.trim() || null, state: state.trim() || null, total_par, total_yards })
          .eq("id", editingId);
        if (error) throw error;
        const { error: delErr } = await supabase.from("course_holes").delete().eq("course_id", editingId);
        if (delErr) throw delErr;
      } else {
        const { data, error } = await supabase.from("courses")
          .insert({ name: name.trim(), city: city.trim() || null, state: state.trim() || null, created_by: user.id })
          .select("id").single();
        if (error) throw error;
        courseId = data.id;
      }

      const rows = holes.map((h) => ({
        course_id: courseId!,
        hole_number: h.hole_number,
        par: Number(h.par),
        yardage: Number(h.yardage),
        handicap_index: h.handicap_index === "" ? null : Number(h.handicap_index),
      }));
      const { error: insErr } = await supabase.from("course_holes").insert(rows);
      if (insErr) throw insErr;

      if (!editingId) {
        await supabase.from("courses").update({ total_par, total_yards }).eq("id", courseId!);
      }

      toast.success(editingId ? "Course updated" : "Course created");
      setOpen(false);
      loadCourses();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("courses").delete().eq("id", deleteId);
    if (error) toast.error(error.message);
    else toast.success("Course deleted");
    setDeleteId(null);
    loadCourses();
  };

  return (
    <div className="min-h-screen bg-background">
      <CoachNav />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Course Manager</h1>
          <Button onClick={openNew}><Plus /> Add New Course</Button>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : courses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No courses yet. Add your first course to get started.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <Card key={c.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{c.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {[c.city, c.state].filter(Boolean).join(", ") || "—"}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-4 text-sm">
                    <div><span className="text-muted-foreground">Par </span><span className="font-medium">{c.total_par ?? "—"}</span></div>
                    <div><span className="text-muted-foreground">Yards </span><span className="font-medium">{c.total_yards ?? "—"}</span></div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(c)}><Pencil /> Edit</Button>
                    <Button variant="outline" size="sm" onClick={() => setDeleteId(c.id)}><Trash2 /> Delete</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingId ? "Edit Course" : "Add New Course"}</SheetTitle>
          </SheetHeader>

          <div className="space-y-4 mt-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Course Name *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" value={state} onChange={(e) => setState(e.target.value)} />
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Holes</h3>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-14">Hole</TableHead>
                      <TableHead className="w-24">Par</TableHead>
                      <TableHead>Yardage *</TableHead>
                      <TableHead>Stroke Index</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {holes.map((h, i) => (
                      <TableRow key={h.hole_number}>
                        <TableCell className="font-medium">{h.hole_number}</TableCell>
                        <TableCell>
                          <Select value={String(h.par)} onValueChange={(v) => updateHole(i, { par: Number(v) })}>
                            <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input type="number" className="h-8" value={h.yardage}
                            onChange={(e) => updateHole(i, { yardage: e.target.value })} />
                        </TableCell>
                        <TableCell>
                          <Input type="number" min={1} max={18} className="h-8" value={h.handicap_index}
                            onChange={(e) => updateHole(i, { handicap_index: e.target.value })} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {errors.holes && <p className="text-sm text-destructive mt-2">{errors.holes}</p>}
            </div>
          </div>

          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Course"}</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this course?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the course and all its holes. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
