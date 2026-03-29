import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import DevreService from '../devreService.js';
import Devre from '../../models/devre/devre.js';
import User from '../../models/user/user.js'; // ← ekle, populate için gerekli
import { connectTestDB, closeTestDB, clearTestDB } from '../../test/db.js';

beforeAll(async () => await connectTestDB());
afterAll(async () => await closeTestDB());
beforeEach(async () => await clearTestDB());

describe('DevreService Tests', () => {

  it('devreDurumDegis should correctly change status without crashing', async () => {
    const devre = new Devre({
      devreName: "Test Devresi",
      devreType: "Mezun",
    });
    await devre.save();

    await DevreService.devreDurumDegis({
      devreId: devre._id.toString(),
      durum: "Okul"
    });

    const updated = await Devre.findById(devre._id);
    expect(updated.devreType).toBe("Okul"); // servis "Okul" yazıyorsa "Okul" bekle
  });

});