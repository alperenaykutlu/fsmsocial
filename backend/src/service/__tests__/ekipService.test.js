import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import EkipService from '../ekipService.js';
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

// ─── Yardımcı fabrikalar ─────────────────────────────────────────────────────
const fakeUser = { _id: new mongoose.Types.ObjectId(), username: 'admin', tip: 'Admin' };

const mkDevre = async (name = 'Ana Devre') =>
  devreRepository.create({ devreName: name, devreType: 'Okul' });

const mkEkip = async (devreId, name = 'Kartal Ekibi') =>
  ekipRepository.create({ ekipAd: name, devre: devreId });

const mkTestUser = async () => {
  return await User.create({
    name: 'Test',
    surname: 'User',
    username: 'u_' + Date.now() + Math.random(),
    posta: Date.now() + Math.random() + '@x.com',
    password: 'Password123!',
    sifreHash: 'hash',
    tip: 'İzci',
    tckimlik: Date.now().toString(),
    dogumYeri: 'Ankara',
    dogumTarihi: new Date(),
    adres: 'Mahalle',
    nufusaKayitliOlduguSehir: 'Ankara',
    telNO: '5554443322',
    kanGrubu: '0 Rh +'
  });
};

// ─── CREATE EKİP ─────────────────────────────────────────────────────────────
describe('EkipService.createEkip', () => {

  it('başarılı oluşturma → Ekip objesi dönmeli', async () => {
    const d = await mkDevre();
    const result = await EkipService.createEkip(
      { ekipAd: 'Kartal Ekibi', devre: d._id },
      fakeUser, '127.0.0.1'
    );
    expect(result).toHaveProperty('_id');
    expect(result.ekipAd).toBe('Kartal Ekibi');
  });

  it('ekipImg verilmezse boş string olmalı', async () => {
    const d = await mkDevre();
    const result = await EkipService.createEkip(
      { ekipAd: 'Boş İmgeli', devre: d._id },
      fakeUser, '127.0.0.1'
    );
    expect(result.ekipImg).toBe('');
  });

  it('ekipBasi ve EkipBasiYardimcisi null başlamalı', async () => {
    const d = await mkDevre();
    const result = await EkipService.createEkip(
      { ekipAd: 'Başsız Ekip', devre: d._id },
      fakeUser, '127.0.0.1'
    );
    const db = await Ekip.findById(result._id);
    expect(db.ekipBasi).toBeNull();
    expect(db.EkipBasiYardimcisi).toBeNull();
  });

  it('aynı isimde ikinci ekip → DUPLICATE_ENTRY (400)', async () => {
    const d = await mkDevre();
    await EkipService.createEkip({ ekipAd: 'Tekrar Ekip', devre: d._id }, fakeUser, '127.0.0.1');
    const d2 = await mkDevre('Devre 2');
    await expect(
      EkipService.createEkip({ ekipAd: 'Tekrar Ekip', devre: d2._id }, fakeUser, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'DUPLICATE_ENTRY', statusCode: 400 });
  });
});

// ─── GET ALL EKİPLER ─────────────────────────────────────────────────────────
describe('EkipService.getAllEkipler', () => {

  it('boş DB → boş liste', async () => {
    const result = await EkipService.getAllEkipler({ page: 1, limit: 10 });
    expect(result.ekipler).toHaveLength(0);
    expect(result.totalEkip).toBe(0);
    expect(result.currentPage).toBe(1);
  });

  it('2 ekip varsa ikisi de listelenmeli', async () => {
    const d = await mkDevre();
    await mkEkip(d._id, 'Ekip A');
    await mkEkip(d._id, 'Ekip B');
    const result = await EkipService.getAllEkipler({ page: 1, limit: 10 });
    expect(result.totalEkip).toBe(2);
    expect(result.ekipler).toHaveLength(2);
  });

  it('sayfalama → limit 1, page 2 → 1 kayıt, totalPage 2', async () => {
    const d = await mkDevre();
    await mkEkip(d._id, 'Sayfa Ekip 1');
    await mkEkip(d._id, 'Sayfa Ekip 2');
    const result = await EkipService.getAllEkipler({ page: 2, limit: 1 });
    expect(result.ekipler).toHaveLength(1);
    expect(result.totalPage).toBe(2);
  });
});

// ─── GET EKİP BY ID ──────────────────────────────────────────────────────────
describe('EkipService.getEkipById', () => {

  it('var olan ID → Ekip objesi', async () => {
    const d = await mkDevre();
    const e = await mkEkip(d._id);
    const result = await EkipService.getEkipById(e._id.toString());
    expect(result._id.toString()).toBe(e._id.toString());
    expect(result.ekipAd).toBe('Kartal Ekibi');
  });

  it('yanlış ID → NOT_FOUND (404)', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await expect(EkipService.getEkipById(fakeId)).rejects.toMatchObject({
      code: 'NOT_FOUND', statusCode: 404,
    });
  });
});

// ─── GET EKİPLER BY DEVRE ────────────────────────────────────────────────────
describe('EkipService.getEkiplerByDevre', () => {

  it('devreye ait ekipler listelenmeli', async () => {
    const d = await mkDevre();
    await mkEkip(d._id, 'Devre Ekip 1');
    await mkEkip(d._id, 'Devre Ekip 2');
    const result = await EkipService.getEkiplerByDevre(d._id.toString());
    expect(result).toHaveLength(2);
  });

  it('farklı devrenin ekibi karışmamalı', async () => {
    const d1 = await mkDevre('Devre 1');
    const d2 = await mkDevre('Devre 2');
    await mkEkip(d1._id, 'D1 Ekip');
    await mkEkip(d2._id, 'D2 Ekip');
    const result = await EkipService.getEkiplerByDevre(d1._id.toString());
    expect(result).toHaveLength(1);
    expect(result[0].ekipAd).toBe('D1 Ekip');
  });

  it('devre boşsa boş dizi dönmeli', async () => {
    const d = await mkDevre();
    const result = await EkipService.getEkiplerByDevre(d._id.toString());
    expect(result).toHaveLength(0);
  });
});

// ─── DELETE EKİP ─────────────────────────────────────────────────────────────
describe('EkipService.deleteEkip', () => {

  it('ekip silinmeli', async () => {
    const d = await mkDevre();
    const e = await mkEkip(d._id);
    await EkipService.deleteEkip(e._id.toString(), fakeUser, '127.0.0.1');
    expect(await Ekip.findById(e._id)).toBeNull();
  });

  it('yok olan ekip → NOT_FOUND (404)', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await expect(
      EkipService.deleteEkip(fakeId, fakeUser, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'NOT_FOUND', statusCode: 404 });
  });
});

// ─── EKİP AD DEĞİŞTİR ────────────────────────────────────────────────────────
describe('EkipService.ekipAdDegistir', () => {

  it('isim başarıyla değişmeli', async () => {
    const d = await mkDevre();
    const e = await mkEkip(d._id, 'Eski Ad Ekip');
    const result = await EkipService.ekipAdDegistir(e._id.toString(), 'Yeni Ad Ekip', fakeUser, '127.0.0.1');
    expect(result.ekipAd).toBe('Yeni Ad Ekip');
  });

  it('kullanımdaki isim → DUPLICATE_ENTRY (400)', async () => {
    const d = await mkDevre();
    const e1 = await mkEkip(d._id, 'Ekip Alpha');
    await mkEkip(d._id, 'Ekip Beta');
    await expect(
      EkipService.ekipAdDegistir(e1._id.toString(), 'Ekip Beta', fakeUser, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'DUPLICATE_ENTRY', statusCode: 400 });
  });

  it('yok olan ekip → NOT_FOUND (404)', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await expect(
      EkipService.ekipAdDegistir(fakeId, 'Herhangi Ad', fakeUser, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'NOT_FOUND', statusCode: 404 });
  });
});

// ─── EKİP BAŞI DEĞİŞTİR ──────────────────────────────────────────────────────
describe('EkipService.ekipBasiDegistir', () => {

  it('ekip başı atanmalı', async () => {
    const d = await mkDevre();
    const e = await mkEkip(d._id);
    const userId = new mongoose.Types.ObjectId().toString();
    const result = await EkipService.ekipBasiDegistir(e._id.toString(), userId, fakeUser, '127.0.0.1');
    expect(result.ekipBasi.toString()).toBe(userId);
  });

  it('aynı kullanıcı başka ekibin başı ise → CONFLICT (400)', async () => {
    const d = await mkDevre();
    const e1 = await mkEkip(d._id, 'Ekip 1');
    const e2 = await mkEkip(d._id, 'Ekip 2');
    const u = await mkTestUser();
    const userId = u._id.toString();
    await EkipService.ekipBasiDegistir(e1._id.toString(), userId, fakeUser, '127.0.0.1');
    await expect(
      EkipService.ekipBasiDegistir(e2._id.toString(), userId, fakeUser, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'CONFLICT', statusCode: 400 });
  });

  it('yok olan ekip → NOT_FOUND (404)', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await expect(
      EkipService.ekipBasiDegistir(fakeId, new mongoose.Types.ObjectId().toString(), fakeUser, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'NOT_FOUND', statusCode: 404 });
  });
});

// ─── EKİP BAŞI YARDIMCI DEĞİŞTİR ─────────────────────────────────────────────
describe('EkipService.ekipBasiYardimciDegistir', () => {

  it('yardımcı atanmalı', async () => {
    const d = await mkDevre();
    const e = await mkEkip(d._id);
    const userId = new mongoose.Types.ObjectId().toString();
    const result = await EkipService.ekipBasiYardimciDegistir(e._id.toString(), userId, fakeUser, '127.0.0.1');
    expect(result.EkipBasiYardimcisi.toString()).toBe(userId);
  });

  it('ekip başı yardımcı olamaz → CONFLICT (400)', async () => {
    const d = await mkDevre();
    const e = await mkEkip(d._id);
    const u = await mkTestUser();
    const userId = u._id;
    // Başı ata
    await ekipRepository.ekipBasiDegistir(e._id, userId);
    await expect(
      EkipService.ekipBasiYardimciDegistir(e._id.toString(), userId.toString(), fakeUser, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'CONFLICT', statusCode: 400 });
  });

  it('yok olan ekip → NOT_FOUND (404)', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await expect(
      EkipService.ekipBasiYardimciDegistir(fakeId, new mongoose.Types.ObjectId().toString(), fakeUser, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'NOT_FOUND', statusCode: 404 });
  });
});

// ─── İZCİ EKLE ───────────────────────────────────────────────────────────────
describe('EkipService.izciEkle', () => {

  it('izci eklenmeli → katilimcilar içinde olmalı', async () => {
    const d = await mkDevre();
    const e = await mkEkip(d._id);
    const izciId = new mongoose.Types.ObjectId().toString();
    const result = await EkipService.izciEkle(e._id.toString(), izciId, fakeUser, '127.0.0.1');
    const ids = result.katilimcilar.map(k => k.toString());
    expect(ids).toContain(izciId);
  });

  it('aynı izci iki kez eklenemez → ALREADY_EXISTS (400)', async () => {
    const d = await mkDevre();
    const e = await mkEkip(d._id);
    const izciId = new mongoose.Types.ObjectId().toString();
    await EkipService.izciEkle(e._id.toString(), izciId, fakeUser, '127.0.0.1');
    await expect(
      EkipService.izciEkle(e._id.toString(), izciId, fakeUser, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'ALREADY_EXISTS', statusCode: 400 });
  });

  it('yok olan ekip → NOT_FOUND (404)', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await expect(
      EkipService.izciEkle(fakeId, new mongoose.Types.ObjectId().toString(), fakeUser, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'NOT_FOUND', statusCode: 404 });
  });
});

// ─── İZCİ ÇIKAR ──────────────────────────────────────────────────────────────
describe('EkipService.izciCikar', () => {

  it('izci çıkarılmalı → katilimcilar içinde olmamalı', async () => {
    const d = await mkDevre();
    const e = await mkEkip(d._id);
    const izciId = new mongoose.Types.ObjectId().toString();
    await EkipService.izciEkle(e._id.toString(), izciId, fakeUser, '127.0.0.1');
    const result = await EkipService.izciCikar(e._id.toString(), izciId, fakeUser, '127.0.0.1');
    const ids = result.katilimcilar.map(k => k.toString());
    expect(ids).not.toContain(izciId);
  });

  it('ekipte olmayan izci çıkarılamaz → NOT_FOUND (400)', async () => {
    const d = await mkDevre();
    const e = await mkEkip(d._id);
    const izciId = new mongoose.Types.ObjectId().toString();
    await expect(
      EkipService.izciCikar(e._id.toString(), izciId, fakeUser, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'NOT_FOUND', statusCode: 400 });
  });

  it('ekip başı çıkarılamaz → CONFLICT (400)', async () => {
    const d = await mkDevre();
    const e = await mkEkip(d._id);
    const u = await mkTestUser();
    const izciId = u._id;
    await ekipRepository.izciEkle(e._id, izciId);
    await ekipRepository.ekipBasiDegistir(e._id, izciId);
    await expect(
      EkipService.izciCikar(e._id.toString(), izciId.toString(), fakeUser, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'CONFLICT', statusCode: 400 });
  });

  it('ekip başı yardımcısı çıkarılamaz → CONFLICT (400)', async () => {
    const d = await mkDevre();
    const e = await mkEkip(d._id);
    const u = await mkTestUser();
    const izciId = u._id;
    await ekipRepository.izciEkle(e._id, izciId);
    await ekipRepository.ekipBasiYardimciDegistir(e._id, izciId);
    await expect(
      EkipService.izciCikar(e._id.toString(), izciId.toString(), fakeUser, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'CONFLICT', statusCode: 400 });
  });

  it('yok olan ekip → NOT_FOUND (404)', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await expect(
      EkipService.izciCikar(fakeId, new mongoose.Types.ObjectId().toString(), fakeUser, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'NOT_FOUND', statusCode: 404 });
  });
});
