import React, { useEffect, useState } from "react";
import { getCollections, createCollection } from "../utils/apiClient";

export default function CollectionsPanel() {
  const [collections, setCollections] = useState([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [items, setItems] = useState([]);

  async function load() {
    try {
      const data = await getCollections();
      setCollections(data);
    } catch (err) {
      console.error("Collections load error:", err);
    }
  }

  async function addCollection() {
    if (!newName.trim()) return alert("Enter a name!");

    setLoading(true);
    try {
      const created = await createCollection(newName.trim());
      setCollections((prev) => [...prev, created]);
      setNewName("");
    } catch (e) {
      console.error("Create collection error:", e);
      alert("Failed to create collection.");
    }
    setLoading(false);
  }

  // Load items in a collection
  async function loadItems(col) {
    setSelected(col.id);

    try {
      const res = await fetch(
        `http://localhost:5000/collections/${col.id}/items`
      );
      const data = await res.json();
      setItems(data.items || []);
    } catch (err) {
      console.error("Failed to load items:", err);
      setItems([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md border dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-3">Collections</h3>

      {/* Input + Add Button */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Collection name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-900 dark:text-white"
        />

        <button
          onClick={addCollection}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
        >
          {loading ? "Adding..." : "+ Add"}
        </button>
      </div>

      {/* Collections List */}
      <ul className="space-y-2">
        {collections.map((col) => (
          <li
            key={col.id}
            onClick={() => loadItems(col)}
            className={`bg-gray-100 dark:bg-gray-700 p-2 rounded-lg flex items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 ${
              selected === col.id ? "border border-blue-500" : ""
            }`}
          >
            📁 <span className="ml-2">{col.name}</span>
          </li>
        ))}
      </ul>

      {/* Items Panel */}
      {selected && (
        <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border dark:border-gray-700">
          <h4 className="font-semibold mb-2">
            Items in Collection #{selected}
          </h4>

          {items.length === 0 ? (
            <p className="text-gray-500">No items yet.</p>
          ) : (
            <ul className="list-disc ml-4">
              {items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
