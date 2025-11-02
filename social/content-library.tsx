'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Library, Search, Plus, Hash, FileText, Image as ImageIcon, Star, Trash2, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface LibraryItem {
  id: string;
  type: 'caption' | 'hashtag_set' | 'image';
  name: string;
  content: string;
  tags: string[];
  usageCount: number;
  isFavorite?: boolean;
}

interface ContentLibraryProps {
  items: LibraryItem[];
  onUseItem: (item: LibraryItem) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: (item: Omit<LibraryItem, 'id' | 'usageCount'>) => void;
}

export function ContentLibrary({ items, onUseItem, onDeleteItem, onAddItem }: ContentLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'caption' | 'hashtag_set' | 'image'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemContent, setNewItemContent] = useState('');
  const [newItemTags, setNewItemTags] = useState('');

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === 'all' || item.type === selectedType;

    return matchesSearch && matchesType;
  });

  const handleAddItem = () => {
    if (!newItemName || !newItemContent) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newItem: Omit<LibraryItem, 'id' | 'usageCount'> = {
      type: selectedType === 'all' ? 'caption' : selectedType,
      name: newItemName,
      content: newItemContent,
      tags: newItemTags.split(',').map(t => t.trim()).filter(Boolean),
    };

    onAddItem(newItem);
    setNewItemName('');
    setNewItemContent('');
    setNewItemTags('');
    setShowAddForm(false);
    toast.success('Item added to library!');
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard!');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'caption': return <FileText className="w-4 h-4" />;
      case 'hashtag_set': return <Hash className="w-4 h-4" />;
      case 'image': return <ImageIcon className="w-4 h-4" />;
      default: return <Library className="w-4 h-4" />;
    }
  };

  return (
    <Card className="border-2 border-green-200/50 dark:border-green-800/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Library className="w-5 h-5" />
            Content Library
          </CardTitle>
          <Button
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add to Library
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Item Form */}
        {showAddForm && (
          <Card className="border-2 border-dashed">
            <CardContent className="p-4 space-y-3">
              <Input
                placeholder="Item name..."
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
              />
              <Input
                placeholder="Content..."
                value={newItemContent}
                onChange={(e) => setNewItemContent(e.target.value)}
              />
              <Input
                placeholder="Tags (comma-separated)..."
                value={newItemTags}
                onChange={(e) => setNewItemTags(e.target.value)}
              />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleAddItem} className="flex-1">
                  Add Item
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Tabs value={selectedType} onValueChange={(v) => setSelectedType(v as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="caption">Captions</TabsTrigger>
            <TabsTrigger value="hashtag_set">Hashtags</TabsTrigger>
            <TabsTrigger value="image">Images</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedType} className="space-y-3 mt-4">
            {filteredItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Library className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No items found</p>
                <p className="text-xs">Add items to your library for quick access</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <Card key={item.id} className="border">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getTypeIcon(item.type)}
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            {item.isFavorite && (
                              <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.content}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {item.usageCount} uses
                        </Badge>
                      </div>

                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onUseItem(item)}
                          className="flex-1"
                        >
                          Use This
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(item.content)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            onDeleteItem(item.id);
                            toast.success('Item removed from library');
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Access Favorites */}
        {items.filter(i => i.isFavorite).length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              Favorites
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {items.filter(i => i.isFavorite).slice(0, 4).map((item) => (
                <Button
                  key={item.id}
                  variant="outline"
                  size="sm"
                  onClick={() => onUseItem(item)}
                  className="justify-start truncate"
                >
                  {getTypeIcon(item.type)}
                  <span className="ml-2 truncate">{item.name}</span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
