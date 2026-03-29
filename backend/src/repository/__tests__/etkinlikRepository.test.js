import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import etkinlikRepository from '../../repository/etkinlikRepository.js';
import { connectTestDB, closeTestDB, clearTestDB } from '../../test/db.js';
import Etkinlik from '../../models/posts/etkinlik.js';
import User from '../../models/user/user.js'; // register schema for populate
import Ekip from '../../models/ekip/ekip.js'; // register schema for populate
import mongoose from 'mongoose';

beforeAll(async () => await connectTestDB());
afterAll(async () => await closeTestDB());
beforeEach(async () => await clearTestDB());

// ─── Yardımcılar ─────────────────────────────────────────────────────────────
const mkUserId = () => new mongoose.Types.ObjectId();

const mkEtkinlikData = (overrides = {}) => ({
  name: 'Yaz Kampı',
  type: 'Kamp',
  user: mkUserId(),
  ...overrides,
});

const mkCreate = async (overrides = {}) =>
  etkinlikRepository.create(mkEtkinlikData(overrides));

// ─── CREATE ──────────────────────────────────────────────────────────────────
describe('etkinlikRepository.create', () => {

  it('geçerli data ile etkinlik oluşturulmalı', async () => {
    const e = await mkCreate();
    expect(e).toHaveProperty('_id');
    expect(e.name).toBe('Yaz Kampı');
    expect(e.type).toBe('Kamp');
    expect(e.katilimcilar).toHaveLength(0);
  });

  it('Durum tipi oluşturulabilmeli', async () => {
    const e = await mkCreate({ name: 'Bugün toplantı', type: 'Durum' });
    expect(e.type).toBe('Durum');
  });

  it('tüm etkinlik tipleri geçerli', async () => {
    const types = ['Durum', 'Kamp', 'Yürüyüş', 'Şehir Gezisi', 'Yarışma', 'Sosyal Etkinlik'];
    for (const type of types) {
      const e = await mkCreate({ name: `${type} etkinliği`, type });
      expect(e.type).toBe(type);
    }
  });

  it('geçersiz tip → hata', async () => {
    await expect(mkCreate({ type: 'YANLISTIP' })).rejects.toThrow();
  });

  it('zorunlu alan (name) eksik → hata', async () => {
    await expect(etkinlikRepository.create({ type: 'Kamp', user: mkUserId() })).rejects.toThrow();
  });

  it('zorunlu alan (user) eksik → hata', async () => {
    await expect(etkinlikRepository.create({ name: 'Usersiz', type: 'Kamp' })).rejects.toThrow();
  });

  it('kontenjan number olarak saklanmalı', async () => {
    const e = await mkCreate({ type: 'Kamp', kontenjan: 30 });
    expect(e.kontenjan).toBe(30);
  });

  it('timestamps eklenmeli (createdAt, updatedAt)', async () => {
    const e = await mkCreate();
    expect(e.createdAt).toBeDefined();
    expect(e.updatedAt).toBeDefined();
  });
});

// ─── FIND ALL ────────────────────────────────────────────────────────────────
describe('etkinlikRepository.findall', () => {

  it('boş DB → { etkinlikler: [], total: 0 }', async () => {
    const result = await etkinlikRepository.findall({ limit: 10, page: 1 });
    expect(result.etkinlikler).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it('oluşturulan etkinlikleri döndürmeli', async () => {
    await mkCreate({ name: 'E1' });
    await mkCreate({ name: 'E2' });
    const result = await etkinlikRepository.findall({ limit: 10, page: 1 });
    expect(result.total).toBe(2);
    expect(result.etkinlikler).toHaveLength(2);
  });

  it('belirli ekibe göre filtreleme', async () => {
    const ekip1 = mkUserId();
    const ekip2 = mkUserId();
    await mkCreate({ name: 'Ekip1 Etkinlik', ekip: ekip1 });
    await mkCreate({ name: 'Ekip2 Etkinlik', ekip: ekip2 });
    const result = await etkinlikRepository.findall({ ekip: ekip1, limit: 10, page: 1 });
    expect(result.etkinlikler).toHaveLength(1);
    expect(result.etkinlikler[0].name).toBe('Ekip1 Etkinlik');
  });

  it('ekip filtresi olmadan tümü döner', async () => {
    await mkCreate({ name: 'A' });
    await mkCreate({ name: 'B' });
    await mkCreate({ name: 'C' });
    const result = await etkinlikRepository.findall({ limit: 10, page: 1 });
    expect(result.total).toBe(3);
  });

  it('sayfalama: limit 2, skip 0 -> ilk iki kayıt dönmeli', async () => {
    for (let i = 1; i <= 3; i++) await mkCreate({ name: `Etkinlik ${i}` });
    const result = await etkinlikRepository.findall({ limit: 2, skip: 0 });
    expect(result.etkinlikler).toHaveLength(2);
  });
});

// ─── FIND BY USER ID ─────────────────────────────────────────────────────────
describe('etkinlikRepository.findByUserId', () => {

  it('kullanıcının etkinlikleri dönmeli', async () => {
    const u1 = mkUserId();
    const u2 = mkUserId();
    await mkCreate({ name: 'U1 Etkinlik', user: u1 });
    await mkCreate({ name: 'U2 Etkinlik', user: u2 });
    const result = await etkinlikRepository.findByUserId(u1);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('U1 Etkinlik');
  });

  it('birden fazla etkinlik döndürülmeli', async () => {
    const u = mkUserId();
    await mkCreate({ name: 'A', user: u });
    await mkCreate({ name: 'B', user: u });
    const result = await etkinlikRepository.findByUserId(u);
    expect(result).toHaveLength(2);
  });

  it('etkinliği olmayan kullanıcı → boş dizi', async () => {
    const result = await etkinlikRepository.findByUserId(mkUserId());
    expect(result).toHaveLength(0);
  });
});

// ─── FIND BY ID ──────────────────────────────────────────────────────────────
describe('etkinlikRepository.findById', () => {

  it('var olan ID → etkinlik dönmeli', async () => {
    const e = await mkCreate();
    const found = await etkinlikRepository.findById(e._id);
    expect(found).not.toBeNull();
    expect(found._id.toString()).toBe(e._id.toString());
  });

  it('yanlış ID → null dönmeli', async () => {
    const found = await etkinlikRepository.findById(new mongoose.Types.ObjectId());
    expect(found).toBeNull();
  });
});

// ─── DELETE BY ID ─────────────────────────────────────────────────────────────
describe('etkinlikRepository.deleteById', () => {

  it('var olan etkinlik silinmeli', async () => {
    const e = await mkCreate();
    await etkinlikRepository.deleteById(e._id);
    expect(await Etkinlik.findById(e._id)).toBeNull();
  });

  it('yok olan ID → null (hata değil)', async () => {
    const result = await etkinlikRepository.deleteById(new mongoose.Types.ObjectId());
    expect(result).toBeNull();
  });
});

// ─── KATILIMCI EKLE ──────────────────────────────────────────────────────────
describe('etkinlikRepository.katilimciEkle', () => {

  it('kullanıcı katilimcilar listesine eklenmeli', async () => {
    const e = await mkCreate({ type: 'Kamp' });
    const userId = mkUserId();
    const updated = await etkinlikRepository.katilimciEkle(e._id, userId);
    expect(updated.katilimcilar.map(k => k.toString())).toContain(userId.toString());
  });

  it('$addToSet → aynı kullanıcı iki kez eklenmemeli', async () => {
    const e = await mkCreate({ type: 'Kamp' });
    const userId = mkUserId();
    await etkinlikRepository.katilimciEkle(e._id, userId);
    await etkinlikRepository.katilimciEkle(e._id, userId);
    const db = await Etkinlik.findById(e._id);
    expect(db.katilimcilar).toHaveLength(1);
  });

  it('birden fazla kullanıcı eklenebilmeli', async () => {
    const e = await mkCreate({ type: 'Kamp' });
    for (let i = 0; i < 5; i++) {
      await etkinlikRepository.katilimciEkle(e._id, mkUserId());
    }
    const db = await Etkinlik.findById(e._id);
    expect(db.katilimcilar).toHaveLength(5);
  });
});

// ─── KATILIMCI ÇIKAR ─────────────────────────────────────────────────────────
describe('etkinlikRepository.katilimciCikar', () => {

  it('kullanıcı listeden çıkarılmalı', async () => {
    const e = await mkCreate({ type: 'Kamp' });
    const userId = mkUserId();
    await etkinlikRepository.katilimciEkle(e._id, userId);
    const updated = await etkinlikRepository.katilimciCikar(e._id, userId);
    expect(updated.katilimcilar.map(k => k.toString())).not.toContain(userId.toString());
  });

  it('olmayan kullanıcıyı çıkarma → listeyi korur', async () => {
    const e = await mkCreate({ type: 'Kamp' });
    const existingId = mkUserId();
    await etkinlikRepository.katilimciEkle(e._id, existingId);
    const updated = await etkinlikRepository.katilimciCikar(e._id, mkUserId());
    expect(updated.katilimcilar).toHaveLength(1);
  });
});

// ─── COUNT BY TYPE ────────────────────────────────────────────────────────────
describe('etkinlikRepository.countByType', () => {

  it('belirli tipteki etkinlikleri saymalı', async () => {
    await mkCreate({ name: 'K1', type: 'Kamp' });
    await mkCreate({ name: 'K2', type: 'Kamp' });
    await mkCreate({ name: 'D1', type: 'Durum' });
    expect(await etkinlikRepository.countByType('Kamp')).toBe(2);
    expect(await etkinlikRepository.countByType('Durum')).toBe(1);
    expect(await etkinlikRepository.countByType('Yarışma')).toBe(0);
  });
});

// ─── UPDATE RSVP ─────────────────────────────────────────────────────────────
describe('etkinlikRepository.updateRsvp', () => {

  it('"going" status → katilimcilar listesine ekle', async () => {
    const e = await mkCreate({ type: 'Kamp' });
    const userId = mkUserId();
    const updated = await etkinlikRepository.updateRsvp(e._id, userId, 'going');
    expect(updated.katilimcilar.map(k => k.toString())).toContain(userId.toString());
  });

  it('"not-going" status → katilimcilar listesinden çıkar', async () => {
    const e = await mkCreate({ type: 'Kamp' });
    const userId = mkUserId();
    await etkinlikRepository.updateRsvp(e._id, userId, 'going');
    const updated = await etkinlikRepository.updateRsvp(e._id, userId, 'not-going');
    expect(updated.katilimcilar.map(k => k.toString())).not.toContain(userId.toString());
  });

  it('"going" + $addToSet → aynı kullanıcı tekrar eklenemez', async () => {
    const e = await mkCreate({ type: 'Kamp' });
    const userId = mkUserId();
    await etkinlikRepository.updateRsvp(e._id, userId, 'going');
    await etkinlikRepository.updateRsvp(e._id, userId, 'going');
    const db = await Etkinlik.findById(e._id);
    expect(db.katilimcilar).toHaveLength(1);
  });
});
