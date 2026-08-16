"use client";

import { Check, UserPlus } from "lucide-react";
import { useState } from "react";

export function FollowButton({ compact = false }: { compact?: boolean }) {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <button
      className={`follow-button ${isFollowing ? "is-following" : ""}`}
      onClick={() => setIsFollowing((current) => !current)}
      type="button"
    >
      {isFollowing ? <Check size={17} /> : <UserPlus size={17} />}
      {compact ? null : <span>{isFollowing ? "Đang theo dõi" : "Theo dõi"}</span>}
    </button>
  );
}
