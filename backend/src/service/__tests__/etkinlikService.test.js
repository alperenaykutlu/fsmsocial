import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import EtkinlikService from '../etkinlikService.js';
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

const mkUser = async (overrides = {}) => User.create({ name: 'Test', surname: 'User', username: 'u_' + Date.now() + Math.random(), posta: Math.random() + '@x.com', password: 'Password123!', sifreHash: 'hash', tip: 'İzci', tckimlik: Date.now().toString(), dogumYeri: 'Ankara', dogumTarihi: new Date(), adres: 'Mahalle', nufusaKayitliOlduguSehir: 'Ankara', telNO: '5554443322', kanGrubu: '0 Rh +', ...overrides });

const mkEtkinlikDto = (overrides = {}) => ({
  name: 'Yaz Kampı',
  caption: 'Harika bir kamp',
  type: 'Kamp',
  location: 'Abant',
  date: new Date(Date.now() + 86400000 * 7),
  lastDate: new Date(Date.now() + 86400000 * 5),
  kontenjan: 20,
  konaklamaType: 'Çadır',
  neKadarSureli: 'Günübirlik',
  hedefKitle: 'Herkes',
  ...overrides,
});

const mkDurumDto = (overrides = {}) => ({
  name: 'Bugün toplantı var!',
  caption: 'Saat 14:00',
  type: 'Durum',
  ...overrides,
});

const createEtkinlik = async (user, dto) => {
  return await EtkinlikService.createEtkinlik(dto ?? mkEtkinlikDto(), user, '127.0.0.1');
};

// ─── CREATE ETKİNLİK ─────────────────────────────────────────────────────────
describe('EtkinlikService.createEtkinlik', () => {

  it('etkinlik tipiyle oluşturma başarılı → DB\'de kayıtlı', async () => {
    const user = await mkUser();
    const result = await createEtkinlik(user);
    expect(result).toHaveProperty('_id');
    expect(result.name).toBe('Yaz Kampı');
    expect(result.type).toBe('Kamp');
    expect(result.user.toString()).toBe(user._id.toString());
  });

  it('durum tipiyle oluşturma başarılı → etkinliğe özgü alanlar boş', async () => {
    const user = await mkUser();
    const result = await EtkinlikService.createEtkinlik(mkDurumDto(), user, '127.0.0.1');
    expect(result.type).toBe('Durum');
    expect(result.location).toBeUndefined();
    expect(result.date).toBeUndefined();
  });

  it('etkinlik tipi "Kamp" → tüm alanlar kaydedilmeli', async () => {
    const user = await mkUser();
    const dto = mkEtkinlikDto({ type: 'Kamp', kontenjan: 15 });
    const result = await EtkinlikService.createEtkinlik(dto, user, '127.0.0.1');
    expect(result.kontenjan).toBe(15);
    expect(result.location).toBe('Abant');
  });

  it('user._id doğru atanmalı', async () => {
    const user = await mkUser();
    const result = await createEtkinlik(user);
    expect(result.user.toString()).toBe(user._id.toString());
  });

  it('katilimcilar başlangıçta boş olmalı', async () => {
    const user = await mkUser();
    const result = await createEtkinlik(user, mkEtkinlikDto({ type: 'Kamp' }));
    expect(result.katilimcilar).toHaveLength(0);
  });
});

// ─── GET ALL ETKİNLİKLER ─────────────────────────────────────────────────────
describe('EtkinlikService.getAllEtkinlikler', () => {

  it('boş DB → boş sonuç', async () => {
    const result = await EtkinlikService.getAllEtkinlikler({ page: 1, limit: 10 });
    expect(result.etkinlikler).toHaveLength(0);
    expect(result.totalEtkinlik).toBe(0);
  });

  it('3 etkinlik → hepsi dönmeli', async () => {
    const user = await mkUser();
    await createEtkinlik(user, mkDurumDto({ name: 'Durum 1' }));
    await createEtkinlik(user, mkDurumDto({ name: 'Durum 2' }));
    await createEtkinlik(user, mkDurumDto({ name: 'Durum 3' }));
    const result = await EtkinlikService.getAllEtkinlikler({ page: 1, limit: 10 });
    expect(result.totalEtkinlik).toBe(3);
    expect(result.currentPage).toBe(1);
  });

  it('sayfalama çalışmalı → limit 2, page 2 → 1 kayıt', async () => {
    const user = await mkUser();
    for (let i = 1; i <= 3; i++) {
      await createEtkinlik(user, mkDurumDto({ name: `Durum ${i}` }));
    }
    const result = await EtkinlikService.getAllEtkinlikler({ page: 2, limit: 2 });
    expect(result.etkinlikler).toHaveLength(1);
    expect(result.totalPage).toBe(2);
  });
});

// ─── GET USER ETKİNLİKLERİ ───────────────────────────────────────────────────
describe('EtkinlikService.getUserEtkinlikleri', () => {

  it('kullanıcıya ait etkinlikler listelenmeli', async () => {
    const user1 = await mkUser();
    const user2 = await mkUser({ username: 'user2' });
    await createEtkinlik(user1, mkDurumDto({ name: 'U1 Durum' }));
    await createEtkinlik(user2, mkDurumDto({ name: 'U2 Durum' }));
    const result = await EtkinlikService.getUserEtkinlikleri(user1._id);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('U1 Durum');
  });

  it('etkinliği olmayan kullanıcı → boş dizi', async () => {
    const result = await EtkinlikService.getUserEtkinlikleri(new mongoose.Types.ObjectId());
    expect(result).toHaveLength(0);
  });
});

// ─── DELETE ETKİNLİK ─────────────────────────────────────────────────────────
describe('EtkinlikService.deleteEtkinlik', () => {

  it('sahibi olan kullanıcı silebilmeli', async () => {
    const user = await mkUser();
    const etkinlik = await createEtkinlik(user, mkDurumDto());
    await EtkinlikService.deleteEtkinlik(etkinlik._id.toString(), user, '127.0.0.1');
    expect(await Etkinlik.findById(etkinlik._id)).toBeNull();
  });

  it('farklı kullanıcı silemez → FORBIDDEN (403)', async () => {
    const owner = await mkUser();
    const other = await mkUser({ username: 'other' });
    const etkinlik = await createEtkinlik(owner, mkDurumDto());
    // user._id karşılaştırması → other'ın _id'si owner'ınkinden farklı
    await expect(
      EtkinlikService.deleteEtkinlik(etkinlik._id.toString(), other, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'FORBIDDEN', statusCode: 403 });
  });

  it('yok olan etkinlik → NOT_FOUND (404)', async () => {
    const user = await mkUser();
    const fakeId = new mongoose.Types.ObjectId();
    await expect(
      EtkinlikService.deleteEtkinlik(fakeId.toString(), user, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'NOT_FOUND', statusCode: 404 });
  });
});

// ─── KATILIMCı EKLE ──────────────────────────────────────────────────────────
describe('EtkinlikService.katilimciEkle', () => {

  it('etkinliğe katılım başarılı → katilimcilar içinde', async () => {
    const creator = await mkUser();
    const katilimci = await mkUser({ username: 'katilimci' });
    const etkinlik = await createEtkinlik(creator, mkEtkinlikDto({ type: 'Kamp', kontenjan: null }));
    const result = await EtkinlikService.katilimciEkle(etkinlik._id.toString(), katilimci, '127.0.0.1');
    const ids = result.katilimcilar.map(k => k.toString());
    expect(ids).toContain(katilimci._id.toString());
  });

  it('"Durum" tipine katılımcı eklenemez → INVALID_OPERATION (400)', async () => {
    const creator = await mkUser();
    const katilimci = await mkUser({ username: 'kullanici2' });
    const durum = await createEtkinlik(creator, mkDurumDto());
    await expect(
      EtkinlikService.katilimciEkle(durum._id.toString(), katilimci, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'INVALID_OPERATION', statusCode: 400 });
  });

  it('aynı kullanıcı iki kez katılamaz → ALREADY_EXISTS (400)', async () => {
    const creator = await mkUser();
    const katilimci = await mkUser({ username: 'kullanici3' });
    const etkinlik = await createEtkinlik(creator, mkEtkinlikDto({ type: 'Kamp', kontenjan: null }));
    await EtkinlikService.katilimciEkle(etkinlik._id.toString(), katilimci, '127.0.0.1');
    await expect(
      EtkinlikService.katilimciEkle(etkinlik._id.toString(), katilimci, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'ALREADY_EXISTS', statusCode: 400 });
  });

  it('kontenjan dolunca → CAPACITY_FULL (400)', async () => {
    const creator = await mkUser();
    const etkinlik = await createEtkinlik(creator, mkEtkinlikDto({ type: 'Kamp', kontenjan: 1 }));
    const user1 = await mkUser({ username: 'user1' });
    const user2 = await mkUser({ username: 'user2' });
    await EtkinlikService.katilimciEkle(etkinlik._id.toString(), user1, '127.0.0.1');
    await expect(
      EtkinlikService.katilimciEkle(etkinlik._id.toString(), user2, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'CAPACITY_FULL', statusCode: 400 });
  });

  it('kontenjan null ise sınırsız katılımcı eklenebilmeli', async () => {
    const creator = await mkUser();
    const etkinlik = await createEtkinlik(creator, mkEtkinlikDto({ type: 'Kamp', kontenjan: null }));
    for (let i = 0; i < 5; i++) {
      await EtkinlikService.katilimciEkle(etkinlik._id.toString(), await mkUser({ username: `kullanici${i}` }), '127.0.0.1');
    }
    const db = await Etkinlik.findById(etkinlik._id);
    expect(db.katilimcilar).toHaveLength(5);
  });

  it('yok olan etkinlik → NOT_FOUND (404)', async () => {
    await expect(
      EtkinlikService.katilimciEkle(new mongoose.Types.ObjectId().toString(), await mkUser(), '127.0.0.1')
    ).rejects.toMatchObject({ code: 'NOT_FOUND', statusCode: 404 });
  });
});

// ─── KATILIMCı ÇIKAR ─────────────────────────────────────────────────────────
describe('EtkinlikService.katilimciCikar', () => {

  it('katılan kullanıcı ayrılabilmeli', async () => {
    const creator = await mkUser();
    const katilimci = await mkUser({ username: 'cikar1' });
    const etkinlik = await createEtkinlik(creator, mkEtkinlikDto({ type: 'Kamp', kontenjan: null }));
    await EtkinlikService.katilimciEkle(etkinlik._id.toString(), katilimci, '127.0.0.1');
    const result = await EtkinlikService.katilimciCikar(etkinlik._id.toString(), katilimci, '127.0.0.1');
    const ids = result.katilimcilar.map(k => k.toString());
    expect(ids).not.toContain(katilimci._id.toString());
  });

  it('katılmayan kullanıcı çıkamaz → NOT_FOUND (400)', async () => {
    const creator = await mkUser();
    const stranger = await mkUser({ username: 'stranger' });
    const etkinlik = await createEtkinlik(creator, mkEtkinlikDto({ type: 'Kamp', kontenjan: null }));
    await expect(
      EtkinlikService.katilimciCikar(etkinlik._id.toString(), stranger, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'NOT_FOUND', statusCode: 400 });
  });

  it('yok olan etkinlik → NOT_FOUND (404)', async () => {
    await expect(
      EtkinlikService.katilimciCikar(new mongoose.Types.ObjectId().toString(), await mkUser(), '127.0.0.1')
    ).rejects.toMatchObject({ code: 'NOT_FOUND', statusCode: 404 });
  });
});
