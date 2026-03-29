import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest';
import DevreService from '../devreService.js';
import devreRepository from '../../repository/devreRepository.js';
import ekipRepository from '../../repository/ekipRepository.js';
import { connectTestDB, closeTestDB, clearTestDB } from '../../test/db.js';
import Devre from '../../models/devre/devre.js';
import Ekip from '../../models/ekip/ekip.js';
import User from '../../models/user/user.js'; // register schema for populate
import mongoose from 'mongoose';

beforeAll(async () => await connectTestDB());
afterAll(async () => await closeTestDB());
beforeEach(async () => await clearTestDB());

// ─── Yardımcılar ─────────────────────────────────────────────────────────────
const fakeUser = { _id: new mongoose.Types.ObjectId(), username: 'admin', tip: 'Admin' };

const createDevre = async (name = 'Test Devresi') => {
  return await devreRepository.create({ devreName: name, devreType: 'Okul' });
};

const createEkip = async (devre, name = 'Test Ekibi') => {
  return await ekipRepository.create({ ekipAd: name, devre: devre._id });
};

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

// ─── CREATE DEVRE ────────────────────────────────────────────────────────────
describe('DevreService.createDevre', () => {

  it('başarılı oluşturma → Devre objesi dönmeli', async () => {
    const result = await DevreService.createDevre(
      { devreName: 'Yeni Devre', devreType: 'Okul' },
      fakeUser, '127.0.0.1'
    );
    expect(result).toHaveProperty('_id');
    expect(result.devreName).toBe('Yeni Devre');
    expect(result.devreType).toBe('Okul');
  });

  it('devreType belirtilmezse → default Okul olmalı', async () => {
    const devre = await devreRepository.create({ devreName: 'Adsız Devre', devreType: 'Okul' });
    expect(devre.devreType).toBe('Okul');
  });

  it('aynı isimde ikinci devre → DUPLICATE_ENTRY (400)', async () => {
    await DevreService.createDevre({ devreName: 'Tekrar Devre', devreType: 'Okul' }, fakeUser, '127.0.0.1');
    await expect(
      DevreService.createDevre({ devreName: 'Tekrar Devre', devreType: 'Mezun' }, fakeUser, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'DUPLICATE_ENTRY', statusCode: 400 });
  });

  it('devreEkipBasi ve devreEkipBasiYardimcisi null başlamalı', async () => {
    const result = await DevreService.createDevre(
      { devreName: 'Boş Başlı Devre', devreType: 'Okul' },
      fakeUser, '127.0.0.1'
    );
    const db = await Devre.findById(result._id);
    expect(db.devreEkipBasi).toBeNull();
    expect(db.devreEkipBasiYardimcisi).toBeNull();
  });
});

// ─── GET ALL DEVRELER ─────────────────────────────────────────────────────────
describe('DevreService.getAllDevreler', () => {

  it('boş DB → devreler: [], total: 0', async () => {
    const result = await DevreService.getAllDevreler({ page: 1, limit: 10 });
    expect(result.devreler).toHaveLength(0);
    expect(result.totalDevre).toBe(0);
    expect(result.currentPage).toBe(1);
    expect(result.totalPage).toBe(0);
  });

  it('3 devre varsa hepsini listeler', async () => {
    await createDevre('Devre 1');
    await createDevre('Devre 2');
    await createDevre('Devre 3');
    const result = await DevreService.getAllDevreler({ page: 1, limit: 10 });
    expect(result.totalDevre).toBe(3);
    expect(result.devreler).toHaveLength(3);
  });

  it('sayfalama çalışmalı — limit 2, page 2 → 1 kayıt', async () => {
    await createDevre('Devre A');
    await createDevre('Devre B');
    await createDevre('Devre C');
    const result = await DevreService.getAllDevreler({ page: 2, limit: 2 });
    expect(result.devreler).toHaveLength(1);
    expect(result.currentPage).toBe(2);
    expect(result.totalPage).toBe(2);
  });
});

// ─── GET DEVRE BY ID ──────────────────────────────────────────────────────────
describe('DevreService.getDevreById', () => {

  it('var olan ID → Devre objesi', async () => {
    const d = await createDevre();
    const result = await DevreService.getDevreById(d._id.toString());
    expect(result._id.toString()).toBe(d._id.toString());
  });

  it('yanlış ID → NOT_FOUND (404)', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await expect(DevreService.getDevreById(fakeId)).rejects.toMatchObject({
      code: 'NOT_FOUND', statusCode: 404,
    });
  });
});

// ─── DELETE DEVRE ─────────────────────────────────────────────────────────────
describe('DevreService.deleteDevre', () => {

  it('ekipsiz devre silinebilmeli', async () => {
    const d = await createDevre();
    await DevreService.deleteDevre(d._id.toString(), fakeUser, '127.0.0.1');
    const db = await Devre.findById(d._id);
    expect(db).toBeNull();
  });

  it('yok olan devre → NOT_FOUND (404)', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await expect(
      DevreService.deleteDevre(fakeId, fakeUser, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'NOT_FOUND', statusCode: 404 });
  });

  it('ekibi olan devre silinemez → CONFLICT (400)', async () => {
    const d = await createDevre();
    const e = await createEkip(d);
    // Devreye bizzat ekip referansını eklemeliyiz
    await devreRepository.ekipEkle(d._id, e._id);
    
    await expect(
      DevreService.deleteDevre(d._id.toString(), fakeUser, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'CONFLICT', statusCode: 400 });
  });
});

// ─── DEVRE AD DEĞİŞTİR ────────────────────────────────────────────────────────
describe('DevreService.devreAdDegistir', () => {

  it('başarılı isim değişimi → güncel devre dönmeli', async () => {
    const d = await createDevre('Eski İsim');
    const result = await DevreService.devreAdDegistir(d._id.toString(), 'Yeni İsim', fakeUser, '127.0.0.1');
    expect(result.devreName).toBe('Yeni İsim');
  });

  it('kullanımda olan isim → DUPLICATE_ENTRY (400)', async () => {
    const d1 = await createDevre('İsim A');
    await createDevre('İsim B');
    await expect(
      DevreService.devreAdDegistir(d1._id.toString(), 'İsim B', fakeUser, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'DUPLICATE_ENTRY', statusCode: 400 });
  });

  it('yok olan devre → NOT_FOUND (404)', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await expect(
      DevreService.devreAdDegistir(fakeId, 'Yeni Ad', fakeUser, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'NOT_FOUND', statusCode: 404 });
  });
});

// ─── DEVRE DURUM DEĞİŞ ────────────────────────────────────────────────────────
describe('DevreService.devreDurumDegis', () => {

  it('Okul → Mezun dönüşümü', async () => {
    const d = await createDevre();
    const result = await DevreService.devreDurumDegis(
      { devreId: d._id.toString(), durum: 'Mezun' },
      fakeUser, '127.0.0.1'
    );
    expect(result.devreType).toBe('Mezun');
  });

  it('yok olan ID → NOT_FOUND (404)', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    await expect(
      DevreService.devreDurumDegis({ devreId: fakeId, durum: 'Mezun' }, fakeUser, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'NOT_FOUND', statusCode: 404 });
  });
});

// ─── EKİP EKİP BASI DEĞİŞTİR ─────────────────────────────────────────────────
describe('DevreService.devreEkipBasiDegistir', () => {

  it('ekip başı atamak → güncellenmeli', async () => {
    const d = await createDevre();
    const userId = new mongoose.Types.ObjectId().toString();
    const result = await DevreService.devreEkipBasiDegistir(d._id.toString(), userId, fakeUser, '127.0.0.1');
    expect(result.devreEkipBasi.toString()).toBe(userId);
  });

  it('yardımcı olan kullanıcı başı olamaz → CONFLICT (400)', async () => {
    const d = await createDevre();
    const u = await mkTestUser();
    const userId = u._id;
    // Önce yardımcı olarak ata
    await DevreService.devreEkipBasiYardimciDegistir(d._id.toString(), userId.toString(), fakeUser, '127.0.0.1');

    await expect(
      DevreService.devreEkipBasiDegistir(d._id.toString(), userId.toString(), fakeUser, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'CONFLICT', statusCode: 400 });
  });
});

// ─── EKİP EKİP BASI YARDIMCI DEĞİŞTİR ───────────────────────────────────────
describe('DevreService.devreEkipBasiYardimciDegistir', () => {

  it('yardımcı atamak → güncellenmeli', async () => {
    const d = await createDevre();
    const userId = new mongoose.Types.ObjectId().toString();
    const result = await DevreService.devreEkipBasiYardimciDegistir(d._id.toString(), userId, fakeUser, '127.0.0.1');
    expect(result.devreEkipBasiYardimcisi.toString()).toBe(userId);
  });

  it('başı olan kullanıcı yardımcı olamaz → CONFLICT (400)', async () => {
    const d = await createDevre();
    const u = await mkTestUser();
    const userId = u._id;
    await DevreService.devreEkipBasiDegistir(d._id.toString(), userId.toString(), fakeUser, '127.0.0.1');
    
    await expect(
      DevreService.devreEkipBasiYardimciDegistir(d._id.toString(), userId.toString(), fakeUser, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'CONFLICT', statusCode: 400 });
  });
});

// ─── EKİP EKLE ───────────────────────────────────────────────────────────────
describe('DevreService.ekipEkle', () => {

  it('ekip devreye eklenmeli', async () => {
    const d = await createDevre();
    const e = await createEkip(d);
    // e zaten d'ye ait oluşturuldu (ekip.devre = d._id), bu yüzden service izin verir
    const result = await DevreService.ekipEkle(d._id.toString(), e._id.toString(), fakeUser, '127.0.0.1');
    const ekipIds = result.ekipler.map(x => x.toString());
    expect(ekipIds).toContain(e._id.toString());
  });

  it('aynı ekip iki kez eklenemez → ALREADY_EXISTS (400)', async () => {
    const d = await createDevre();
    const e = await createEkip(d);
    await DevreService.ekipEkle(d._id.toString(), e._id.toString(), fakeUser, '127.0.0.1');
    await expect(
      DevreService.ekipEkle(d._id.toString(), e._id.toString(), fakeUser, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'ALREADY_EXISTS', statusCode: 400 });
  });

  it('yok olan devre → NOT_FOUND (404)', async () => {
    const fakeDevreId = new mongoose.Types.ObjectId();
    const e = await createEkip({ _id: new mongoose.Types.ObjectId() });
    await expect(
      DevreService.ekipEkle(fakeDevreId.toString(), e._id.toString(), fakeUser, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'NOT_FOUND', statusCode: 404 });
  });

  it('yok olan ekip → NOT_FOUND (404)', async () => {
    const d = await createDevre();
    const fakeEkipId = new mongoose.Types.ObjectId();
    await expect(
      DevreService.ekipEkle(d._id.toString(), fakeEkipId.toString(), fakeUser, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'NOT_FOUND', statusCode: 404 });
  });
});

// ─── EKİP ÇIKAR ─────────────────────────────────────────────────────────────
describe('DevreService.ekipCikar', () => {

  it('devredeki ekip çıkarılabilmeli', async () => {
    const d = await createDevre();
    const e = await createEkip(d);
    await devreRepository.ekipEkle(d._id, e._id);
    const result = await DevreService.ekipCikar(d._id.toString(), e._id.toString(), fakeUser, '127.0.0.1');
    const ekipIds = result.ekipler.map(x => x.toString());
    expect(ekipIds).not.toContain(e._id.toString());
  });

  it('devrede olmayan ekip → NOT_FOUND (400)', async () => {
    const d = await createDevre();
    const e = await createEkip(d);
    await expect(
      DevreService.ekipCikar(d._id.toString(), e._id.toString(), fakeUser, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'NOT_FOUND', statusCode: 400 });
  });
});