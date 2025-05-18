
import { ListX, FolderOpen, FileX } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
  description?: string;
}

export function EmptyState({ message, icon, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-card">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        {icon || <ListX className="h-8 w-8 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-medium mb-2">{message}</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        {description || "Create new items using the buttons above"}
      </p>
      
      <div className="mt-8 flex gap-2 opacity-10">
        <FileX className="h-6 w-6" />
        <ListX className="h-6 w-6" />
        <FolderOpen className="h-6 w-6" />
      </div>
    </div>
  );
}
