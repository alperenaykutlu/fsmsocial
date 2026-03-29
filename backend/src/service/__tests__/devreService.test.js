import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import DevreService from '../devreService.js';
import DevreRepository from '../../repository/devreRepository.js';
import Devre from '../../models/devre/devre.js';
import { connectTestDB, closeTestDB, clearTestDB } from '../../test/db.js';

beforeAll(async () => await connectTestDB());
afterAll(async () => await closeTestDB());
beforeEach(async () => await clearTestDB());

describe('DevreService Tests', () => {

  it('devreDurumDegis should correctly change status without crashing', async () => {
    // 1. Create a dummy Devre in the fake DB directly
    const devre = new Devre({
      devreName: "Test Devresi",
      devreType: "pasif",
    });
    await devre.save();

    // 2. Call the service to update it
    // Expect: crash because of missing await in findById and auditLog user variable
    try {
      await DevreService.devreDurumDegis({
        devreId: devre._id.toString(),
        durum: "aktif"
      });
    } catch (e) {
      // This will throw unexpected ReferenceError instead of custom AppError
      throw e;
    }

    // 3. Verify in DB
    const updated = await Devre.findById(devre._id);
    expect(updated.devreType).toBe("aktif");
  });

});
