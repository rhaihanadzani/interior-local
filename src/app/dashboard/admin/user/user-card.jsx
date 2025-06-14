"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, User, UserCog, Trash2, Check } from "lucide-react";
import { useState } from "react";

const roleColors = {
  superAdmin: "bg-purple-100 text-purple-800",
  admin: "bg-blue-100 text-blue-800",
  user: "bg-green-100 text-green-800",
};

const roleLabels = {
  superAdmin: "Super Admin",
  admin: "Admin",
  user: "User",
};

export function UserCard({ user, onUpdateRole, onDelete }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRoleChange = async (newRole) => {
    setIsUpdating(true);
    try {
      await onUpdateRole(user.id, newRole);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(user.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative group hover:shadow-lg transition-all duration-300 rounded-lg border p-6 bg-card hover:bg-card/90">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={user.profileImage?.url} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1">
            <h3 className="text-lg font-medium">{user.name}</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground">{user.phone}</p>
            <Badge className={`${roleColors[user.role]} capitalize`}>
              {roleLabels[user.role]}
            </Badge>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleRoleChange("superAdmin")}
              disabled={user.role === "superAdmin" || isUpdating}
            >
              <UserCog className="mr-2 h-4 w-4" />
              Jadikan Super Admin
              {user.role === "superAdmin" && (
                <Check className="ml-auto h-4 w-4" />
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleRoleChange("admin")}
              disabled={user.role === "admin" || isUpdating}
            >
              <UserCog className="mr-2 h-4 w-4" />
              Jadikan Admin
              {user.role === "admin" && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleRoleChange("user")}
              disabled={user.role === "user" || isUpdating}
            >
              <User className="mr-2 h-4 w-4" />
              Jadikan User
              {user.role === "user" && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Floating elements for visual effect */}
      <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary/20 animate-twinkle delay-100" />
      <div className="absolute -bottom-2 -left-2 w-3 h-3 rounded-full bg-secondary/30 animate-twinkle delay-200" />
    </div>
  );
}
