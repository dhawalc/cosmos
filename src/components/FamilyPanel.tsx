"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Pencil, Trash2, Loader2, Users, Save } from "lucide-react";

interface Profile {
  id: string;
  name: string;
  relationship: string;
  dob: string;
  birth_time: string | null;
  birth_place: string | null;
  birth_time_known: boolean;
  signature: Record<string, unknown> | null;
  life_path: number | null;
  notes: string | null;
}

const RELATIONSHIPS = ["self", "husband", "wife", "son", "daughter", "sister", "brother", "parent", "friend", "other"];

type FormData = {
  name: string;
  relationship: string;
  dob: string;
  birth_time: string;
  birth_place: string;
  notes: string;
};

const emptyForm: FormData = {
  name: "",
  relationship: "other",
  dob: "",
  birth_time: "",
  birth_place: "",
  notes: "",
};

export default function FamilyPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<string | null>(null); // profile id or 'new'
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profiles");
      if (res.ok) setProfiles(await res.json());
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (open) fetchProfiles();
  }, [open, fetchProfiles]);

  const startEdit = (p: Profile) => {
    setEditing(p.id);
    setForm({
      name: p.name,
      relationship: p.relationship,
      dob: p.dob,
      birth_time: p.birth_time || "",
      birth_place: p.birth_place || "",
      notes: p.notes || "",
    });
  };

  const startNew = () => {
    setEditing("new");
    setForm(emptyForm);
  };

  const cancel = () => {
    setEditing(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.name || !form.dob) return;
    setSaving(true);
    try {
      const payload = { ...form, birth_time: form.birth_time || null };
      if (editing === "new") {
        const res = await fetch("/api/profiles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          await fetchProfiles();
          cancel();
        }
      } else {
        const res = await fetch(`/api/profiles/${editing}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          await fetchProfiles();
          cancel();
        }
      }
    } catch { /* ignore */ }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this profile?")) return;
    await fetch(`/api/profiles/${id}`, { method: "DELETE" });
    await fetchProfiles();
  };

  const inputCls =
    "w-full bg-white/[0.04] border border-[var(--color-gold)]/20 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-gold)]/50 text-[var(--color-ivory)] placeholder:text-white/20 transition-colors";
  const dateCls =
    "w-full bg-[var(--color-void)]/80 text-[var(--color-ivory)] border border-[var(--color-gold)]/20 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[var(--color-gold)]/50 [color-scheme:dark] transition-colors";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getSig = (p: Profile) => p.signature as any;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[var(--color-void)]/95 backdrop-blur-xl border-l border-[var(--color-gold)]/15 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 border-b border-[var(--color-gold)]/10">
              <div className="flex items-center gap-3">
                <Users size={18} className="text-[var(--color-gold)] opacity-70" />
                <h3 className="font-serif italic text-xl text-gold-gradient">Family & Profiles</h3>
              </div>
              <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-4">
              {loading && (
                <div className="flex justify-center py-8">
                  <Loader2 size={24} className="animate-spin text-[var(--color-gold)]" />
                </div>
              )}

              {/* Profile list */}
              {!loading && profiles.map((p) =>
                editing === p.id ? (
                  <ProfileForm
                    key={p.id}
                    form={form}
                    setForm={setForm}
                    onSave={handleSave}
                    onCancel={cancel}
                    saving={saving}
                    inputCls={inputCls}
                    dateCls={dateCls}
                  />
                ) : (
                  <motion.div
                    key={p.id}
                    layout
                    className="bg-white/[0.03] border border-[var(--color-gold)]/10 rounded-xl p-4 group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-[var(--color-ivory)]">{p.name}</p>
                        <p className="text-xs text-[var(--color-gold)]/60 capitalize">{p.relationship}</p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEdit(p)} className="text-white/30 hover:text-[var(--color-gold)] transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="text-white/30 hover:text-red-400 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Mini chart summary */}
                    {getSig(p) && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        <ChartChip label="Sun" value={getSig(p).sun?.sign} />
                        <ChartChip label="Moon" value={getSig(p).moon?.sign} />
                        <ChartChip label="Nakshatra" value={getSig(p).nakshatra?.name} />
                        {p.life_path && <ChartChip label="Life Path" value={p.life_path.toString()} />}
                      </div>
                    )}

                    {p.notes && (
                      <p className="text-xs text-white/30 mt-2 italic">{p.notes}</p>
                    )}

                    <p className="text-[10px] text-white/20 mt-2">
                      DOB: {p.dob} · {p.birth_place || "Place unknown"}
                    </p>
                  </motion.div>
                )
              )}

              {/* New profile form */}
              {editing === "new" && (
                <ProfileForm
                  form={form}
                  setForm={setForm}
                  onSave={handleSave}
                  onCancel={cancel}
                  saving={saving}
                  inputCls={inputCls}
                  dateCls={dateCls}
                />
              )}

              {/* Empty state */}
              {!loading && profiles.length === 0 && editing !== "new" && (
                <div className="text-center py-8">
                  <p className="text-white/30 text-sm mb-3">No profiles saved yet</p>
                  <p className="text-white/20 text-xs">Add your family members to get personalized readings for them</p>
                </div>
              )}
            </div>

            {/* Footer — add button */}
            {editing === null && (
              <div className="px-3 sm:px-6 py-4 border-t border-[var(--color-gold)]/10">
                <button
                  onClick={startNew}
                  className="w-full py-3 border border-dashed border-[var(--color-gold)]/30 rounded-xl text-[var(--color-gold)] text-sm tracking-wide hover:bg-[var(--color-gold)]/5 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Add Family Member
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ChartChip({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <span className="text-[10px] px-2 py-1 rounded-full border border-[var(--color-gold)]/15 text-[var(--color-gold)]/70">
      {label}: {value}
    </span>
  );
}

function ProfileForm({
  form, setForm, onSave, onCancel, saving, inputCls, dateCls,
}: {
  form: FormData;
  setForm: (f: FormData) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  inputCls: string;
  dateCls: string;
}) {
  const set = (key: string, val: string) => setForm({ ...form, [key]: val });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.03] border border-[var(--color-gold)]/20 rounded-xl p-4 space-y-3"
    >
      <input
        placeholder="Full name"
        value={form.name}
        onChange={(e) => set("name", e.target.value)}
        className={inputCls}
      />
      <select
        value={form.relationship}
        onChange={(e) => set("relationship", e.target.value)}
        className={`${inputCls} bg-[var(--color-void)]/80`}
      >
        {RELATIONSHIPS.map((r) => (
          <option key={r} value={r} className="bg-[#0a0a14]">
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </option>
        ))}
      </select>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="date"
          value={form.dob}
          onChange={(e) => set("dob", e.target.value)}
          className={dateCls}
        />
        <input
          type="time"
          value={form.birth_time}
          onChange={(e) => set("birth_time", e.target.value)}
          placeholder="Time (optional)"
          className={dateCls}
        />
      </div>
      <input
        placeholder="Birth place (e.g. Surat, India)"
        value={form.birth_place}
        onChange={(e) => set("birth_place", e.target.value)}
        className={inputCls}
      />
      <input
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={(e) => set("notes", e.target.value)}
        className={inputCls}
      />
      <div className="flex gap-2 pt-1">
        <button
          onClick={onSave}
          disabled={saving || !form.name || !form.dob}
          className="flex-1 py-2.5 bg-gradient-to-r from-[var(--color-gold)] to-[var(--color-saffron)] text-[var(--color-void)] font-medium rounded-lg text-sm disabled:opacity-40 flex items-center justify-center gap-2 transition-opacity"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "Computing chart..." : "Save & Compute Chart"}
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2.5 border border-white/10 rounded-lg text-sm text-white/50 hover:text-white/80 transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
}
