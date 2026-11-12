import { useMemo, useState } from "react";
import { objectiveGroups } from "../data/objectives";

const TONES = {
  blue: { rule: "border-l-blue-500", icon: "bg-blue-100", dot: "bg-blue-500" },
  amber: { rule: "border-l-amber-500", icon: "bg-amber-100", dot: "bg-amber-500" },
  rose: { rule: "border-l-rose-500", icon: "bg-rose-100", dot: "bg-rose-500" },
  indigo: { rule: "border-l-indigo-500", icon: "bg-indigo-100", dot: "bg-indigo-500" },
  emerald: { rule: "border-l-emerald-500", icon: "bg-emerald-100", dot: "bg-emerald-500" },
  violet: { rule: "border-l-violet-500", icon: "bg-violet-100", dot: "bg-violet-500" },
};

function Chevron({ open }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 8l5 5 5-5" />
    </svg>
  );
}

export default function ObjectivesSection() {
  const [query, setQuery] = useState("");
  const [openIds, setOpenIds] = useState(() => new Set([objectiveGroups[0].id]));

  const q = query.trim().toLowerCase();
  const total = useMemo(
    () => objectiveGroups.reduce((n, g) => n + g.items.length, 0),
    []
  );

  const visible = useMemo(
    () =>
      objectiveGroups
        .map((g) => ({
          ...g,
          shown: q ? g.items.filter((t) => t.toLowerCase().includes(q)) : g.items,
        }))
        .filter((g) => g.shown.length > 0),
    [q]
  );
  const matchCount = visible.reduce((n, g) => n + g.shown.length, 0);

  const toggle = (id) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const everyOpen = objectiveGroups.every((g) => openIds.has(g.id));
  const toggleAll = () =>
    setOpenIds(everyOpen ? new Set() : new Set(objectiveGroups.map((g) => g.id)));

  return (
    <section
      aria-labelledby="objectives-title"
      className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <div>
          <h2
            id="objectives-title"
            className="font-serif text-2xl font-bold text-navy"
          >
            Objectives
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {total} objectives in {objectiveGroups.length} topics. Tap a topic to read it.
          </p>
        </div>
        {!q && (
          <button
            type="button"
            onClick={toggleAll}
            className="rounded-lg px-2 py-1 text-sm font-semibold text-brand hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            {everyOpen ? "Close all" : "Open all"}
          </button>
        )}
      </div>

      <div className="mt-4">
        <label htmlFor="objective-search" className="sr-only">
          Search objectives
        </label>
        <input
          id="objective-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search, for example: women, health, water"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-base text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />
        {q && (
          <p className="mt-2 text-sm text-slate-500" role="status">
            {matchCount === 0
              ? "No objective matches your search. Try a shorter word."
              : `${matchCount} of ${total} objectives match.`}
          </p>
        )}
      </div>

      <ul className="mt-4 space-y-3">
        {visible.map((g) => {
          const tone = TONES[g.tone] ?? TONES.blue;
          const isOpen = q ? true : openIds.has(g.id);
          return (
            <li
              key={g.id}
              className={`overflow-hidden rounded-xl border border-l-4 border-slate-200 ${tone.rule}`}
            >
              <h3>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`${g.id}-panel`}
                  onClick={() => toggle(g.id)}
                  disabled={Boolean(q)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl ${tone.icon}`}
                    aria-hidden="true"
                  >
                    {g.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-serif text-lg font-bold leading-snug text-navy">
                      {g.title}
                    </span>
                    <span className="block text-sm text-slate-500">{g.summary}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-600">
                    {g.shown.length}
                  </span>
                  {!q && <Chevron open={isOpen} />}
                </button>
              </h3>

              {isOpen && (
                <ul
                  id={`${g.id}-panel`}
                  className="space-y-3 border-t border-slate-100 px-4 py-4 sm:px-5"
                >
                  {g.shown.map((text) => (
                    <li
                      key={text}
                      className="flex gap-3 text-base leading-relaxed text-slate-700"
                    >
                      <span
                        className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${tone.dot}`}
                        aria-hidden="true"
                      />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
