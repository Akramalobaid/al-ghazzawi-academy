import { SITE } from "@/lib/site";

/**
 * Print-only watermark. A faint diagonal academy name (via CSS ::before in the
 * print stylesheet) plus a footer bar with the brand + WhatsApp on every printed
 * page. Hidden on screen (`hidden`), shown only when printing (`print:block`).
 */
export function PrintWatermark() {
  return (
    <div className="print-watermark hidden print:block" aria-hidden>
      <div className="print-watermark-bar">
        أكاديمية الغزاوي · Al-Ghazzawi Academy — للتواصل واتساب{" "}
        {SITE.contact.whatsappDisplay}
      </div>
    </div>
  );
}
