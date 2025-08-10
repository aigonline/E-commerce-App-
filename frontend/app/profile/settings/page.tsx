"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/app/context/authProvider";
import { getProfileStats } from "@/app/actions/profile";
import { apiFetch } from "@/app/lib/api";

export default function SettingsPage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState({
    username: "",
    full_name: "",
    email: "",
    bio: "",
    avatar_url: "",
  });
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  // Fetch real profile data on mount
  useEffect(() => {
    async function fetchProfile() {
      const data = await getProfileStats(token);
      setProfile({
        username: data.username || "",
        full_name: data.full_name || "",
        email: data.email || "",
        bio: data.bio || "",
        avatar_url: data.avatar_url || "",
      });
      setAvatarPreview(data.avatar_url || "/placeholder-user.jpg");
    }
    if (token) fetchProfile();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let avatarUrl = profile.avatar_url;
      // Upload avatar if changed
      if (avatarFile) {
        const formData = new FormData();
        formData.append("avatar", avatarFile);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/avatar`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        const data = await res.json();
        if (res.ok && data.avatar_url) {
          avatarUrl = data.avatar_url;
        }
      }

      // Update profile
      await apiFetch("/users/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: profile.username,
          full_name: profile.full_name,
          bio: profile.bio,
          avatar_url: avatarUrl,
        }),
      });

      // Optionally, refetch profile
      setProfile((prev) => ({ ...prev, avatar_url: avatarUrl }));
    } catch (error) {
      alert("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-rose-600">Account Settings</h1>
      <Card className="p-8 shadow-lg">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar src={avatarPreview} alt="User avatar" className="w-20 h-20" />
            <div>
              <Label htmlFor="avatar" className="block mb-2 font-medium">Profile Photo</Label>
              <Input type="file" id="avatar" name="avatar" accept="image/*" onChange={handleAvatarChange} />
            </div>
          </div>
          <div>
            <Label htmlFor="username" className="block mb-2 font-medium">Username</Label>
            <Input
              id="username"
              name="username"
              value={profile.username}
              onChange={handleChange}
              className="w-full"
              required
            />
          </div>
          <div>
            <Label htmlFor="full_name" className="block mb-2 font-medium">Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              value={profile.full_name}
              onChange={handleChange}
              className="w-full"
              required
            />
          </div>
          <div>
            <Label htmlFor="email" className="block mb-2 font-medium">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={profile.email}
              className="w-full"
              required
              disabled
            />
          </div>
          <div>
            <Label htmlFor="bio" className="block mb-2 font-medium">Bio</Label>
            <Input
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
              className="w-full"
              placeholder="Tell us about yourself..."
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Card>
    </div>
  );
}