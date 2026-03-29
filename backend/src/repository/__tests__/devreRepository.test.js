import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import devreRepository from '../../repository/devreRepository.js';
import { connectTestDB, closeTestDB, clearTestDB } from '../../test/db.js';
import Devre from '../../models/devre/devre.js';
import User from '../../models/user/user.js'; // register schema for populate
import Ekip from '../../models/ekip/ekip.js'; // register schema for populate
import mongoose from 'mongoose';

beforeAll(async () => await connectTestDB());
afterAll(async () => await closeTestDB());
beforeEach(async () => await clearTestDB());

const mkDevre = async (name = 'Ana Devre', type = 'Okul') =>
  devreRepository.create({ devreName: name, devreType: type });

// ─── CREATE ──────────────────────────────────────────────────────────────────
describe('devreRepository.create', () => {

  it('geçerli data ile devre oluşturulmalı', async () => {
    const d = await mkDevre('Test Devre');
    expect(d).toHaveProperty('_id');
    expect(d.devreName).toBe('Test Devre');
    expect(d.devreType).toBe('Okul');
    expect(d.izciSayisi).toBe(0);
    expect(d.ekipSayisi).toBe(0);
  });

  it('aynı isimle iki kez oluşturulmamalı (unique)', async () => {
    await mkDevre('Unique Devre');
    await expect(mkDevre('Unique Devre')).rejects.toThrow();
  });

  it('eksik zorunlu alan → hata fırlatmalı', async () => {
    await expect(devreRepository.create({ devreType: 'Okul' })).rejects.toThrow();
  });

  it('geçersiz devreType → hata fırlatmalı', async () => {
    await expect(
      devreRepository.create({ devreName: 'Geçersiz Tip', devreType: 'YANLISTIP' })
    ).rejects.toThrow();
  });

  it('3 karakterden kısa isim → hata fırlatmalı (minlength)', async () => {
    await expect(
      devreRepository.create({ devreName: 'AB', devreType: 'Okul' })
    ).rejects.toThrow();
  });
});

// ─── FIND ALL ────────────────────────────────────────────────────────────────
describe('devreRepository.findAll', () => {

  it('boş DB → { devreler: [], total: 0 }', async () => {
    const result = await devreRepository.findAll({ skip: 0, limit: 10 });
    expect(result.devreler).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it('oluşturulan devreleri döndürmeli', async () => {
    await mkDevre('Dev1');
    await mkDevre('Dev2');
    const result = await devreRepository.findAll({ skip: 0, limit: 10 });
    expect(result.total).toBe(2);
    expect(result.devreler).toHaveLength(2);
  });

  it('skip ile sayfalama çalışmalı', async () => {
    await mkDevre('Dev1'); await mkDevre('Dev2'); await mkDevre('Dev3');
    const result = await devreRepository.findAll({ skip: 2, limit: 10 });
    expect(result.devreler).toHaveLength(1);
    expect(result.total).toBe(3);
  });

  it('limit ile sınırlandırma çalışmalı', async () => {
    for (let i = 1; i <= 5; i++) await mkDevre(`Devre ${i}`);
    const result = await devreRepository.findAll({ skip: 0, limit: 3 });
    expect(result.devreler).toHaveLength(3);
    expect(result.total).toBe(5);
  });
});

// ─── FIND BY ID ──────────────────────────────────────────────────────────────
describe('devreRepository.findById', () => {

  it('var olan ID → devre dönmeli', async () => {
    const d = await mkDevre();
    const found = await devreRepository.findById(d._id);
    expect(found).not.toBeNull();
    expect(found._id.toString()).toBe(d._id.toString());
  });

  it('yanlış ID → null dönmeli', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const found = await devreRepository.findById(fakeId);
    expect(found).toBeNull();
  });
});

// ─── FIND BY NAME ────────────────────────────────────────────────────────────
describe('devreRepository.findByName', () => {

  it('var olan isim → devre dönmeli', async () => {
    await mkDevre('Adıma Göre');
    const found = await devreRepository.findByName('Adıma Göre');
    expect(found).not.toBeNull();
    expect(found.devreName).toBe('Adıma Göre');
  });

  it('yok olan isim → null dönmeli', async () => {
    const found = await devreRepository.findByName('Yok Olan');
    expect(found).toBeNull();
  });
});

// ─── DELETE BY ID ─────────────────────────────────────────────────────────────
describe('devreRepository.deleteById', () => {

  it('var olan devre silinmeli', async () => {
    const d = await mkDevre();
    await devreRepository.deleteById(d._id);
    expect(await Devre.findById(d._id)).toBeNull();
  });

  it('yok olan ID → null dönmeli (hata fırlatmaz)', async () => {
    const result = await devreRepository.deleteById(new mongoose.Types.ObjectId());
    expect(result).toBeNull();
  });
});

// ─── DEVRE AD DEĞİŞTİR ────────────────────────────────────────────────────────
describe('devreRepository.devreAdDegistir', () => {

  it('isim güncellenmeli', async () => {
    const d = await mkDevre('Eski Ad');
    const updated = await devreRepository.devreAdDegistir(d._id, 'Yeni Ad');
    expect(updated.devreName).toBe('Yeni Ad');
  });

  it('minlength kısıtlaması çalışmalı', async () => {
    const d = await mkDevre('Geçerli Ad');
    await expect(devreRepository.devreAdDegistir(d._id, 'AB')).rejects.toThrow();
  });
});

// ─── DEVRE EKİP BAŞI DEĞİŞ ────────────────────────────────────────────────────
describe('devreRepository.devreEkipBasiDegistir', () => {

  it('ekip başı güncellenmeli', async () => {
    const d = await mkDevre();
    const userId = new mongoose.Types.ObjectId();
    const updated = await devreRepository.devreEkipBasiDegistir(d._id, userId);
    expect(updated.devreEkipBasi.toString()).toBe(userId.toString());
  });
});

// ─── DEVRE EKİP BAŞI YARDIMCI DEĞİŞ ──────────────────────────────────────────
describe('devreRepository.devreEkipBasiYardimciDegistir', () => {

  it('yardımcı güncellenmeli', async () => {
    const d = await mkDevre();
    const userId = new mongoose.Types.ObjectId();
    const updated = await devreRepository.devreEkipBasiYardimciDegistir(d._id, userId);
    expect(updated.devreEkipBasiYardimcisi.toString()).toBe(userId.toString());
  });
});

// ─── EKİP EKLE / ÇIKAR ────────────────────────────────────────────────────────
describe('devreRepository.ekipEkle / ekipCikar', () => {

  it('ekip eklenmeli → ekipler listesinde', async () => {
    const d = await mkDevre();
    const ekipId = new mongoose.Types.ObjectId();
    const updated = await devreRepository.ekipEkle(d._id, ekipId);
    expect(updated.ekipler.map(e => e.toString())).toContain(ekipId.toString());
    expect(updated.ekipSayisi).toBe(1);
  });

  it('$addToSet → aynı ekip iki kez eklenmemeli', async () => {
    const d = await mkDevre();
    const ekipId = new mongoose.Types.ObjectId();
    await devreRepository.ekipEkle(d._id, ekipId);
    await devreRepository.ekipEkle(d._id, ekipId); // tekrar ekle
    const db = await Devre.findById(d._id);
    expect(db.ekipler).toHaveLength(1);
  });

  it('ekip çıkarılmalı → ekipler listesinde olmayacak', async () => {
    const d = await mkDevre();
    const ekipId = new mongoose.Types.ObjectId();
    await devreRepository.ekipEkle(d._id, ekipId);
    const updated = await devreRepository.ekipCikar(d._id, ekipId);
    expect(updated.ekipler.map(e => e.toString())).not.toContain(ekipId.toString());
    expect(updated.ekipSayisi).toBe(0);
  });
});

// ─── İZCİ SAYISI GÜNCELLE ─────────────────────────────────────────────────────
describe('devreRepository.izciSayisiGuncelle', () => {

  it('+1 artırmalı', async () => {
    const d = await mkDevre();
    const updated = await devreRepository.izciSayisiGuncelle(d._id, 1);
    expect(updated.izciSayisi).toBe(1);
  });

  it('-1 azaltmalı', async () => {
    const d = await mkDevre();
    await devreRepository.izciSayisiGuncelle(d._id, 3);
    const updated = await devreRepository.izciSayisiGuncelle(d._id, -1);
    expect(updated.izciSayisi).toBe(2);
  });
});

// ─── EKİP SAYISI GÜNCELLE (Senkronizasyon) ────────────────────────────────────
describe('devreRepository.ekipSayisiGuncelle', () => {

  it('gerçek ekip sayısıyla senkronize etmeli', async () => {
    const d = await mkDevre();
    const e1 = new mongoose.Types.ObjectId();
    const e2 = new mongoose.Types.ObjectId();
    await devreRepository.ekipEkle(d._id, e1);
    await devreRepository.ekipEkle(d._id, e2);
    // ekipSayisi şu an 2, ama forcibly 0'a çek
    await Devre.findByIdAndUpdate(d._id, { $set: { ekipSayisi: 0 } });
    const synced = await devreRepository.ekipSayisiGuncelle(d._id);
    expect(synced.ekipSayisi).toBe(2);
  });

  it('yok olan ID → null dönmeli', async () => {
    const result = await devreRepository.ekipSayisiGuncelle(new mongoose.Types.ObjectId());
    expect(result).toBeNull();
  });
});

// ─── DURUM DEĞİŞ ─────────────────────────────────────────────────────────────
describe('devreRepository.durumDegis', () => {

  it('Okul → Mezun dönüşümü', async () => {
    const d = await mkDevre('Durum Devre', 'Okul');
    const updated = await devreRepository.durumDegis(d._id, 'Mezun');
    expect(updated.devreType).toBe('Mezun');
  });

  it('Mezun → Okul dönüşümü', async () => {
    const d = await mkDevre('Geri Devre', 'Mezun');
    const updated = await devreRepository.durumDegis(d._id, 'Okul');
    expect(updated.devreType).toBe('Okul');
  });
});
