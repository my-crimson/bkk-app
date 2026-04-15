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
    public $namaFile;

    /**
     * Create a new message instance.
     */
    public function __construct(Lowker $lowker, Alumni $alumni, string $namaFile)
    {
        $this->lowker = $lowker;
        $this->alumni = $alumni;
        $this->namaFile = $namaFile;
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
        $filePath = storage_path('app/public/uploads/lamaran/' . $this->namaFile);
        
        if (file_exists($filePath)) {
            return [
                \Illuminate\Mail\Mailables\Attachment::fromPath($filePath)
                    ->as('Surat-Lamaran.pdf')
                    ->withMime('application/pdf'),
            ];
        }

        return [];
    }
}
