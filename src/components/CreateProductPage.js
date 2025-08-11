import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';

const CreateProductPage = ({ parentId = null, onSuccess, onCancel }) => {
  const [availableTypes, setAvailableTypes] = useState([]);
  const [availableGroups, setAvailableGroups] = useState([]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');
  const [unitType, setUnitType] = useState('duration');
  const [durationValue, setDurationValue] = useState('');
  const [durationUnit, setDurationUnit] = useState('days');
  const [quantity, setQuantity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [createUpdateUrl, setCreateUpdateUrl] = useState('');
  const [isVisible, setIsVisible] = useState(true);

  const [step, setStep] = useState(0);

  useEffect(() => {
    const fetchDistinctOptions = async () => {
      const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
      if (!match) return;
      const token = match[2];

      try {
        const res = await fetch(
          'https://bot.kediritechnopark.com/webhook/store-production/get-products',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();
        const productsArr = result || [];

        const types = [...new Set(productsArr.map((p) => p.type).filter(Boolean))];
        const groups = [...new Set(productsArr.map((p) => p.group).filter(Boolean))];

        setAvailableTypes(types);
        setAvailableGroups(groups);
      } catch (err) {
        console.error('Gagal ambil produk:', err);
      }
    };

    fetchDistinctOptions();
  }, []);

  const sendDataToN8N = async () => {
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    if (!match) {
      alert('Token tidak ditemukan. Silakan login kembali.');
      return;
    }
    const token = match[2];

    const isToken = unitType === 'token';
    const payload = {
      name,
      type: selectedType,
      image,
      description,
      price: price === '' ? null : parseInt(price, 10),
      currency: 'IDR',
      duration: isToken ? null : `${parseInt(durationValue || '0', 10)} ${durationUnit}`,
      quantity: isToken ? parseInt(quantity || '0', 10) : null,
      unit_type: unitType,
      sub_product_of: parentId,
      is_visible: isVisible,
      group: selectedGroup || null,
      site_url: siteUrl || null,
      create_update_url: createUpdateUrl || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const response = await fetch(
        'https://bot.kediritechnopark.com/webhook/store-production/add-product',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        alert('Produk berhasil ditambahkan!');
        if (onSuccess) onSuccess();
      } else {
        const errorText = await response.text();
        console.error('Response Error:', errorText);
        alert('Gagal mengirim data: ' + response.status);
      }
    } catch (error) {
      console.error('Error sending data to n8n:', error);
      alert('Terjadi kesalahan saat mengirim data.');
    }
  };

  return (
    <div className={styles.chartCard}>
      <h3 className={styles.transactionsTitle}>
        {parentId ? 'Tambah Sub-Produk' : 'Tambah Produk Baru'}
      </h3>

      {step === 0 && (
        <section className={styles.formSection}>
          <div className={styles.formGroup}>
            <label>Nama Produk</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label>Deskripsi</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label>URL Gambar</label>
            <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
          </div>
        </section>
      )}

      {step === 1 && (
        <section className={styles.formSection}>
          <div className={styles.formGroup}>
            <label>Harga</label>
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label>Jenis Unit</label>
            <select value={unitType} onChange={(e) => setUnitType(e.target.value)}>
              <option value="duration">Durasi</option>
              <option value="token">Token</option>
            </select>
          </div>
          {unitType === 'token' ? (
            <div className={styles.formGroup}>
              <label>Jumlah Token</label>
              <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>
          ) : (
            <div className={styles.formGroup}>
              <label>Durasi</label>
              <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                <input type="number" style={{ width: '100%' }} value={durationValue} onChange={(e) => setDurationValue(e.target.value)} />
                <select value={durationUnit} onChange={(e) => setDurationUnit(e.target.value)}>
                  <option value="days">Hari</option>
                  <option value="weeks">Minggu</option>
                  <option value="months">Bulan</option>
                </select>
              </div>
            </div>
          )}
          <div className={styles.formGroup} style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
            <input id="visible" type="checkbox" checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} />
            <label htmlFor="visible" style={{ margin: 0 }}>Tampilkan produk</label>
          </div>
        </section>
      )}

      {step === 2 && (
        <section className={styles.formSection}>
          <div className={styles.formGroup}>
            <label>Tipe Produk</label>
            <input type="text" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} />
            <div className={styles.suggestionContainer}>
              {availableTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={styles.suggestionButton}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Group</label>
            <input type="text" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} />
            <div className={styles.suggestionContainer}>
              {availableGroups.map((group) => (
                <button
                  key={group}
                  type="button"
                  className={styles.suggestionButton}
                  onClick={() => setSelectedGroup(group)}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Site URL</label>
            <input type="text" value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} />
          </div>
          <div className={styles.formGroup}>
            <label>CREATE UPDATE URL</label>
            <input type="text" value={createUpdateUrl} onChange={(e) => setCreateUpdateUrl(e.target.value)} />
          </div>
        </section>
      )}

      <div className={styles.formActions}>
      

        <button type="button" className={styles.submitButton} style={{visibility: step < 1 ? 'hidden': 'visible' }} onClick={() => setStep((s) => s - 1)}>
        Back
        </button>
        {step < 2 ? (
          <button type="button" className={styles.submitButton} onClick={() => setStep((s) => s + 1)}>
            Next
          </button>
        ) : (
          <button type="button" className={styles.submitButton} onClick={sendDataToN8N}>
            {parentId ? 'Buat Sub-Produk' : 'Buat Produk'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CreateProductPage;
