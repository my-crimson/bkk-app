import { Head } from '@inertiajs/react';
import MainLayout from '../../Layouts/MainLayout';

export default function ManagementDashboard({ stats }) {
    return (
        <MainLayout>
            <Head title="Dashboard Management" />
            <div className="header-bar">
                <a href="#">Management / Dashboard</a>
            </div>

            <div style={{ padding: '20px' }}>
                <h2 style={{ color: '#134CBC', marginBottom: '20px' }}>Dashboard Management</h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px'
                }}>
                    <div style={{
                        background: '#fff',
                        padding: '20px',
                        borderRadius: '10px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ fontSize: '2em', color: '#134CBC' }}>{stats?.total_alumni || 0}</h3>
                        <p style={{ color: '#888' }}>Total Alumni</p>
                    </div>

                    <div style={{
                        background: '#fff',
                        padding: '20px',
                        borderRadius: '10px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ fontSize: '2em', color: '#4CAF50' }}>{stats?.total_lowker || 0}</h3>
                        <p style={{ color: '#888' }}>Total Lowongan</p>
                    </div>

                    <div style={{
                        background: '#fff',
                        padding: '20px',
                        borderRadius: '10px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ fontSize: '2em', color: '#FF9800' }}>{stats?.total_lamaran || 0}</h3>
                        <p style={{ color: '#888' }}>Total Lamaran</p>
                    </div>

                    <div style={{
                        background: '#fff',
                        padding: '20px',
                        borderRadius: '10px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ fontSize: '2em', color: '#9C27B0' }}>{stats?.total_perusahaan || 0}</h3>
                        <p style={{ color: '#888' }}>Total Perusahaan</p>
                    </div>

                    <div style={{
                        background: '#fff',
                        padding: '20px',
                        borderRadius: '10px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ fontSize: '2em', color: '#E91E63' }}>{stats?.total_survey || 0}</h3>
                        <p style={{ color: '#888' }}>Responden Tracer Study</p>
                    </div>
                </div>

                <div style={{
                    background: '#fff',
                    padding: '20px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ color: '#134CBC', marginBottom: '15px' }}>Selamat Datang</h3>
                    <p style={{ color: '#555', lineHeight: '1.6' }}>
                        Ini adalah halaman Dashboard Management BKK. Anda dapat melihat ringkasan data
                        alumni, lowongan kerja, lamaran, dan tracer study dari halaman ini.
                    </p>
                </div>
            </div>
        </MainLayout>
    );
}
