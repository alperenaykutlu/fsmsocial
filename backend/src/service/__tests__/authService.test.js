import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import AuthService from '../authService.js';
import User from '../../models/user/user.js';
import { connectTestDB, closeTestDB, clearTestDB } from '../../test/db.js';

beforeAll(async () => await connectTestDB());
afterAll(async () => await closeTestDB());
beforeEach(async () => await clearTestDB());

describe('AuthService Tests', () => {

  it('Register should successfully return tokens without crashing', async () => {
    const dto = {
      name: "Test",
      surname: "Kullanici",
      username: "testuser123",
      posta: "test@domain.com",
      password: "Password123",
      tckimlik: "12345678901",
      dogumYeri: "Istanbul",
      dogumTarihi: new Date(),
      adres: "Test adres",
      nufusaKayitliOlduguSehir: "Istanbul",
      telNO: "05554443322",
      kanGrubu: "A Rh +"
    };

    // This is expected to crash because `accessToken` is undefined in the return structure!
    const result = await AuthService.register(dto, "127.0.0.1");

    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(result.user).toHaveProperty('username', 'testuser123');
  });

  it('Login should successfully find a user by their username and return tokens', async () => {
    // 1. Create a raw user in DB
    const user = new User({
      name: "Log",
      surname: "In",
      username: "logintest",
      posta: "login@test.com",
      password: "Password123!",
      tckimlik: "11122233344",
      dogumYeri: "Ankara",
      dogumTarihi: new Date(),
      adres: "Ankara Test",
      nufusaKayitliOlduguSehir: "Ankara",
      telNO: "05554443322",
      kanGrubu: "0 Rh +"
    });
    // In actual implementation pre("save") hashes it!
    await user.save();

    // 2. Attempt login
    // This is expected to crash because login accepts {email, password} but searches {username}
    const result = await AuthService.login({ email: "login@test.com", password: "Password123!" }, "127.0.0.1");

    expect(result).toHaveProperty('accessToken');
  });

});
