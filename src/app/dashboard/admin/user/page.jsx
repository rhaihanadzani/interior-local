// app/admin/users/page.jsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserCard } from "./user-card";
import { Search, ChevronLeft, ChevronRight, User } from "lucide-react";
import { getUsers } from "@/lib/services/userService";
import DashboardLoading from "@/components/Loader/DashboardLoading";
import { toast } from "sonner";

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 4;

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Function to update user role
  const handleUpdateRole = async (userId, newRole) => {
    const toastId = toast.loading("Mohon Tunggu...");
    try {
      // Call your API endpoint to update role
      const response = await fetch(`/api/dashboard/user/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      // Update local state if API call succeeds
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      toast.success("Role updated successfully", { id: toastId });
    } catch (error) {
      console.error("Error updating role:", error);

      toast.error("Failed to update role", { id: toastId });
      setError(error.message);
    }
  };

  // Function to delete user
  const handleDeleteUser = async (userId) => {
    const toastId = toast.loading("Mohon Tunggu...");
    try {
      // Call your API endpoint to delete user
      const response = await fetch(`/api/dashboard/user/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Update local state if API call succeeds
      setUsers(users.filter((user) => user.id !== userId));

      toast.success("User deleted successfully", { id: toastId });
    } catch (error) {
      console.error("Error deleting userr:", error);
      setError(error.message);

      toast.error("Failed to delete user", { id: toastId });
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
  );

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <DashboardLoading />;
  }

  if (error) {
    return (
      <div className="container py-8 text-center text-destructive">
        <p>Error loading users: {error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn container py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manajemen User</h1>
          <p className="text-muted-foreground">
            Kelola semua user dan peran mereka di sistem
          </p>
        </div>

        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari user..."
            className="pl-10 w-full md:w-[300px]"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
          />
        </div>
      </div>

      {currentUsers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onUpdateRole={handleUpdateRole}
              onDelete={handleDeleteUser}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
          <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
            <User className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-medium">Tidak ada user ditemukan</h3>
          <p className="text-muted-foreground">
            {searchTerm
              ? "Coba gunakan kata kunci pencarian yang berbeda"
              : "Belum ada user yang terdaftar"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {filteredUsers.length > usersPerPage && (
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <Button
                  key={number}
                  variant={currentPage === number ? "default" : "outline"}
                  size="sm"
                  onClick={() => paginate(number)}
                  className="w-10 h-10 p-0"
                >
                  {number}
                </Button>
              )
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
