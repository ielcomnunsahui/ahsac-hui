import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { ImageUpload } from "./ImageUpload";

interface FoundingMemberFormProps {
  initialData?: {
    name: string;
    role: string;
    bio: string;
    image_url: string;
  };
  onSubmit: (data: { name: string; role: string; bio: string; image_url: string }) => void;
  onCancel: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function FoundingMemberForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Add Member"
}: FoundingMemberFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [role, setRole] = useState(initialData?.role || "");
  const [bio, setBio] = useState(initialData?.bio || "");
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, role, bio, image_url: imageUrl });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter member name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">Role *</Label>
        <Input
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="e.g., President, Vice President"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Short biography..."
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <ImageUpload
          currentUrl={imageUrl}
          onUpload={setImageUrl}
          label="Profile Image"
          folder="founding-members"
        />
      </div>
      
      <DialogFooter className="pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !name || !role}>
          {isLoading ? "Saving..." : submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}
