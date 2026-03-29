import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import AuthService from '../authService.js';
import User from '../../models/user/user.js';
import { connectTestDB, closeTestDB, clearTestDB } from '../../test/db.js';

beforeAll(async () => await connectTestDB());
afterAll(async () => await closeTestDB());
beforeEach(async () => await clearTestDB());

// ─── Yardımcı: geçerli kullanıcı DTO'su ────────────────────────────────────
const makeUserDto = (overrides = {}) => ({
  name: 'Test',
  surname: 'Kullanici',
  username: 'testuser1',
  posta: 'test@domain.com',
  password: 'Password123!',
  tckimlik: '12345678901',
  dogumYeri: 'Istanbul',
  dogumTarihi: new Date('2000-01-01'),
  adres: 'Test Mah. No:1',
  nufusaKayitliOlduguSehir: 'Istanbul',
  telNO: '05554443322',
  kanGrubu: 'A Rh +',
  ...overrides,
});

// ─── REGISTER ───────────────────────────────────────────────────────────────
describe('AuthService.register', () => {

  it('başarılı kayıt → accessToken, refreshToken ve user dönmeli', async () => {
    const result = await AuthService.register(makeUserDto(), '127.0.0.1');
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(result.user).toMatchObject({ username: 'testuser1' });
    expect(result.user).toHaveProperty('id');
    expect(result.user).toHaveProperty('profileImg');
  });

  it('DB\'ye kaydedilmeli ve şifre hash\'lenmiş olmalı', async () => {
    const dto = makeUserDto();
    await AuthService.register(dto, '127.0.0.1');
    const dbUser = await User.findOne({ username: dto.username });
    expect(dbUser).not.toBeNull();
    expect(dbUser.password).not.toBe(dto.password); // hash'lendi
  });

  it('refreshToken DB\'ye yazılmalı', async () => {
    const dto = makeUserDto();
    const result = await AuthService.register(dto, '127.0.0.1');
    const dbUser = await User.findOne({ username: dto.username });
    expect(dbUser.refreshToken).toBe(result.refreshToken);
  });

  it('profileImg otomatik dicebear URL\'i olmalı', async () => {
    const result = await AuthService.register(makeUserDto(), '127.0.0.1');
    expect(result.user.profileImg).toContain('dicebear');
    expect(result.user.profileImg).toContain('testuser1');
  });

  it('aynı username ile ikinci kayıt → DUPLICATE_ENTRY hatası', async () => {
    await AuthService.register(makeUserDto(), '127.0.0.1');
    await expect(
      AuthService.register(makeUserDto({ posta: 'other@x.com', tckimlik: '99988877766' }), '127.0.0.1')
    ).rejects.toMatchObject({ code: 'DUPLICATE_ENTRY', statusCode: 400 });
  });

  it('aynı TC Kimlik ile ikinci kayıt → DUPLICATE_ENTRY hatası', async () => {
    await AuthService.register(makeUserDto(), '127.0.0.1');
    await expect(
      AuthService.register(makeUserDto({ username: 'digeruser', posta: 'other2@x.com' }), '127.0.0.1')
    ).rejects.toMatchObject({ code: 'DUPLICATE_ENTRY', statusCode: 400 });
  });
});

// ─── LOGIN ───────────────────────────────────────────────────────────────────
describe('AuthService.login', () => {

  beforeEach(async () => {
    await AuthService.register(makeUserDto(), '127.0.0.1');
  });

  it('doğru kimliklerle giriş → token çifti dönmeli', async () => {
    const result = await AuthService.login(
      { username: 'testuser1', password: 'Password123!' },
      '127.0.0.1'
    );
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(result.user.username).toBe('testuser1');
  });

  it('yanlış şifre → INVALID_CREDENTIALS (401)', async () => {
    await expect(
      AuthService.login({ username: 'testuser1', password: 'YANLIS123!' }, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS', statusCode: 401 });
  });

  it('var olmayan kullanıcı adı → INVALID_CREDENTIALS (401)', async () => {
    await expect(
      AuthService.login({ username: 'yokUser', password: 'Password123!' }, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS', statusCode: 401 });
  });

  it('login sonrası refreshToken DB\'de güncellenmeli', async () => {
    const result = await AuthService.login(
      { username: 'testuser1', password: 'Password123!' },
      '127.0.0.1'
    );
    const dbUser = await User.findOne({ username: 'testuser1' });
    expect(dbUser.refreshToken).toBe(result.refreshToken);
  });
});

// ─── REFRESH TOKEN ────────────────────────────────────────────────────────────
describe('AuthService.refreshTok', () => {

  it('geçerli refresh token → yeni token çifti', async () => {
    const reg = await AuthService.register(makeUserDto(), '127.0.0.1');
    const result = await AuthService.refreshTok(reg.refreshToken);
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
  });

  it('null token → MISSING_TOKEN (401)', async () => {
    await expect(AuthService.refreshTok(null)).rejects.toMatchObject({
      code: 'MISSING_TOKEN',
      statusCode: 401,
    });
  });

  it('geçersiz / tampered token → hata fırlatmalı', async () => {
    await expect(AuthService.refreshTok('tampered.jwt.token')).rejects.toThrow();
  });

  it('eski token (rotation sonrası) → INVALID_TOKEN (401)', async () => {
    const reg = await AuthService.register(makeUserDto(), '127.0.0.1');
    const oldToken = reg.refreshToken;
    // wait 1.1s so JWT iat (second precision) differs → different token
    await new Promise(r => setTimeout(r, 1100));
    await AuthService.refreshTok(oldToken); // rotate → DB güncellendi
    await expect(AuthService.refreshTok(oldToken)).rejects.toMatchObject({
      code: 'INVALID_TOKEN',
      statusCode: 401,
    });
  });
});

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
describe('AuthService.logout', () => {

  it('logout sonrası refreshToken null olmalı', async () => {
    const reg = await AuthService.register(makeUserDto(), '127.0.0.1');
    const dbUser = await User.findOne({ username: 'testuser1' });
    await AuthService.logout(dbUser._id);
    const after = await User.findById(dbUser._id);
    expect(after.refreshToken).toBeNull();
  });
});

// ─── PROFİL TAMAMLA ───────────────────────────────────────────────────────────
describe('AuthService.profilTamamla', () => {

  let userId;
  beforeEach(async () => {
    const reg = await AuthService.register(makeUserDto(), '127.0.0.1');
    userId = reg.user.id;
  });

  const profilDto = () => ({
    tckimlik: '99988877766',
    dogumYeri: 'Ankara',
    dogumTarihi: new Date('1998-05-15'),
    adres: 'Ankara Mah.',
    nufusaKayitliOlduguSehir: 'Ankara',
    telNO: '05001112233',
    kanGrubu: '0 Rh +',
    cinsiyet: 'Erkek',
    tip: 'İzci',
  });

  it('başarılı profil tamamlama → { profilTamamlandi: true }', async () => {
    const result = await AuthService.profilTamamla(userId, profilDto(), '127.0.0.1');
    expect(result).toEqual({ profilTamamlandi: true });
    const dbUser = await User.findById(userId);
    expect(dbUser.profilTamamlandi).toBe(true);
  });

  it('zaten tamamlanmış profil → ALREADY_COMPLETED (400)', async () => {
    // İlk tamamlama — farklı bir TC kullanarak
    await AuthService.profilTamamla(userId, profilDto(), '127.0.0.1');
    // İkinci tamamlama girişimi — farklı bir TC verseniz bile ALREADY_COMPLETED döner
    await expect(
      AuthService.profilTamamla(userId, { ...profilDto(), tckimlik: '55566677788' }, '127.0.0.1')
    ).rejects.toMatchObject({ code: 'ALREADY_COMPLETED', statusCode: 400 });
  });

  it('yanlış userId → NOT_FOUND (404)', async () => {
    const { Types } = await import('mongoose');
    const fakeId = new Types.ObjectId();
    await expect(
      AuthService.profilTamamla(fakeId, profilDto(), '127.0.0.1')
    ).rejects.toMatchObject({ code: 'NOT_FOUND', statusCode: 404 });
  });

  it('başka kullanıcının TC\'si → DUPLICATE_ENTRY (400)', async () => {
    // İkinci kullanıcıyı zaten TC ile register ediyoruz
    const tc = '55544433322';
    const dto2 = makeUserDto({ username: 'user2', posta: 'u2@x.com', tckimlik: tc });
    await AuthService.register(dto2, '127.0.0.1');

    // Birinci kullanıcı (userId) bu TC'yi kullanmaya çalışıyor
    await expect(
      AuthService.profilTamamla(userId, { ...profilDto(), tckimlik: tc }, '127.0.0.1')
    ).rejects.toThrow('zaten kayıtlı');
  });
});