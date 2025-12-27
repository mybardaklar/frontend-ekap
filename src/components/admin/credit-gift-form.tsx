"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Gift, User, CreditCard, Users } from "lucide-react";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  credits: number;
}

interface CreditGiftFormProps {
  users: User[];
  onGiftCredits: (userId: string, amount: number, reason: string, message?: string, sendEmail?: boolean) => Promise<boolean>;
  loading: boolean;
}

export function CreditGiftForm({ users, onGiftCredits, loading }: CreditGiftFormProps) {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [creditsAmount, setCreditsAmount] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [sendNotification, setSendNotification] = useState(true);
  const [selectAll, setSelectAll] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserIds.length || !creditsAmount || !reason) {
      return;
    }

    let successCount = 0;
    const totalUsers = selectedUserIds.length;

    for (const userId of selectedUserIds) {
      const success = await onGiftCredits(
        userId,
        parseInt(creditsAmount),
        reason,
        message || undefined,
        sendEmail
      );
      if (success) successCount++;
    }

    if (successCount === totalUsers) {
      setSelectedUserIds([]);
      setCreditsAmount('');
      setReason('');
      setMessage('');
      setSelectAll(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedUserIds(users.map(u => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleUserSelect = (userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUserIds(prev => [...prev, userId]);
    } else {
      setSelectedUserIds(prev => prev.filter(id => id !== userId));
      setSelectAll(false);
    }
  };

  const selectedUsers = users.filter(u => selectedUserIds.includes(u.id));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Kullanıcı Seçimi ({users.length} kullanıcı)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectAll}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all" className="font-medium">
                Tüm kullanıcıları seç ({users.length})
              </Label>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 border rounded p-2">
              {users.map((user) => (
                <div key={user.id} className="flex items-center space-x-2 p-2 hover:bg-muted rounded">
                  <Checkbox
                    id={user.id}
                    checked={selectedUserIds.includes(user.id)}
                    onCheckedChange={(checked) => handleUserSelect(user.id, !!checked)}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="font-medium truncate">{user.first_name} {user.last_name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    <p className="text-sm text-green-600 font-medium">{user.credits} kredi</p>
                  </div>
                </div>
              ))}
            </div>

            {selectedUserIds.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  {selectedUserIds.length} kullanıcı seçildi
                </p>
                {selectedUserIds.length <= 5 && (
                  <div className="mt-2 space-y-1">
                    {selectedUsers.map(user => (
                      <p key={user.id} className="text-xs text-blue-600 dark:text-blue-400">
                        {user.first_name} {user.last_name} ({user.email})
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Kredi Hediye Et
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="amount">Kredi Miktarı</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                value={creditsAmount}
                onChange={(e) => setCreditsAmount(e.target.value)}
                placeholder="Örn: 100"
                required
              />
            </div>

            <div>
              <Label htmlFor="reason">Sebep</Label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Örn: Promosyon kampanyası"
                required
              />
            </div>

            <div>
              <Label htmlFor="message">Özel Mesaj (Opsiyonel)</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Kullanıcılara gönderilecek özel mesaj..."
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="sendEmail"
                  checked={sendEmail}
                  onCheckedChange={setSendEmail}
                />
                <Label htmlFor="sendEmail">Email bildirimi gönder</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="sendNotification"
                  checked={sendNotification}
                  onCheckedChange={setSendNotification}
                />
                <Label htmlFor="sendNotification">Sistem bildirimi gönder</Label>
              </div>
            </div>

            {selectedUserIds.length > 0 && (
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4" />
                  <span>
                    <strong>{selectedUserIds.length}</strong> kullanıcıya <strong>{creditsAmount || '0'}</strong> kredi hediye edilecek
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Toplam: {selectedUserIds.length * (parseInt(creditsAmount) || 0)} kredi
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading || !selectedUserIds.length || !creditsAmount || !reason}
              className="w-full"
            >
              {loading ? 'İşleniyor...' : `${selectedUserIds.length} Kullanıcıya ${creditsAmount || '0'} Kredi Hediye Et`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
