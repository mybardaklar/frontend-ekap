"use client"

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, CreditCard, BarChart3 } from "lucide-react";

interface AdminStatsProps {
  stats: {
    totalMembers: number;
    totalCredits: number;
    totalDecisions: number;
    recentGifts: number;
  }
}

export function AdminStats({ stats }: AdminStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Toplam Kullanıcı</p>
              <p className="text-2xl font-bold">{stats.totalMembers}</p>
            </div>
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Toplam Kredi</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalCredits}</p>
            </div>
            <CreditCard className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Toplam Karar</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalDecisions}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bu Ay Hediye</p>
              <p className="text-2xl font-bold text-orange-600">{stats.recentGifts}</p>
            </div>
            <CreditCard className="h-8 w-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
