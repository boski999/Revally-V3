'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users, MessageSquare, Send, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Comment {
  id: string;
  userName: string;
  userInitials: string;
  comment: string;
  type: 'feedback' | 'approval_request' | 'revision' | 'general';
  createdAt: Date;
}

interface TeamCollaborationProps {
  postId: string;
  comments: Comment[];
  onAddComment: (comment: string, type: Comment['type']) => void;
  onRequestApproval: () => void;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}

export function TeamCollaboration({
  postId,
  comments,
  onAddComment,
  onRequestApproval,
  approvalStatus,
}: TeamCollaborationProps) {
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState<Comment['type']>('general');

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    onAddComment(newComment, commentType);
    setNewComment('');
    toast.success('Comment added!');
  };

  const getTypeColor = (type: Comment['type']) => {
    switch (type) {
      case 'feedback': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'approval_request': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
      case 'revision': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getApprovalStatusBadge = () => {
    switch (approvalStatus) {
      case 'approved':
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-500 text-white">
            <Clock className="w-3 h-3 mr-1" />
            Pending Approval
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            Needs Revision
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="border-2 border-blue-200/50 dark:border-blue-800/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Collaboration
          </CardTitle>
          {getApprovalStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Approval Action */}
        {approvalStatus !== 'pending' && approvalStatus !== 'approved' && (
          <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1">Request Approval</h4>
                <p className="text-xs text-muted-foreground">
                  Submit this post for team review before publishing
                </p>
              </div>
              <Button
                size="sm"
                onClick={onRequestApproval}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                Request Review
              </Button>
            </div>
          </div>
        )}

        {/* Comments Thread */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Comments ({comments.length})
          </h4>

          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {comments.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No comments yet</p>
                <p className="text-xs">Be the first to leave feedback</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {comment.userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{comment.userName}</span>
                      <Badge variant="outline" className={`text-xs ${getTypeColor(comment.type)}`}>
                        {comment.type.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(comment.createdAt, 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.comment}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Comment Form */}
        <div className="space-y-3 pt-3 border-t">
          <div className="flex gap-2 flex-wrap">
            {(['general', 'feedback', 'revision', 'approval_request'] as const).map((type) => (
              <Button
                key={type}
                variant={commentType === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCommentType(type)}
                className="text-xs capitalize"
              >
                {type.replace('_', ' ')}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <Button
              onClick={handleAddComment}
              className="w-full"
              disabled={!newComment.trim()}
            >
              <Send className="w-4 h-4 mr-2" />
              Add Comment
            </Button>
          </div>
        </div>

        {/* Activity Log Preview */}
        <div className="pt-3 border-t">
          <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
              <span>Post created • Just now</span>
            </div>
            {comments.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span>Latest comment by {comments[comments.length - 1].userName} • {format(comments[comments.length - 1].createdAt, 'h:mm a')}</span>
              </div>
            )}
            {approvalStatus === 'pending' && (
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                <span>Approval requested • Pending review</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
