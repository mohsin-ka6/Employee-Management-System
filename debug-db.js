const fs = require('fs');
const { MongoClient } = require('mongodb');
const env = fs.readFileSync('.env.local', 'utf8')
  .split(/\r?\n/)
  .filter(Boolean)
  .reduce((a, l) => {
    const idx = l.indexOf('=');
    if (idx !== -1) {
      const k = l.slice(0, idx);
      const v = l.slice(idx + 1);
      if (!k.startsWith('#')) a[k] = v;
    }
    return a;
  }, {});
const uri = env.MONGODB_URI;
if (!uri) {
  console.error('NO_URI');
  process.exit(1);
}
(async () => {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db();
    const users = await db.collection('users').find().toArray();
    console.log(JSON.stringify(users, null, 2));
    await client.close();
  } catch (e) {
    console.error('ERR', e.message);
    process.exit(1);
  }
})();
