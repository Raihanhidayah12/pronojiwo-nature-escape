<x-mail::message>
# Halo, {{ $pesan->nama_lengkap }}!

Terima kasih telah menghubungi kami melalui portal resmi wisata **Pronojiwo Nature Escape**.

Terkait dengan pertanyaan Anda dengan subjek **"{{ $pesan->subjek }}"**, berikut adalah balasan dari tim representatif kami:

<x-mail::panel>
**Pesan Asli Anda:**
> _{{ $pesan->pesan }}_

**Balasan Admin:**
{{ $pesan->balasan }}
</x-mail::panel>

Jika Anda memiliki pertanyaan lebih lanjut, jangan ragu untuk membalas email ini atau mengajukan tiket pertanyaan baru di website kami.

<x-mail::button :url="url('/')" color="success">
Kunjungi Website Kami
</x-mail::button>

Salam hangat,<br>
**Tim Layanan & Reservasi**<br>
{{ config('app.name') }}
</x-mail::message>
