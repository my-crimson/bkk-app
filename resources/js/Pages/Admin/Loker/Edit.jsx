import { Head, useForm } from '@inertiajs/react';
import MainLayout from '../../../Layouts/MainLayout';
import { confirmAction, notifyActionSuccess } from '@/Helpers/actionPopup';

export default function AdminLokerEdit({ lowker, perusahaan, jurusan }) {

    const { data, setData, put, processing } = useForm({
        judul_lowker: lowker.judul_lowker || '',
        deskripsi: lowker.deskripsi || '',
        persyaratan: lowker.persyaratan || '',
        gaji: lowker.gaji || '',
        lokasi: lowker.lokasi || '',
        tgl_ditutup: lowker.tgl_ditutup || '',
        id_perusahaan: lowker.id_perusahaan || '',
        id_jurusan: lowker.id_jurusan || '',
        status: lowker.status || 'aktif',
    });

    const handleGajiChange = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value) {
            value = 'Rp ' + parseInt(value, 10).toLocaleString('id-ID');
        }
        setData('gaji', value);
    };

    const submit = async (e) => {
        e.preventDefault();

        if (!(await confirmAction('update lowongan kerja'))) return;

        put(`/admin/loker/${lowker.id_lowker}`, {
            onSuccess: () => notifyActionSuccess('update lowongan kerja'),
        });
    };

    return (
        <MainLayout>
            <Head title="Edit Lowongan Kerja" />

            <div className="header-bar">
                <a href="#">CRUD / Edit Lowongan Kerja</a>
            </div>

            <div className="crud-form">

                <h2 style={{ marginBottom: '20px', color: '#134CBC' }}>
                    Edit Lowongan Kerja
                </h2>

                <form onSubmit={submit}>

                    <div className="form-group">
                        <label>
                            Judul Lowongan <span style={{ color: 'red' }}>*</span>
                        </label>

                        <input
                            value={data.judul_lowker}
                            onChange={e => setData('judul_lowker', e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Perusahaan <span style={{ color: 'red' }}>*</span>
                        </label>

                        <select
                            value={data.id_perusahaan}
                            onChange={e => setData('id_perusahaan', e.target.value)}
                            required
                        >
                            <option value="">-- Pilih --</option>

                            {perusahaan?.map((p) => (
                                <option
                                    key={p.id_perusahaan}
                                    value={p.id_perusahaan}
                                >
                                    {p.nama}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>
                            Jurusan <span style={{ color: 'red' }}>*</span>
                        </label>

                        <select
                            value={data.id_jurusan}
                            onChange={e => setData('id_jurusan', e.target.value)}
                            required
                        >
                            <option value="">-- Pilih --</option>

                            {jurusan?.map((j) => (
                                <option
                                    key={j.id_jurusan}
                                    value={j.id_jurusan}
                                >
                                    {j.jurusan}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>
                            Deskripsi <span style={{ color: 'red' }}>*</span>
                        </label>

                        <textarea
                            value={data.deskripsi}
                            onChange={e => setData('deskripsi', e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Persyaratan <span style={{ color: 'red' }}>*</span>
                        </label>

                        <textarea
                            value={data.persyaratan}
                            onChange={e => setData('persyaratan', e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Gaji
                        </label>

                        <input
                            value={data.gaji}
                            onChange={handleGajiChange}
                            placeholder="Rp "
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Lokasi <span style={{ color: 'red' }}>*</span>
                        </label>

                        <input
                            value={data.lokasi}
                            onChange={e => setData('lokasi', e.target.value)}
                            required
                        />
                    </div>



                    <div className="form-group">
                        <label>
                            Tanggal Ditutup <span style={{ color: 'red' }}>*</span>
                        </label>

                        <input
                            type="date"
                            value={data.tgl_ditutup}
                            onChange={e => setData('tgl_ditutup', e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>
                            Status <span style={{ color: 'red' }}>*</span>
                        </label>

                        <select
                            value={data.status}
                            onChange={e => setData('status', e.target.value)}
                            required
                        >
                            <option value="aktif">Aktif</option>
                            <option value="nonaktif">Nonaktif</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={processing}
                    >
                        {processing ? 'Mengupdate...' : 'Update'}
                    </button>

                </form>
            </div>
        </MainLayout>
    );
}