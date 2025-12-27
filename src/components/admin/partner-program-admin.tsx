"use client"

import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle2, XCircle, RefreshCcw, Users, Gift, Wallet, Settings } from 'lucide-react';
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface PartnerRow { id: string; user_id: string; status: string; display_name: string | null; email?: string | null }
interface RewardRow { id: string; partner_id: string; type: string; amount: number; status: string; note: string | null; created_at: string }
interface PayoutRow { id: string; partner_id: string; amount: number; currency: string; status: string; requested_at: string; processed_at: string | null }
interface ProgramSettings { id: string; active: boolean; referral_discount_rate: number; referrer_bonus_rate: number; partner_override_rate: number; min_payout_amount: number; currency: string }

export function PartnerProgramAdmin() {
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState<PartnerRow[]>([]);
  const [rewards, setRewards] = useState<RewardRow[]>([]);
  const [payouts, setPayouts] = useState<PayoutRow[]>([]);
  const [settings, setSettings] = useState<ProgramSettings | null>(null);

  const [newPartnerEmail, setNewPartnerEmail] = useState('');
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  const supabase = createClient();

  const totals = useMemo(() => {
    const approved = rewards.filter(r => r.status === 'approved').reduce((s, r) => s + Number(r.amount || 0), 0);
    const pending = rewards.filter(r => r.status === 'pending').reduce((s, r) => s + Number(r.amount || 0), 0);
    const pendingPayouts = payouts.filter(p => p.status === 'pending').length;
    return { approved, pending, pendingPayouts };
  }, [rewards, payouts]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      // Partners
      const { data: partnerRows, error: pErr } = await supabase.from('partners').select('*').order('created_at', { ascending: false });
      if (pErr) throw pErr;

      // Enrich with emails
      let enriched: PartnerRow[] = partnerRows || [];
      if (partnerRows && partnerRows.length > 0) {
        const ids = partnerRows.map(p => p.user_id);
        const { data: profiles } = await supabase.from('profiles').select('id,email').in('id', ids);
        const emailMap = new Map((profiles || []).map((pr: any) => [pr.id, pr.email]));
        enriched = partnerRows.map(p => ({ ...p, email: emailMap.get(p.user_id) || null }));
      }
      setPartners(enriched);

      // Rewards
      const { data: rewardRows, error: rErr } = await supabase.from('reward_ledger').select('id,partner_id,type,amount,status,note,created_at').order('created_at', { ascending: false }).limit(100);
      if (rErr) throw rErr;
      setRewards(rewardRows || []);

      // Payouts
      const { data: payoutRows, error: payErr } = await supabase.from('payout_requests').select('id,partner_id,amount,currency,status,requested_at,processed_at').order('requested_at', { ascending: false }).limit(100);
      if (payErr) throw payErr;
      setPayouts(payoutRows || []);

      // Settings (maybe single)
      const { data: settingsRow } = await supabase.from('program_settings').select('*').eq('active', true).maybeSingle();
      setSettings(settingsRow as ProgramSettings | null);
    } catch (e: any) {
      console.error(e);
      toast.error('Veriler alınamadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const createPartner = async () => {
    if (!newPartnerEmail) return;
    setCreating(true);
    try {
      const { data: profile, error: perr } = await supabase.from('profiles').select('id,email').eq('email', newPartnerEmail).maybeSingle();
      if (perr) throw perr;
      if (!profile?.id) {
        toast.error('Bu e-postaya ait kullanıcı yok.');
        return;
      }
      const { error: iErr } = await supabase.from('partners').insert({ user_id: profile.id, status: 'active' });
      if (iErr) throw iErr;
      toast.success(`Partner eklendi: ${newPartnerEmail}`);
      setNewPartnerEmail('');
      fetchAll();
    } catch (e: any) {
      toast.error(e.message || 'Partner eklenemedi');
    } finally {
      setCreating(false);
    }
  };

  const updatePartner = async (row: PartnerRow, patch: Partial<PartnerRow>) => {
    setUpdating(true);
    try {
      const { error } = await supabase.from('partners').update(patch).eq('id', row.id);
      if (error) throw error;
      toast.success('Güncellendi');
      fetchAll();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setUpdating(false);
    }
  };

  const changeRewardStatus = async (row: RewardRow, status: 'approved' | 'canceled' | 'paid') => {
    try {
      const { error } = await supabase.from('reward_ledger').update({ status }).eq('id', row.id);
      if (error) throw error;
      toast.success('Ödül güncellendi');
      fetchAll();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const changePayoutStatus = async (row: PayoutRow, status: 'approved' | 'paid' | 'rejected' | 'canceled') => {
    try {
      const { error } = await supabase.from('payout_requests').update({ status }).eq('id', row.id);
      if (error) throw error;
      toast.success('Talep güncellendi');
      fetchAll();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const upsertSettings = async () => {
    if (!settings) {
      const { error } = await supabase.from('program_settings').insert({ active: true });
      if (error) {
        toast.error('Ayarlar oluşturulamadı');
        return;
      }
      toast.success('Ayarlar oluşturuldu');
      fetchAll();
      return;
    }
    const { id, ...toUpdate } = settings as any;
    const { error } = await supabase.from('program_settings').update(toUpdate).eq('id', id as string);
    if (error) {
      toast.error('Ayarlar güncellenemedi');
      return;
    }
    toast.success('Ayarlar güncellendi');
    fetchAll();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" /> Partner Programı</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="partners">
          <TabsList className="grid grid-cols-4 w-full h-auto">
            <TabsTrigger value="partners" className="flex items-center gap-2 py-2"><Users className="h-4 w-4" /> Partnerlar</TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2 py-2"><Gift className="h-4 w-4" /> Ödüller</TabsTrigger>
            <TabsTrigger value="payouts" className="flex items-center gap-2 py-2"><Wallet className="h-4 w-4" /> Ödemeler</TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 py-2"><Settings className="h-4 w-4" /> Ayarlar</TabsTrigger>
          </TabsList>

          {/* Partners */}
          <TabsContent value="partners" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input placeholder="Kullanıcı e-postası" value={newPartnerEmail} onChange={(e) => setNewPartnerEmail(e.target.value)} />
              <Button onClick={createPartner} disabled={creating}>
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Partner Ekle'}
              </Button>
              <Button variant="outline" onClick={fetchAll}><RefreshCcw className="h-4 w-4 mr-2" /> Yenile</Button>
            </div>

            {loading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Yükleniyor...
              </div>
            ) : partners.length === 0 ? (
              <p className="text-sm text-muted-foreground">Partner bulunamadı.</p>
            ) : (
              <div className="space-y-3">
                {partners.map((p) => (
                  <div key={p.id} className="p-3 border rounded-md flex items-center justify-between">
                    <div>
                      <div className="font-medium">{p.display_name || p.email || p.user_id}</div>
                      <div className="text-xs text-muted-foreground">Durum: <Badge variant="outline">{p.status}</Badge></div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => updatePartner(p, { status: p.status === 'active' ? 'suspended' : 'active' })}>Durumu Değiştir</Button>
                      <Button size="sm" variant="outline" onClick={() => updatePartner(p, { display_name: (p.display_name ? '' : (p.email || 'Partner')) })}>İsmi {p.display_name ? 'Temizle' : 'Ayarla'}</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Rewards */}
          <TabsContent value="rewards" className="space-y-4 mt-6">
            <div className="flex items-center gap-6">
              <div>Onaylanmış Toplam: <span className="font-semibold text-primary">{totals.approved}</span></div>
              <div>Bekleyen: <span className="font-semibold">{totals.pending}</span></div>
            </div>
            {rewards.length === 0 ? (
              <p className="text-sm text-muted-foreground">Ödül kaydı yok.</p>
            ) : (
              <div className="space-y-3">
                {rewards.map((r) => (
                  <div key={r.id} className="p-3 border rounded-md flex items-center justify-between">
                    <div>
                      <div className="font-medium">{r.type} – {r.amount}</div>
                      <div className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString('tr-TR')} • Not: {r.note || '-'}</div>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{r.status}</Badge>
                      <Button size="sm" variant="outline" onClick={() => changeRewardStatus(r, 'approved')}><CheckCircle2 className="h-4 w-4 mr-1" /> Onayla</Button>
                      <Button size="sm" variant="outline" onClick={() => changeRewardStatus(r, 'canceled')}><XCircle className="h-4 w-4 mr-1" /> İptal</Button>
                      <Button size="sm" variant="outline" onClick={() => changeRewardStatus(r, 'paid')}>Ödendi</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Payouts */}
          <TabsContent value="payouts" className="space-y-4 mt-6">
            <div className="flex items-center gap-6">
              <div>Bekleyen ödeme talebi: <span className="font-semibold text-primary">{totals.pendingPayouts}</span></div>
              <Button variant="outline" onClick={fetchAll}><RefreshCcw className="h-4 w-4 mr-2" /> Yenile</Button>
            </div>
            {payouts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Ödeme talebi yok.</p>
            ) : (
              <div className="space-y-3">
                {payouts.map((p) => (
                  <div key={p.id} className="p-3 border rounded-md flex items-center justify-between">
                    <div>
                      <div className="font-medium">{p.amount} {p.currency}</div>
                      <div className="text-xs text-muted-foreground">Durum: {p.status} • Talep: {new Date(p.requested_at).toLocaleString('tr-TR')}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => changePayoutStatus(p, 'approved')}>Onayla</Button>
                      <Button size="sm" variant="outline" onClick={() => changePayoutStatus(p, 'paid')}>Ödendi</Button>
                      <Button size="sm" variant="outline" onClick={() => changePayoutStatus(p, 'rejected')}>Reddet</Button>
                      <Button size="sm" variant="outline" onClick={() => changePayoutStatus(p, 'canceled')}>İptal</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-4 mt-6">
            {!settings ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Aktif ayar bulunamadı.</p>
                <Button onClick={upsertSettings}>Varsayılan Ayar Oluştur</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Referrer Bonus Oranı</label>
                  <Input type="number" step="0.01" value={settings.referrer_bonus_rate}
                    onChange={(e) => setSettings({ ...(settings as any), referrer_bonus_rate: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Referral İndirim Oranı</label>
                  <Input type="number" step="0.01" value={settings.referral_discount_rate}
                    onChange={(e) => setSettings({ ...(settings as any), referral_discount_rate: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Partner Override Oranı</label>
                  <Input type="number" step="0.01" value={settings.partner_override_rate}
                    onChange={(e) => setSettings({ ...(settings as any), partner_override_rate: Number(e.target.value) })} />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Asgari Ödeme Tutarı</label>
                  <Input type="number" step="1" value={settings.min_payout_amount}
                    onChange={(e) => setSettings({ ...(settings as any), min_payout_amount: Number(e.target.value) })} />
                </div>
                <div className="md:col-span-2">
                  <Button onClick={upsertSettings}>Kaydet</Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
