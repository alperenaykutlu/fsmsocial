import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import EtkinlikRepository from '../etkinlikRepository.js';
import Etkinlik from '../../models/posts/etkinlik.js';
import User from '../../models/user/user.js';
import { connectTestDB, closeTestDB, clearTestDB } from '../../test/db.js';

beforeAll(async () => await connectTestDB());
afterAll(async () => await closeTestDB());
beforeEach(async () => await clearTestDB());

describe('EtkinlikRepository Tests', () => {

  it('updateRsvp should successfully mark user as attending and save to DB', async () => {
    // 1. Create a fake user
    const user = new User({
      name: "Test",
      surname: "RSVP",
      username: "user_rsvp",
      password: "Password123",
      posta: "rsvp@test",
      tckimlik: "11122233355",
      dogumYeri: "Ankara",
      dogumTarihi: new Date(),
      adres: "Adres",
      nufusaKayitliOlduguSehir: "Ankara",
      telNO: "05554443322",
      kanGrubu: "A Rh -"
    });
    await user.save();

    // 2. Create a fake etkinlik
    const etkinlik = new Etkinlik({
      name: "Orman Kampı",
      caption: "Hafta sonu",
      type: "etkinlik",
      user: user._id
    });
    await etkinlik.save();

    // 3. Attempt to update RSVP
    // This will throw ReferenceError: Post is not defined because the method uses "Post" instead of "Etkinlik"
    // Also it's a static method wrapped inside an instance export!
    const result = await EtkinlikRepository.constructor.updateRsvp(etkinlik._id.toString(), user._id.toString(), 'going');

    // 4. Expect success
    expect(result.katilimcilar).toContainEqual(user._id);
  });

});
