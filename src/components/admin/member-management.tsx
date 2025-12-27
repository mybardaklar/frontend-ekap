"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { User, CreditCard, Mail, Phone, Calendar, Trash2, UserX } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: 'admin' | 'user';
  created_at: string;
  credits: number;
}

interface MemberManagementProps {
  users: UserData[];
  refreshUsers: () => void;
  loading: boolean;
}

export function MemberManagement({ users, refreshUsers, loading }: MemberManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    phone: ''
  });

  const supabase = createClient();

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleEditUser = (user: UserData) => {
    setEditingUser(user.id);
    setEditForm({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.phone || ''
    });
  };

  const handleUpdateUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          phone: editForm.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast.success("Üye bilgileri güncellendi.");

      setEditingUser(null);
      refreshUsers();
    } catch (error: any) {
      console.error('User update error:', error);
      toast.error("Üye güncellenirken bir hata oluştu.");
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      // Note: This relies on a Supabase Edge Function which might need configuration
      const res = await fetch(
        'https://kodwclnacadhnnmfpvmi.functions.supabase.co/admin-delete-user',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
          },
          body: JSON.stringify({ user_id: userId, email }),
        }
      );

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `Silme başarısız (status: ${res.status})`);
      }

      toast.success("Üye başarıyla silindi.");

      refreshUsers();
    } catch (error: any) {
      console.error('User deletion error:', error);
      toast.error("Üye silinirken bir hata oluştu.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Üye ara (email, ad, soyad)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Üye Listesi ({filteredUsers.length})</CardTitle>
          <p className="text-sm text-muted-foreground">
            Tek seferlik kredi satın alan, aboneliği olmayan kullanıcılar
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="border rounded-lg p-4">
                {editingUser === user.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Ad</Label>
                        <Input
                          value={editForm.first_name}
                          onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label>Soyad</Label>
                        <Input
                          value={editForm.last_name}
                          onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Telefon</Label>
                      <Input
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleUpdateUser(user.id)}>
                        Kaydet
                      </Button>
                      <Button variant="outline" onClick={() => setEditingUser(null)}>
                        İptal
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{user.first_name || 'Ad belirtilmemiş'} {user.last_name || 'Soyad belirtilmemiş'}</h3>
                        <Badge variant="secondary">Üye</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {user.phone || 'Belirtilmemiş'}
                        </div>
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-3 w-3" />
                          <span className="text-green-600 font-medium">{user.credits} kredi</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(user.created_at).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditUser(user)}
                      >
                        Düzenle
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Üyeyi Sil</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bu işlem geri alınamaz. Üyenin tüm verileri silinecektir.
                              <br />
                              <strong>{user.first_name} {user.last_name} ({user.email})</strong>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.id, user.email)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Sil
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <UserX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Kriterlere uygun üye bulunamadı.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
