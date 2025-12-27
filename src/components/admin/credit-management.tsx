"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Gift, History, TrendingUp } from "lucide-react";
import { useAdminCreditManager } from '@/hooks/use-admin-credit-manager';
import { CreditGiftForm } from './credit-gift-form';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  credits: number;
  role: string;
  created_at: string;
}

interface CreditManagementProps {
  users: User[];
  refreshUsers: () => void;
}

export function CreditManagement({ users, refreshUsers }: CreditManagementProps) {
  const {
    loading,
    creditGifts,
    adminActions,
    giftCreditsToUser,
    updateUserCredits,
    fetchCreditGifts,
    fetchAdminActions
  } = useAdminCreditManager();

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newBalance, setNewBalance] = useState('');

  useEffect(() => {
    fetchCreditGifts();
    fetchAdminActions();
  }, []);

  const handleUpdateBalance = async (userId: string) => {
    if (!newBalance) return;

    const success = await updateUserCredits(userId, parseInt(newBalance), 'Manuel bakiye güncelleme');
    if (success) {
      setEditingUserId(null);
      setNewBalance('');
      refreshUsers();
      fetchAdminActions();
    }
  };

  const handleGiftCredits = async (
    userId: string,
    amount: number,
    reason: string,
    message?: string,
    sendEmail: boolean = true
  ) => {
    const success = await giftCreditsToUser(userId, amount, reason, message, sendEmail);
    if (success) {
      refreshUsers();
      fetchCreditGifts();
      fetchAdminActions();
    }
    return success;
  };

  const totalCreditsGifted = creditGifts.reduce((sum, gift) => sum + gift.credits_amount, 0);
  const totalUsers = users.length;
  const totalActiveCredits = users.reduce((sum, user) => sum + user.credits, 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Toplam Kullanıcı</p>
                <p className="text-2xl font-bold">{totalUsers}</p>
              </div>
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Aktif Kredi</p>
                <p className="text-2xl font-bold text-green-600">{totalActiveCredits}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hediye Edilen</p>
                <p className="text-2xl font-bold text-blue-600">{totalCreditsGifted}</p>
              </div>
              <Gift className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hediye Sayısı</p>
                <p className="text-2xl font-bold text-purple-600">{creditGifts.length}</p>
              </div>
              <History className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="gift" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gift">Kredi Hediye Et</TabsTrigger>
          <TabsTrigger value="manage">Kredi Yönetimi</TabsTrigger>
          <TabsTrigger value="history">Hediye Geçmişi</TabsTrigger>
          <TabsTrigger value="actions">Admin Aksiyonları</TabsTrigger>
        </TabsList>

        <TabsContent value="gift">
          <CreditGiftForm
            users={users}
            onGiftCredits={handleGiftCredits}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="manage">
          <Card>
            <CardHeader>
              <CardTitle>Kullanıcı Kredi Bakiyeleri</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.first_name} {user.last_name}</span>
                        <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      {editingUserId === user.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={newBalance}
                            onChange={(e) => setNewBalance(e.target.value)}
                            placeholder="Yeni bakiye"
                            className="w-24"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleUpdateBalance(user.id)}
                            disabled={loading}
                          >
                            Kaydet
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingUserId(null);
                              setNewBalance('');
                            }}
                          >
                            İptal
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-green-600">{user.credits} kredi</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingUserId(user.id);
                              setNewBalance(user.credits.toString());
                            }}
                          >
                            Düzenle
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Kredi Hediye Geçmişi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {creditGifts.length > 0 ? (
                  creditGifts.map((gift) => (
                    <div key={gift.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium">
                            {gift.profiles?.first_name} {gift.profiles?.last_name}
                          </span>
                          <span className="text-muted-foreground ml-2">({gift.profiles?.email})</span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-green-600">+{gift.credits_amount} kredi</span>
                          <p className="text-sm text-muted-foreground">
                            {new Date(gift.created_at).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm">
                        <p><strong>Sebep:</strong> {gift.reason}</p>
                        {gift.message && <p><strong>Mesaj:</strong> {gift.message}</p>}
                        <Badge variant="outline" className="mt-2">{gift.gift_type}</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">Henüz kredi hediyesi bulunmuyor.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions">
          <Card>
            <CardHeader>
              <CardTitle>Admin Aksiyonları</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adminActions.length > 0 ? (
                  adminActions.map((action) => (
                    <div key={action.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Badge variant="outline">{action.action_type}</Badge>
                          <span className="ml-2 text-sm text-muted-foreground">{action.target_type}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(action.created_at).toLocaleString('tr-TR')}
                        </span>
                      </div>
                      {action.details && (
                        <pre className="text-sm bg-muted p-2 rounded mt-2 overflow-auto">
                          {JSON.stringify(action.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">Henüz admin aksiyonu bulunmuyor.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
