import { Head, useForm, usePage } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';
import { confirmAction, notifyActionSuccess } from '@/Helpers/actionPopup';

export default function SurveyIndex({ alumni, alumniList, surveyStatus }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing } = useForm({
        survey_choice: '',
        description: '',
        alumni_id: alumni?.id || '',
    });

    const submit = async (e) => {
        e.preventDefault();
        if (alumni && surveyStatus && !surveyStatus.can_submit) {
            return;
        }
        if (!(await confirmAction('kirim survey'))) return;
        post('/survey', {
            onSuccess: () => notifyActionSuccess('kirim survey'),
        });
    };

    return (
        <MainLayout>
            <Head title="Survey" />
            <div className="header-bar"><a href="#">Isi Survey</a></div>
            <div className="survey-container">
                {flash?.success && (
                    <div className="alert alert-success">
                        <i className="fas fa-check-circle"></i> {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="alert alert-error">
                        <i className="fas fa-exclamation-triangle"></i> {flash.error}
                    </div>
                )}

                {alumni && surveyStatus && !surveyStatus.can_submit && (
                    <div className="alert alert-error">
                        Anda sudah mengisi survey. Survey berikutnya dapat dikirim lagi pada {surveyStatus.next_submit_label}.
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="survey-title"><p>FORMULIR PENGISIAN SURVEY</p></div>

                    <div className="survey-box">
                        <div className="survey-choice">
                            {alumni ? (
                                <>
                                    <p>Alumni</p>
                                    <div className="alumni-badge">
                                        <i className="fas fa-user-graduate"></i>
                                        <span>{alumni.nama}</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p>Pilih Nama Alumni</p>
                                    <select name="alumni_id" required
                                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '14px' }}
                                        value={data.alumni_id} onChange={e => setData('alumni_id', e.target.value)}>
                                        <option value="">-- Pilih Nama Alumni --</option>
                                        {alumniList && alumniList.map((a) => (
                                            <option key={a.id} value={a.id}>{a.nama}</option>
                                        ))}
                                    </select>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="survey-box" style={{ marginTop: '15px' }}>
                        <div className="survey-choice">
                            <p>Profesi yang sedang dijalani dalam 6 bulan terakhir</p>
                            <div className="survey-choice-container">
                                {['bekerja', 'wirausaha', 'menganggur', 'magang', 'kuliah', 'pelatihan'].map((opt) => (
                                    <label className="survey-choice-input" key={opt} style={{ cursor: 'pointer' }}>
                                        <input type="radio" name="survey_choice" value={opt}
                                            checked={data.survey_choice === opt}
                                            onChange={e => setData('survey_choice', e.target.value)} />
                                        <p>{opt.charAt(0).toUpperCase() + opt.slice(1)}</p>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="survey-description">
                            <p>Keterangan</p>
                            <textarea placeholder="Misal Jurusan Kuliah/ Bidang Wirausaha/ Jabatan dalam Pekerjaan"
                                name="description" value={data.description}
                                onChange={e => setData('description', e.target.value)}></textarea>
                        </div>
                        <div className="survey-submit">
                            <button
                                type="submit"
                                className="survey-submit-btn"
                                disabled={processing || (alumni && surveyStatus && !surveyStatus.can_submit)}
                            >
                                SUBMIT
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}
