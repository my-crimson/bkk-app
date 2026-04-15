import { Head, router, Link } from '@inertiajs/react';
import { useMemo } from 'react';
import MainLayout from '../../../Layouts/MainLayout';

export default function AdminPerusahaanIndex({ perusahaan, filters = {} }) {
    // ================= DELETE =================
    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus?')) {
            router.delete(`/admin/perusahaan/${id}`, {
                preserveScroll: true,
                preserveState: false, 
            });
        }
    };

    const handleFilter = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get('/admin/perusahaan', {
            search: formData.get('search') || '',
            skala: formData.get('skala') || '',
        }, { preserveState: true, replace: true });
    };

    const rows = useMemo(() => perusahaan?.data || [], [perusahaan]);
    const links = perusahaan?.links || [];
    const from = perusahaan?.from || 0;
    const to = perusahaan?.to || 0;
    const total = perusahaan?.total || 0;

    return (
        <MainLayout>
            <Head title="CRUD Perusahaan" />

            <div className="header-bar">
                <a href="#">CRUD / Perusahaan</a>
            </div>

            <div className="search-container">
                <form className="search" onSubmit={handleFilter}>
                    <label htmlFor="search-perusahaan">Pencarian:</label>
                    <input
                        id="search-perusahaan"
                        name="search"
                        className="search-input"
                        defaultValue={filters?.search || ''}
                    />
                    <label htmlFor="skala-perusahaan">Skala Perusahaan:</label>
                    <select
                        id="skala-perusahaan"
                        name="skala"
                        className="search-select"
                        defaultValue={filters?.skala || ''}
                    >
                        <option value="">-- Semua Jenis --</option>
                        <option value="lokal">Lokal</option>
                        <option value="Provinsi">Provinsi</option>
                        <option value="Nasional">Nasional</option>
                        <option value="Internasional">Internasional</option>
                    </select>
                    <button className="search-button" type="submit">Cari</button>
                </form>
            </div>

            <div className="perusahaan-admin-wrap">
                <Link className="perusahaan-add-card" href="/admin/perusahaan/create">
                    <i className="fa-solid fa-plus"></i>
                    <p>Tambahkan Perusahaan</p>
                </Link>

                {rows.length > 0 ? rows.map((p) => (
                    <div className="perusahaan-admin-card" key={p.id_perusahaan}>
                        <div className="perusahaan-card-image">
                            {p.gambar ? (
                                <img src={`/storage/gambar_perusahaan/${p.gambar}`} alt={p.nama} />
                            ) : (
                                <div className="perusahaan-card-image-fallback">tidak tersedia</div>
                            )}
                        </div>
                        <div className="perusahaan-card-info">
                            <h3>{p.nama}</h3>
                            <p><i className="fa-solid fa-location-dot"></i>{p.alamat || '-'}</p>
                            <p><i className="fa-solid fa-briefcase"></i>{p.jenis || '-'}</p>
                            <p><i className="fa-solid fa-envelope"></i>{p.email || '-'}</p>
                        </div>
                        <div className="perusahaan-card-actions">
                            <Link href={`/admin/perusahaan/${p.id_perusahaan}/edit`} className="perusahaan-btn perusahaan-btn-edit">
                                <i className="fa-solid fa-pen-to-square"></i> Edit
                            </Link>
                            <button onClick={() => handleDelete(p.id_perusahaan)} className="perusahaan-btn perusahaan-btn-delete">
                                <i className="fa-solid fa-trash"></i> Hapus
                            </button>
                        </div>
                    </div>
                )) : (
                    <p className="no-data">Belum ada data perusahaan.</p>
                )}

                <div className="pagination-container">
                    <div className="pagination-info">
                        <p>Ditampilkan <strong>{from}</strong> sampai <strong>{to}</strong> dari total <strong>{total}</strong> perusahaan</p>
                    </div>
                    <div className="pagination">
                        {links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`${link.active ? 'active' : ''} ${String(link.label).includes('Previous') || String(link.label).includes('Next') ? 'navigate' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                preserveScroll
                            />
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}