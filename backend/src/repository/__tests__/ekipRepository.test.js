import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import ekipRepository from '../../repository/ekipRepository.js';
import devreRepository from '../../repository/devreRepository.js';
import { connectTestDB, closeTestDB, clearTestDB } from '../../test/db.js';
import Ekip from '../../models/ekip/ekip.js';
import User from '../../models/user/user.js'; // register schema for populate
import Devre from '../../models/devre/devre.js'; // register schema for populate
import mongoose from 'mongoose';

beforeAll(async () => await connectTestDB());
afterAll(async () => await closeTestDB());
beforeEach(async () => await clearTestDB());

// ─── Yardımcılar ─────────────────────────────────────────────────────────────
const mkDevre = async (name = 'Test Devresi') =>
  devreRepository.create({ devreName: name, devreType: 'Okul' });

const mkEkip = async (devreId, name = 'Kartal Ekibi') =>
  ekipRepository.create({ ekipAd: name, devre: devreId });

// ─── CREATE ──────────────────────────────────────────────────────────────────
describe('ekipRepository.create', () => {

  it('geçerli data ile ekip oluşturulmalı', async () => {
    const d = await mkDevre();
    const ekip = await mkEkip(d._id);
    expect(ekip).toHaveProperty('_id');
    expect(ekip.ekipAd).toBe('Kartal Ekibi');
    expect(ekip.izciSayi).toBe(0);
    expect(ekip.ekipBasi).toBeNull();
  });

  it('aynı isimle iki kez oluşturulmamalı (unique)', async () => {
    const d = await mkDevre();
    await mkEkip(d._id, 'Unique Ekip');
    await expect(mkEkip(d._id, 'Unique Ekip')).rejects.toThrow();
  });

  it('eksik zorunlu alan (devre) → hata', async () => {
    await expect(ekipRepository.create({ ekipAd: 'Devresiz Ekip' })).rejects.toThrow();
  });

  it('eksik zorunlu alan (ekipAd) → hata', async () => {
    const d = await mkDevre();
    await expect(ekipRepository.create({ devre: d._id })).rejects.toThrow();
  });

  it('5 karakterden kısa ekip adı → hata (minlength)', async () => {
    const d = await mkDevre();
    await expect(ekipRepository.create({ ekipAd: 'Kıs', devre: d._id })).rejects.toThrow();
  });
});

// ─── FIND ALL ────────────────────────────────────────────────────────────────
describe('ekipRepository.findAll', () => {

  it('boş DB → { ekipler: [], total: 0 }', async () => {
    const result = await ekipRepository.findAll({ skip: 0, limit: 10 });
    expect(result.ekipler).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it('oluşturulan ekipler dönmeli', async () => {
    const d = await mkDevre();
    await mkEkip(d._id, 'Ekip 1');
    await mkEkip(d._id, 'Ekip 2');
    const result = await ekipRepository.findAll({ skip: 0, limit: 10 });
    expect(result.total).toBe(2);
    expect(result.ekipler).toHaveLength(2);
  });

  it('skip ile sayfalama çalışmalı', async () => {
    const d = await mkDevre();
    for (let i = 1; i <= 4; i++) await mkEkip(d._id, `Ekip ${i}`);
    const result = await ekipRepository.findAll({ skip: 3, limit: 10 });
    expect(result.ekipler).toHaveLength(1);
    expect(result.total).toBe(4);
  });

  it('limit ile sınırlandırma çalışmalı', async () => {
    const d = await mkDevre();
    for (let i = 1; i <= 5; i++) await mkEkip(d._id, `Limit Ekip ${i}`);
    const result = await ekipRepository.findAll({ skip: 0, limit: 2 });
    expect(result.ekipler).toHaveLength(2);
    expect(result.total).toBe(5);
  });
});

// ─── FIND BY DEVRE ID ────────────────────────────────────────────────────────
describe('ekipRepository.findByDevreId', () => {

  it('devreye ait ekipler dönmeli', async () => {
    const d1 = await mkDevre('Devre Bir');
    const d2 = await mkDevre('Devre İki');
    await mkEkip(d1._id, 'D1 Ekip');
    await mkEkip(d2._id, 'D2 Ekip');
    const result = await ekipRepository.findByDevreId(d1._id);
    expect(result).toHaveLength(1);
    expect(result[0].ekipAd).toBe('D1 Ekip');
  });

  it('devrede ekip yoksa boş dizi', async () => {
    const d = await mkDevre();
    const result = await ekipRepository.findByDevreId(d._id);
    expect(result).toHaveLength(0);
  });

  it('yok olan devre ID → boş dizi (hata değil)', async () => {
    const result = await ekipRepository.findByDevreId(new mongoose.Types.ObjectId());
    expect(result).toHaveLength(0);
  });
});

// ─── FIND BY ID ──────────────────────────────────────────────────────────────
describe('ekipRepository.findById', () => {

  it('var olan ID → ekip dönmeli', async () => {
    const d = await mkDevre();
    const e = await mkEkip(d._id);
    const found = await ekipRepository.findById(e._id);
    expect(found).not.toBeNull();
    expect(found._id.toString()).toBe(e._id.toString());
  });

  it('yanlış ID → null dönmeli', async () => {
    const found = await ekipRepository.findById(new mongoose.Types.ObjectId());
    expect(found).toBeNull();
  });
});

// ─── FIND BY NAME ────────────────────────────────────────────────────────────
describe('ekipRepository.findByName', () => {

  it('var olan isim → ekip dönmeli', async () => {
    const d = await mkDevre();
    await mkEkip(d._id, 'Özel Ekip İsmi');
    const found = await ekipRepository.findByName('Özel Ekip İsmi');
    expect(found).not.toBeNull();
    expect(found.ekipAd).toBe('Özel Ekip İsmi');
  });

  it('yok olan isim → null dönmeli', async () => {
    const found = await ekipRepository.findByName('Yok Ekip');
    expect(found).toBeNull();
  });
});

// ─── DELETE BY ID ─────────────────────────────────────────────────────────────
describe('ekipRepository.deleteById', () => {

  it('var olan ekip silinmeli', async () => {
    const d = await mkDevre();
    const e = await mkEkip(d._id);
    await ekipRepository.deleteById(e._id);
    expect(await Ekip.findById(e._id)).toBeNull();
  });

  it('yok olan ID → null (hata değil)', async () => {
    const result = await ekipRepository.deleteById(new mongoose.Types.ObjectId());
    expect(result).toBeNull();
  });
});

// ─── EKİP BAŞI DEĞİŞTİR ──────────────────────────────────────────────────────
describe('ekipRepository.ekipBasiDegistir', () => {

  it('ekipBasi güncellenmeli', async () => {
    const d = await mkDevre();
    const e = await mkEkip(d._id);
    const userId = new mongoose.Types.ObjectId();
    const updated = await ekipRepository.ekipBasiDegistir(e._id, userId);
    expect(updated.ekipBasi.toString()).toBe(userId.toString());
  });
});

// ─── EKİP BAŞI YARDIMCI DEĞİŞTİR ─────────────────────────────────────────────
describe('ekipRepository.ekipBasiYardimciDegistir', () => {

  it('EkipBasiYardimcisi güncellenmeli', async () => {
    const d = await mkDevre();
    const e = await mkEkip(d._id);
    const userId = new mongoose.Types.ObjectId();
    const updated = await ekipRepository.ekipBasiYardimciDegistir(e._id, userId);
    expect(updated.EkipBasiYardimcisi.toString()).toBe(userId.toString());
  });
});

// ─── EKİP AD DEĞİŞTİR ────────────────────────────────────────────────────────
describe('ekipRepository.ekipAdDegistir', () => {

  it('isim güncellenmeli', async () => {
    const d = await mkDevre();
    const e = await mkEkip(d._id, 'Eski Ekip Adı');
    const updated = await ekipRepository.ekipAdDegistir(e._id, 'Yeni Ekip Adı');
    expect(updated.ekipAd).toBe('Yeni Ekip Adı');
  });

  it('minlength kısıtlaması çalışmalı (runValidators)', async () => {
    const d = await mkDevre();
    const e = await mkEkip(d._id, 'Geçerli Ekip');
    await expect(ekipRepository.ekipAdDegistir(e._id, 'Kıs')).rejects.toThrow();
  });
});

// ─── İZCİ EKLE ───────────────────────────────────────────────────────────────
describe('ekipRepository.izciEkle', () => {

  it('izci katilimcilar listesine eklenmeli', async () => {
    const d = await mkDevre();
    const e = await mkEkip(d._id);
    const izciId = new mongoose.Types.ObjectId();
    const updated = await ekipRepository.izciEkle(e._id, izciId);
    expect(updated.katilimcilar.map(k => k.toString())).toContain(izciId.toString());
    expect(updated.izciSayi).toBe(1);
  });

  it('$addToSet → aynı izci iki kez eklenmemeli', async () => {
    const d = await mkDevre();
    const e = await mkEkip(d._id);
    const izciId = new mongoose.Types.ObjectId();
    await ekipRepository.izciEkle(e._id, izciId);
    await ekipRepository.izciEkle(e._id, izciId);
    const db = await Ekip.findById(e._id);
    expect(db.katilimcilar).toHaveLength(1);
  });

  it('birden fazla izci eklenebilmeli', async () => {
    const d = await mkDevre();
    const e = await mkEkip(d._id);
    for (let i = 0; i < 4; i++) {
      await ekipRepository.izciEkle(e._id, new mongoose.Types.ObjectId());
    }
    const db = await Ekip.findById(e._id);
    expect(db.katilimcilar).toHaveLength(4);
    expect(db.izciSayi).toBe(4);
  });
});

// ─── İZCİ ÇIKAR ──────────────────────────────────────────────────────────────
describe('ekipRepository.izciCikar', () => {

  it('izci listeden çıkarılmalı', async () => {
    const d = await mkDevre();
    const e = await mkEkip(d._id);
    const izciId = new mongoose.Types.ObjectId();
    await ekipRepository.izciEkle(e._id, izciId);
    const updated = await ekipRepository.izciCikar(e._id, izciId);
    expect(updated.katilimcilar.map(k => k.toString())).not.toContain(izciId.toString());
    expect(updated.izciSayi).toBe(0);
  });

  it('olmayan izciyi çıkarma → hata fırlatmaz, listeyi korur', async () => {
    const d = await mkDevre();
    const e = await mkEkip(d._id);
    const izciId = new mongoose.Types.ObjectId();
    await ekipRepository.izciEkle(e._id, new mongoose.Types.ObjectId()); // başka izci var
    const updated = await ekipRepository.izciCikar(e._id, izciId);
    expect(updated).not.toBeNull();
    expect(updated.katilimcilar).toHaveLength(1); // eklenen diğeri hâlâ var
  });
});

// ─── İZCİ SAYISI GÜNCELLE (Senkronizasyon) ────────────────────────────────────
describe('ekipRepository.izciSayisiGuncelle', () => {

  it('gerçek katilimci sayısıyla senkronize etmeli', async () => {
    const d = await mkDevre();
    const e = await mkEkip(d._id);
    for (let i = 0; i < 3; i++) {
      await ekipRepository.izciEkle(e._id, new mongoose.Types.ObjectId());
    }
    // izciSayi şu an 3, bozalım
    await Ekip.findByIdAndUpdate(e._id, { $set: { izciSayi: 0 } });
    const synced = await ekipRepository.izciSayisiGuncelle(e._id);
    expect(synced.izciSayi).toBe(3);
  });

  it('yok olan ID → null dönmeli', async () => {
    const result = await ekipRepository.izciSayisiGuncelle(new mongoose.Types.ObjectId());
    expect(result).toBeNull();
  });
});
