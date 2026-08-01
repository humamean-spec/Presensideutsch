import { useState } from "react";

/**
 * Shared list-editing boilerplate for the app's simple entity CRUD screens
 * (Schedule, Classes, Students).
 *
 * Audit finding M1: these three views each hand-rolled the same shape —
 * "modal open/edit state" + "confirm delete state" + "confirm archive
 * state" + a save handler that does find-index / replace-or-push, plus a
 * delete handler that filters the array. This hook centralizes that
 * duplicated mechanics while leaving each view free to:
 *  - render its own form component (the fields genuinely differ per entity)
 *  - control its own toast wording (existing wording is preserved exactly
 *    at each call site, not standardized, so no user-visible text changes)
 *  - run its own logActivity side effect via the `onSave` callback
 *
 * This does not change persistence behavior — it still calls the same
 * `mutate(draft => { ... })` pattern used everywhere else in the app.
 */
export function useEntityCrud({ mutate, arrayKey }) {
  const [modal, setModal] = useState(null); // { mode: 'add' | 'edit', item? }
  const [confirmDelete, setConfirmDelete] = useState(null); // id | null
  const [confirmArchive, setConfirmArchive] = useState(null); // entity | null

  /**
   * Save (create or update) an entity in db[arrayKey].
   * `onSaved(draft, entity, isUpdate)` runs inside the same mutate() call,
   * so callers can add a logActivity entry with entity-specific wording.
   */
  function save(entity, onSaved) {
    mutate((d) => {
      const arr = d[arrayKey];
      const idx = arr.findIndex((x) => x.id === entity.id);
      if (idx >= 0) arr[idx] = entity;
      else arr.push(entity);
      if (onSaved) onSaved(d, entity, idx >= 0);
    });
    setModal(null);
  }

  function remove(id) {
    mutate((d) => {
      d[arrayKey] = d[arrayKey].filter((x) => x.id !== id);
    });
    setConfirmDelete(null);
  }

  /** Toggles `.archived` on the entity currently held in confirmArchive. */
  function toggleArchive(entity) {
    mutate((d) => {
      const item = d[arrayKey].find((x) => x.id === entity.id);
      item.archived = !item.archived;
    });
    setConfirmArchive(null);
  }

  return {
    modal, setModal,
    confirmDelete, setConfirmDelete,
    confirmArchive, setConfirmArchive,
    save, remove, toggleArchive,
  };
}

export default useEntityCrud;
