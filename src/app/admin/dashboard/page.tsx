"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Users, CreditCard, BarChart3, Share2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

import { MemberManagement } from '@/components/admin/member-management';
import { CreditManagement } from '@/components/admin/credit-management';
import { PartnerProgramAdmin } from '@/components/admin/partner-program-admin';
import { AdminStats } from '@/components/admin/admin-stats';

// Define the UserData type which is used in member management
interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: 'admin' | 'user';
  created_at: string;
  credits: number;
  subscription_status: string;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalMembers: 0,
    totalCredits: 0,
    totalDecisions: 0,
    recentGifts: 0
  });

  const supabase = createClient();
  const router = useRouter();

  // Check Admin Access
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/');
          return;
        }

        let isUserAdmin = false;
        if (user.email === 'ekap@ekap.ai') {
          isUserAdmin = true;
        } else {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
          if (profile?.role === 'admin') isUserAdmin = true;
        }

        if (!isUserAdmin) {
          router.push('/');
          return;
        }

        setIsAdmin(true);
        setLoading(false);
        fetchUsers();
        fetchDashboardStats();
      } catch (error) {
        console.error('Admin check error:', error);
        router.push('/');
      }
    };

    checkAdmin();
  }, [router]);

  const fetchUsers = async () => {
    if (loadingData) return;

    try {
      setLoadingData(true);
      console.log('🔄 Starting user data fetch...');

      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name, phone, role, created_at, referral_code, referred_by');

      if (profilesError) throw profilesError;

      if (!profilesData || profilesData.length === 0) {
        setUsers([]);
        return;
      }

      const usersWithDetails = await Promise.all(
        profilesData.map(async (profile) => {
          try {
            const { data: creditData } = await supabase
              .from('user_credits')
              .select('balance')
              .eq('user_id', profile.id)
              .single();

            const { data: subscriberData } = await supabase
              .from('subscribers')
              .select('*')
              .eq('user_id', profile.id)
              .single();

            return {
              id: profile.id,
              email: profile.email || '',
              first_name: profile.first_name || '',
              last_name: profile.last_name || '',
              phone: profile.phone || '',
              role: profile.role || 'user',
              created_at: profile.created_at,
              credits: creditData?.balance || 0,
              subscription_status: subscriberData?.subscription_status || 'inactive'
            } as UserData;
          } catch (error) {
            console.error(`Error fetching details for user ${profile.id}:`, error);
            // Return with defaults
            return {
              id: profile.id,
              email: profile.email ||'',
              first_name: profile.first_name || '',
              last_name: profile.last_name || '',
              phone: profile.phone || '',
              role: profile.role || 'user',
              created_at: profile.created_at,
              credits: 0,
              subscription_status: 'inactive'
            } as UserData;
          }
        })
      );

      setUsers(usersWithDetails);

    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error(`Kullanıcı verileri yüklenirken bir hata oluştu: ${error.message}`);
      setUsers([]);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      // Get total decisions
      const { count: decisionsCount } = await supabase
        .from('urun_bilgileri')
        .select('*', { count: 'exact', head: true });

      // Get recent credit gifts (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { count: giftsCount } = await supabase
        .from('credit_gifts')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());

      setDashboardStats(prevStats => ({
        ...prevStats,
        totalDecisions: decisionsCount || 0,
        recentGifts: giftsCount || 0
      }));
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  // Update stats when users array changes
  useEffect(() => {
    if (users.length > 0) {
      const nonAdminUsers = users.filter(u => u.role !== 'admin');

      const totalMembers = nonAdminUsers.length;
      const totalCredits = nonAdminUsers.reduce((sum, user) => sum + user.credits, 0);

      setDashboardStats(prevStats => ({
        ...prevStats,
        totalMembers,
        totalCredits
      }));
    }
  }, [users]);

  // Filtered users for different views
  const allNonAdminUsers = users.filter(u => u.role !== 'admin');

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Yetki kontrol ediliyor...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // or redirect, handled in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">
          Sistem yönetimi işlemlerini buradan gerçekleştirebilirsiniz.
        </p>
      </div>

      {loadingData && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/30 dark:border-blue-800">
          <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Kullanıcı verileri yükleniyor...</span>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto">
          <TabsTrigger value="overview" className="flex items-center gap-2 py-3">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden md:inline">Özet</span>
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center gap-2 py-3">
            <Users className="h-4 w-4" />
            <span className="hidden md:inline">Kullanıcılar ({allNonAdminUsers.length})</span>
          </TabsTrigger>
          <TabsTrigger value="credits" className="flex items-center gap-2 py-3">
            <CreditCard className="h-4 w-4" />
            <span className="hidden md:inline">Kredi Yönetimi</span>
          </TabsTrigger>
          <TabsTrigger value="partner" className="flex items-center gap-2 py-3">
            <Share2 className="h-4 w-4" />
            <span className="hidden md:inline">Partner Programı</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <AdminStats stats={dashboardStats} />

          <Card>
            <CardHeader>
              <CardTitle>Hızlı Erişim</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button onClick={() => setActiveTab('credits')} className="h-24 flex flex-col gap-2 text-lg">
                <CreditCard className="h-8 w-8" />
                Kredi Hediye Et
              </Button>
              <Button onClick={() => setActiveTab('members')} variant="outline" className="h-24 flex flex-col gap-2 text-lg">
                <Users className="h-8 w-8" />
                Kullanıcı Yönet
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="space-y-6 mt-6">
          <MemberManagement
            users={allNonAdminUsers}
            refreshUsers={fetchUsers}
            loading={loadingData}
          />
        </TabsContent>

        <TabsContent value="credits" className="space-y-6 mt-6">
          <CreditManagement
            users={allNonAdminUsers}
            refreshUsers={fetchUsers}
          />
        </TabsContent>

        <TabsContent value="partner" className="space-y-6 mt-6">
          <PartnerProgramAdmin />
        </TabsContent>
      </Tabs>
    </div>
  );
}
