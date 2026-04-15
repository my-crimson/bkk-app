import { Head, router } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function RekapLoker({
    cards = [],
    perusahaanOptions = [],
    lokasiOptions = [],
    filters = {},
    summary = {},
}) {
    const handleFilter = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get('/admin/rekap-loker', {
            perusahaan: formData.get('perusahaan') || '',
            lokasi: formData.get('lokasi') || '',
            jurusan: formData.get('jurusan') || '',
            rentang: formData.get('rentang') || 'all',
        }, { preserveState: true, replace: true });
    };

    return (
        <MainLayout>
            <Head title="Rekap Lowongan Kerja" />
            <div className="header-bar"><a href="#">Rekap / Lowongan Kerja</a></div>

            <div className="rekap-loker-wrap">
                <h2 className="rekap-loker-title">REKAPITULASI DATA LOWONGAN KERJA</h2>

                <form className="rekap-loker-filter" onSubmit={handleFilter}>
                    <select name="perusahaan" defaultValue={filters.perusahaan || ''}>
                        <option value="">perusahaan</option>
                        {perusahaanOptions.map((nama) => (
                            <option key={nama} value={nama}>{nama}</option>
                        ))}
                    </select>
                    <select name="lokasi" defaultValue={filters.lokasi || ''}>
                        <option value="">lokasi</option>
                        {lokasiOptions.map((lokasi) => (
                            <option key={lokasi} value={lokasi}>{lokasi}</option>
                        ))}
                    </select>
                    <select name="rentang" defaultValue={filters.rentang || 'all'}>
                        <option value="all">terdaftar kapan saja</option>
                        <option value="today">hari ini</option>
                        <option value="7d">7 hari terakhir</option>
                        <option value="30d">30 hari terakhir</option>
                    </select>
                    <select name="jurusan" defaultValue={filters.jurusan || ''}>
                        <option value="">semua jurusan</option>
                        {cards.map((card) => (
                            <option key={card.kode} value={card.kode}>{card.kode}</option>
                        ))}
                    </select>
                    <button type="submit">Cari</button>
                </form>

                <h3 className="rekap-loker-subtitle">REKAPITULASI</h3>

                <div className="rekap-loker-grid">
                    {cards.map((card) => (
                        <div className="rekap-loker-card" key={card.kode}>
                            <h4>{card.kode}</h4>
                            <p>{card.jumlah_lowongan} lowongan</p>
                        </div>
                    ))}
                </div>

                <div className="rekap-loker-summary">
                    <p>Jumlah lowongan terdaftar : <strong>{summary.total_lowongan || 0}</strong></p>
                    <p>Jumlah perusahaan terdaftar : <strong>{summary.total_perusahaan || 0}</strong></p>
                </div>
            </div>
        </MainLayout>
    );
}
