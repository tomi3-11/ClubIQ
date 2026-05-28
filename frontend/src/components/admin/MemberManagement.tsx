"use client";

import React, { JSX, useEffect, useState } from "react";
import "../../styles/admin.css";

type Member = {
  id: number;
  name: string;
  email: string;
  club?: string;
  rating?: number | string;
  status?: string;
  join_date?: string;
  role?: string;
};

const API_BASE = (process.env.NEXT_PUBLIC_API_URL as string) || "http://127.0.0.1:5000";
const API_URL = `${API_BASE}/api/members`;

export default function MemberManagement(): JSX.Element {
  const [members, setMembers] = useState<Member[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    club: "",
    rating: "",
    status: "Active",
  });

  const getHeaders = (): HeadersInit => {
    const token = (typeof window !== "undefined" && localStorage.getItem("token")) || "";
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  };

  // Fetch members
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL, {
        method: "GET",
        headers: getHeaders(),
        mode: "cors",
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("fetchMembers failed:", res.status, txt);
        throw new Error(`Failed to fetch members: ${res.status}`);
      }

      const data: Member[] = await res.json();
      setMembers(data);
    } catch (err) {
      console.error("Error in fetchMembers:", err);
      // optional: show user friendly UI message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Open modal for add/edit
  const openModal = (member: Member | null = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name || "",
        email: member.email || "",
        club: member.club || "",
        rating: String(member.rating ?? ""),
        status: member.status || "Active",
      });
    } else {
      setEditingMember(null);
      setFormData({ name: "", email: "", club: "", rating: "", status: "Active" });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMember(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  // Save member (POST or PUT)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingMember ? "PUT" : "POST";
    const url = editingMember ? `${API_URL}/${editingMember.id}` : API_URL;

    // Debug: print request info to console to help identify errors
    console.log("Saving member", { method, url, body: formData });

    try {
      setLoading(true);

      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        mode: "cors",
        // include credentials if backend requires cookies:
        // credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          // backend expects 'role' — if your API expects different keys, adapt here
          role: (formData as any).role || "member",
          club: formData.club,
          rating: formData.rating ? Number(formData.rating) : undefined,
          status: formData.status,
        }),
      });

      // If response is not OK, capture body (helps when backend returns html or text)
      if (!res.ok) {
        const txt = await res.text();
        console.error("Save failed:", res.status, txt);
        throw new Error(`Save failed: ${res.status} ${txt}`);
      }

      // success: refresh list and close modal
      await fetchMembers();
      closeModal();
    } catch (err) {
      console.error("Error in handleSave:", err);
      alert("There was an error saving the member. See console/network for details.");
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
        mode: "cors",
      });
      if (!res.ok) {
        const txt = await res.text();
        console.error("Delete failed:", res.status, txt);
        throw new Error(`Delete failed: ${res.status}`);
      }
      await fetchMembers();
    } catch (err) {
      console.error("Error in handleDelete:", err);
      alert("There was an error deleting the member. Check console/network.");
    }
  };

  return (
    <div className="admin-section">
      <div className="section-header">
        <h2>Member Management</h2>
        <button className="btn btn-primary" onClick={() => openModal(null)}>
          + Add Member
        </button>
      </div>

      <div className="table-container">
        {loading ? (
          <p>Loading members...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Club</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.length ? (
                members.map((m) => (
                  <tr key={m.id}>
                    <td>{m.name}</td>
                    <td>{m.email}</td>
                    <td>{m.club}</td>
                    <td>⭐ {m.rating}</td>
                    <td>
                      <span className="status-badge">{m.status}</span>
                    </td>
                    <td>
                      <button className="action-btn" onClick={() => openModal(m)}>
                        Edit
                      </button>
                      <button className="action-btn delete" onClick={() => handleDelete(m.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingMember ? "Edit Member" : "Add New Member"}</h3>
            <form onSubmit={handleSave}>
              <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required />
              <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
              <input name="club" value={formData.club} onChange={handleChange} placeholder="Club" />
              <input name="rating" value={formData.rating} onChange={handleChange} placeholder="Rating" />
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
