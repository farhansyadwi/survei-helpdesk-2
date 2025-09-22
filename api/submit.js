export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' });
  }
  try {
    const {
      nama,
      email,
      nohp,
      nrp,
      likert,
      saran
    } = req.body || {};

    if (!nama || !email || !nohp || !nrp || !likert) {
      return res.status(400).json({ ok: false, message: 'Data tidak lengkap.' });
    }

    const headers = req.headers || {};
    const clientIp = headers['cf-connecting-ip'] || headers['x-forwarded-for']?.split(',')[0]?.trim() || headers['x-real-ip'] || 'unknown';
    const userAgent = headers['user-agent'] || 'unknown';

    const now = new Date();
    const timestampISO = now.toISOString();
    const localeTime = now.toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });

    const fields = [
      { name: 'Nama', value: String(nama), inline: true },
      { name: 'Email', value: String(email), inline: true },
      { name: 'No HP', value: String(nohp), inline: true },
      { name: 'NRP', value: String(nrp), inline: true },
      { name: '\u200B', value: '\u200B', inline: false },
      { name: 'Kemudahan penggunaan', value: String(likert.kemudahan || '-'), inline: true },
      { name: 'Kecepatan akses', value: String(likert.kecepatan || '-'), inline: true },
      { name: 'Tampilan & desain', value: String(likert.tampilan || '-'), inline: true },
      { name: 'Kelengkapan fitur', value: String(likert.fitur || '-'), inline: true },
      { name: 'Stabilitas aplikasi', value: String(likert.stabilitas || '-'), inline: true },
      { name: 'Keamanan & privasi', value: String(likert.keamanan || '-'), inline: true },
      { name: 'Kesesuaian kebutuhan', value: String(likert.kesesuaian || '-'), inline: true },
      { name: 'Kualitas support', value: String(likert.support || '-'), inline: true },
      { name: 'Kepuasan keseluruhan', value: String(likert.keseluruhan || '-'), inline: true },
      { name: '\u200B', value: '\u200B', inline: false },
      { name: 'Saran', value: saran ? String(saran) : '-', inline: false },
      { name: '\u200B', value: '\u200B', inline: false },
      { name: 'IP', value: String(clientIp), inline: true },
      { name: 'User-Agent', value: '```' + String(userAgent).slice(0, 1000) + '```', inline: false },
      { name: 'Waktu (WIB)', value: String(localeTime), inline: true },
      { name: 'Timestamp (ISO)', value: String(timestampISO), inline: true }
    ];

    const webhookUrl = process.env.WEBHOOK_URL || 'https://discordapp.com/api/webhooks/1419525977524015188/ZHXOZCwgcxhzikGFYQvuLK8Ggl9nFDIu4GsBz9RXw3Q0HZLAi8lD4bpCVlA2uC-rU1Xu';

    const resp = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'Acset Helpdesk Survey',
        embeds: [
          {
            title: 'Survei Kepuasan Pengguna Helpdesk Acset',
            description: 'Pengiriman data survei baru',
            color: 0x1e90ff,
            fields,
            footer: { text: 'Dikirim otomatis dari form survei (Vercel)' },
            timestamp: timestampISO
          }
        ]
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(text || 'Gagal mengirim ke webhook');
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error api/submit:', err.message || err);
    return res.status(500).json({ ok: false, message: 'Gagal mengirim data.' });
  }
}
