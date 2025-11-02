'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CheckSquare, MoreVertical, CheckCircle, XCircle, Send } from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  id: string;
  status: 'pending' | 'approved' | 'published' | 'rejected';
}

interface BatchOperationsProps {
  reviews: Review[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onBatchUpdate: (ids: string[], status: Review['status']) => Promise<void>;
}

export function BatchOperations({
  reviews,
  selectedIds,
  onSelectionChange,
  onBatchUpdate,
}: BatchOperationsProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    status: Review['status'];
    label: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const allSelected = reviews.length > 0 && selectedIds.length === reviews.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < reviews.length;

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(reviews.map((r) => r.id));
    }
  };

  const handleBatchAction = (status: Review['status'], label: string) => {
    if (selectedIds.length === 0) {
      toast.error('Please select reviews first');
      return;
    }

    setPendingAction({ status, label });
    setIsConfirmOpen(true);
  };

  const confirmBatchAction = async () => {
    if (!pendingAction) return;

    setIsProcessing(true);
    try {
      await onBatchUpdate(selectedIds, pendingAction.status);
      toast.success(`${selectedIds.length} reviews ${pendingAction.label.toLowerCase()}`);
      onSelectionChange([]);
    } catch (error) {
      toast.error(`Failed to ${pendingAction.label.toLowerCase()} reviews`);
    } finally {
      setIsProcessing(false);
      setIsConfirmOpen(false);
      setPendingAction(null);
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={allSelected}
            onCheckedChange={handleSelectAll}
            className={someSelected ? 'data-[state=checked]:bg-blue-600' : ''}
          />
          <span className="text-sm font-medium">
            {selectedIds.length > 0
              ? `${selectedIds.length} selected`
              : 'Select all'}
          </span>
        </div>

        {selectedIds.length > 0 && (
          <>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2 flex-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBatchAction('approved', 'Approved')}
                className="gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBatchAction('published', 'Published')}
                className="gap-2"
              >
                <Send className="w-4 h-4" />
                Publish
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBatchAction('rejected', 'Rejected')}
                className="gap-2"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onSelectionChange([])}>
                    Clear Selection
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      const pending = reviews
                        .filter((r) => r.status === 'pending')
                        .map((r) => r.id);
                      onSelectionChange(pending);
                    }}
                  >
                    Select All Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      const approved = reviews
                        .filter((r) => r.status === 'approved')
                        .map((r) => r.id);
                      onSelectionChange(approved);
                    }}
                  >
                    Select All Approved
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}
      </div>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Batch Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {pendingAction?.label.toLowerCase()}{' '}
              {selectedIds.length} review{selectedIds.length !== 1 ? 's' : ''}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBatchAction} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Continue'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
