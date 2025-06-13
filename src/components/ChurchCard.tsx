import React, { useState } from "react";

import { ChurchData } from "@/types/church.type";

interface ChurchCardProps {
  church: ChurchData & { _id: string };
  onEdit: (church: ChurchData & { _id: string }) => void;
  onDelete: (churchId: string) => Promise<void>;
}

export default function ChurchCard({
  church,
  onEdit,
  onDelete,
}: ChurchCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking delete
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking confirm
    setIsDeleting(true);
    try {
      await onDelete(church._id);
    } catch (error) {
      console.error("Error deleting church:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (!showDeleteConfirm) {
      onEdit(church);
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* ... rest of the component ... */}
    </div>
  );
}
