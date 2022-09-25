import { bcryptHash, bcryptCompare } from '../../src/util/hash';

describe('Hash util', () => {

  it('should produce a valid bcrypt hash', async () => {
    // hash
    const plainData = 'testing1234567890_-';
    const hash = await bcryptHash(plainData);

    // compare
    const matchFound = await bcryptCompare(plainData, hash);
    expect(matchFound).toEqual(true);
  });

  it('should return false comparing a different bcrypt hash', async () => {
    const plainData = 'testing1234567890_-';

    const anotherHash = '$2a$12$QFewfPIle0UzpFvQTB8EzebZ4jmfbjLSB7JYBpe6r5xGnjVTdqFjW';

    const matchFound = await bcryptCompare(plainData, anotherHash);
    
    expect(matchFound).toEqual(false);
  });

});

