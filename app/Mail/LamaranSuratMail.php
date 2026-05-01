<?php

namespace App\Mail;

use App\Models\Lowker;
use App\Models\Alumni;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LamaranSuratMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $lowker;
    public $alumni;
    public $namaFileLamaran;
    public $namaFileCv;

    /**
     * Create a new message instance.
     */
    public function __construct(Lowker $lowker, Alumni $alumni, string $namaFileLamaran, string $namaFileCv)
    {
        $this->lowker = $lowker;
        $this->alumni = $alumni;
        $this->namaFileLamaran = $namaFileLamaran;
        $this->namaFileCv = $namaFileCv;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Lamaran Baru - {$this->lowker->judul_lowker} dari {$this->alumni->nama}",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.lamaran_template',
            with: [
                'lowker' => $this->lowker,
                'alumni' => $this->alumni,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        $attachments = [];

        // Attach Lamaran
        $filePathLamaran = storage_path('app/public/uploads/lamaran/' . $this->namaFileLamaran);
        if (file_exists($filePathLamaran)) {
            $extension = strtolower(pathinfo($this->namaFileLamaran, PATHINFO_EXTENSION));
            $mimeTypes = [
                'pdf'  => 'application/pdf',
                'doc'  => 'application/msword',
                'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ];
            $mime = $mimeTypes[$extension] ?? 'application/octet-stream';
            $displayName = 'Surat-Lamaran-' . $this->alumni->nama . '.' . $extension;

            $attachments[] = \Illuminate\Mail\Mailables\Attachment::fromPath($filePathLamaran)
                ->as($displayName)
                ->withMime($mime);
        }

        // Attach CV
        $filePathCv = storage_path('app/public/uploads/lamaran/' . $this->namaFileCv);
        if (file_exists($filePathCv)) {
            $extensionCv = strtolower(pathinfo($this->namaFileCv, PATHINFO_EXTENSION));
            $mimeTypesCv = [
                'pdf'  => 'application/pdf',
                'doc'  => 'application/msword',
                'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ];
            $mimeCv = $mimeTypesCv[$extensionCv] ?? 'application/octet-stream';
            $displayNameCv = 'CV-' . $this->alumni->nama . '.' . $extensionCv;

            $attachments[] = \Illuminate\Mail\Mailables\Attachment::fromPath($filePathCv)
                ->as($displayNameCv)
                ->withMime($mimeCv);
        }

        return $attachments;
    }
}
